from datetime import datetime, timedelta
from enum import StrEnum
import errno
from io import BytesIO
import math
import os
from PIL import Image
import typing

from owslib.map.wms130 import ContentMetadata, WebMapService_1_3_0
from owslib.wms import WebMapService


__wmsUrl__ = "https://klips-dev.terrestris.de/geoserver/ows"
__wmsVersion__ = "1.3.0"
__wms__ = None

__layerImageMap__: dict[str, Image.Image] = {}


class Layer(StrEnum):
    PERCEIVED_TEMPERATURE = "dresden:dresden_summer_perceived"
    KLIMATOPE = "dresden:klimatope"


def logMsg(msg):
    if "LOGGING" in os.environ:
        print(f"[{__name__}] {msg}")


def getLayerTimeKey(layerName: str, time: datetime | None = None):
    return f"{layerName}\0{'0000000000' if time is None else time.strftime('%Y%m%d%H')}"


def getWms() -> WebMapService_1_3_0:
    global __wms__, __wmsUrl__, __wmsVersion__
    if __wms__ is None:
        __wms__ = typing.cast(WebMapService_1_3_0, WebMapService(__wmsUrl__, version=__wmsVersion__))
    return __wms__


def degToRad(deg):
    return deg * math.pi / 180


def distanceInMBetweenEarthCoords(lat1, lon1, lat2, lon2):
    earthRadiusKm = 6371

    dLatRad = degToRad(lat2 - lat1)
    dLonRad = degToRad(lon2 - lon1)

    lat1Rad = degToRad(lat1)
    lat2Rad = degToRad(lat2)

    a = math.sin(dLatRad / 2) * math.sin(dLatRad / 2) + \
        math.sin(dLonRad / 2) * math.sin(dLonRad / 2) * \
        math.cos(lat1Rad) * math.cos(lat2Rad)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return earthRadiusKm * c * 1000


def getBoundingBox(layer: ContentMetadata | str):
    if isinstance(layer, str):
        wms = getWms()
        layer = typing.cast(ContentMetadata, wms[layer])

    bbox = typing.cast(tuple[float, float, float, float], layer.boundingBoxWGS84)
    return {"top": bbox[3], "right": bbox[2], "bottom": bbox[1], "left": bbox[0]}


def getSizeFromBoundingBox(bbox: dict[str, float], **kwargs):
    # res: meters per pixel
    res = kwargs["res"] if "res" in kwargs else 10

    # compute required size of queried image
    widthInMeters = distanceInMBetweenEarthCoords(bbox["bottom"], bbox["left"], bbox["bottom"], bbox["right"])
    heightInMeters = distanceInMBetweenEarthCoords(bbox["bottom"], bbox["left"], bbox["top"], bbox["left"])

    widthInPixels = round(widthInMeters / res)
    heightInPixels = round(heightInMeters / res)

    return (widthInPixels, heightInPixels)


def getTimeFrameOfLayer(layer: ContentMetadata):
    if layer.timepositions is None:
        raise RuntimeError(f"The layer {layer.title} has no time positions!")

    startDateStr, endDateStr = layer.timepositions[0].split("/")[:2]
    startDate = datetime.fromisoformat(startDateStr)
    endDate = datetime.fromisoformat(endDateStr)

    return (startDate, endDate)


def downloadLayer(layerName: str, time: datetime | None = None):
    global __layerImageMap__

    # Get basic data
    wms = getWms()
    layer: ContentMetadata = wms[layerName]

    if time is not None:
        # Truncate given time (no minutes or seconds supported)
        if time.minute != 0 or time.second != 0:
            logMsg(f"Given time has non-zero minutes ({time.minute}) or seconds ({time.second}), setting them to zero")
            time = time.replace(minute=0, second=0)

        # Confirm that the time is valid
        startDate, endDate = getTimeFrameOfLayer(layer)
        if time < startDate or time > endDate:
            raise RuntimeError(f"Given time {str(time)} is not within [{str(startDate)}, {str(endDate)}]")

    # Check if the image is already cached
    key = getLayerTimeKey(layerName, time)
    if key in __layerImageMap__:
        logMsg(f"Returning \"{layerName}\" at {'(no time)' if time is None else time.strftime('%d/%m/%Y %H:%M:%S')} from cache")
        return __layerImageMap__[key]

    # Image is not yet cached → download and cache it
    logMsg(f"Downloading \"{layerName}\" at {'(no time)' if time is None else time.strftime('%d/%m/%Y %H:%M:%S')} ...")

    boundingBox = getBoundingBox(layer)
    imageDimensions = getSizeFromBoundingBox(boundingBox, res=10)

    # Download PNG
    response = wms.getmap(layers=[str(layerName)],
                          srs="EPSG:4326",  # geodetic reference system: WGS84
                          bbox=(boundingBox["left"], boundingBox["bottom"], boundingBox["right"], boundingBox["top"]),
                          time=(None if time is None else time.strftime("%Y-%m-%dT%H:%M:%S.000Z")),
                          size=imageDimensions,
                          format="image/png",
                          transparent=True)

    # Cache the image
    image = Image.open(BytesIO(response.read())).convert("RGBA")
    __layerImageMap__[key] = image

    return image


def makeSurePathExists(path):
    try:
        os.makedirs(path)
    except OSError as exception:
        if exception.errno != errno.EEXIST:
            raise


# Main function: if this module is executed directly, download all heat layers from summer 2023 and store them in
# /tmp/klips
def main():
    # Initialize WMS service connection
    wms = getWms()
    print(f"Connected to WMS service: {wms.identification.title}")
    print(f"Found {len(wms.contents)} map layers")

    # Get interesting layers
    # [print(layer) for layer in wms.contents]
    percTempLayer = wms[str(Layer.PERCEIVED_TEMPERATURE)]
    print(f"Selecting layer: {percTempLayer.title}")

    # Get bounding box
    percTempBox = getBoundingBox(percTempLayer)
    print("Bounding box of layer:")
    print(f"  bottom left: {percTempBox['bottom']} N, {percTempBox['left']} E")
    print(f"  top right:   {percTempBox['top']} N, {percTempBox['right']} E")

    ptSize = getSizeFromBoundingBox(percTempBox, res=10)
    print(f"Resulting image size in px: ({ptSize[0]}, {ptSize[1]})")

    # Get time window
    ptStartDate, ptEndDate = getTimeFrameOfLayer(percTempLayer)
    ptTimeResolution = timedelta(hours=1)
    startStr = ptStartDate.strftime('%d/%m/%Y %H:%M:%S')
    endStr = ptEndDate.strftime('%d/%m/%Y %H:%M:%S')
    print(f"Time frame of layer: {startStr} - {endStr}")

    # Prepare folder
    tmpPath = "/tmp/klips"
    makeSurePathExists(tmpPath)

    # Iterate over time window
    ptIterDate = ptStartDate
    # while ptIterDate <= ptEndDate:
    while ptIterDate <= ptStartDate:  # 1 iteration for testing purposes
        # Get PIL Image
        print(f"Downloading for {ptIterDate.strftime('%d/%m/%Y %H:%M:%S')} ...")
        img = downloadLayer(str(Layer.PERCEIVED_TEMPERATURE), ptIterDate)

        # Write to file
        img.save(f"{tmpPath}/klips_heat_{ptIterDate.strftime('%Y-%m-%d_%H.%M.%S')}.png")

        # Increment time
        ptIterDate += ptTimeResolution

    # All done :) proceed to next layer
    print("Done!")

    klimaTempLayer = wms[str(Layer.KLIMATOPE)]
    print(f"Selecting layer: {klimaTempLayer.title}")

    # Get bounding box
    klimaTempBox = getBoundingBox(klimaTempLayer)
    print("Bounding box of layer:")
    print(f"  bottom left: {klimaTempBox['bottom']} N, {klimaTempBox['left']} E")
    print(f"  top right:   {klimaTempBox['top']} N, {klimaTempBox['right']} E")

    ktSize = getSizeFromBoundingBox(klimaTempBox, res=10)
    print(f"Resulting image size in px: ({ktSize[0]}, {ktSize[1]})")

    # Prepare folder
    tmpPath = "/tmp/klips"
    makeSurePathExists(tmpPath)

    # Only one image as it is time-invariant
    # Get PIL Image
    print("Downloading ...")
    img = downloadLayer(str(Layer.KLIMATOPE))

    # Write to file
    img.save(f"{tmpPath}/klips_klima.png")

    # All done :)
    print("Done!")


if __name__ == "__main__":
    main()