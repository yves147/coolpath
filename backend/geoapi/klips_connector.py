import math
import os
import errno
from datetime import datetime, timedelta

from owslib.wms import WebMapService


def makeSurePathExists(path):
    try:
        os.makedirs(path)
    except OSError as exception:
        if exception.errno != errno.EEXIST:
            raise


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


def getSizeFromBoundingBox(bbox, **kwargs):
    # res: meters per pixel
    res = kwargs["res"] if "res" in kwargs else 10
    left, bottom, right, top = bbox

    # compute required size of queried image
    widthInMeters = distanceInMBetweenEarthCoords(bottom, left, bottom, right)
    heightInMeters = distanceInMBetweenEarthCoords(bottom, left, top, left)

    widthInPixels = round(widthInMeters / res)
    heightInPixels = round(heightInMeters / res)

    return (widthInPixels, heightInPixels)


def main():
    # Initialize WMS service connection
    wms = WebMapService(
        "https://klips-dev.terrestris.de/geoserver/ows", version="1.3.0")
    print(f"Connected to WMS service: {wms.identification.title}")

    # Get interesting layers
    # [print(layer) for layer in wms.contents]
    ptLayerName = "dresden:dresden_summer_perceived"
    ptLayer = wms[ptLayerName]
    print(f"Selecting layer: {ptLayer.title}")

    # Get bounding box
    ptBox = ptLayer.boundingBoxWGS84
    print("Bounding box of layer:")
    print(f"  bottom left: {ptBox[1]} N, {ptBox[0]} E")
    print(f"  top right:   {ptBox[3]} N, {ptBox[2]} E")

    ptSize = getSizeFromBoundingBox(ptBox, res=10)
    print(f"Resulting image size in px: ({ptSize[0]}, {ptSize[1]})")

    # Get time window
    ptDates = ptLayer.timepositions[0].split("/")
    ptStartDate = datetime.fromisoformat(ptDates[0])
    ptEndDate = datetime.fromisoformat(ptDates[1])

    ptTimeResolution = timedelta(hours=1)

    # Prepare folder
    tmpPath = "/tmp/klips"
    makeSurePathExists(tmpPath)

    # Iterate over time window
    ptIterDate = ptStartDate
    while ptIterDate <= ptEndDate:
        dateForRequest = ptIterDate.strftime("%Y-%m-%dT%H:%M:%S.000Z")
        dateForFile = ptIterDate.strftime("%Y-%m-%d_%H.%M.%S")
        dateForConsole = ptIterDate.strftime("%d.%m.%Y %H:%M:%S")
        print(f"Downloading for time {dateForConsole} ...")

        # Download PNG
        img = wms.getmap(layers=[ptLayerName],
                         srs="EPSG:4326",  # geodetic reference system: WGS84
                         bbox=ptBox,
                         time=dateForRequest,
                         size=ptSize,
                         format="image/png",
                         transparent=True)

        # Write to file
        out = open(f"{tmpPath}/klips_heat_{dateForFile}.png", "wb")
        out.write(img.read())
        out.close()

        # Increment time
        ptIterDate += ptTimeResolution

    # All done :)
    print("Yay! Done!")


if __name__ == "__main__":
    main()
