from datetime import datetime
import math
from operator import itemgetter
import os

from PIL.Image import ImagePointHandler

from .klips_connector import downloadLayer, getBoundingBox, Layer


def logMsg(msg):
    if "LOGGING" in os.environ:
        print(f"[{__name__}] {msg}")


def getLayerSpaceTimePixel(layer: Layer, lat: float, lon: float, time: datetime | None = None):
    logMsg(f"Getting pixel for layer {str(layer)}, lat {lat}, lon {lon}, time {'(no time)' if time is None else time.strftime('%d/%m/%Y %H:%M:%S')}")

    # Do sanity checks on received coordinates
    top, right, bottom, left = itemgetter("top", "right", "bottom", "left")(getBoundingBox(str(layer)))
    if lat < bottom or lat > top:
        raise RuntimeError(f"Latitude {lat} is not within [{bottom}, {top}]")
    if lon < left or lon > right:
        raise RuntimeError(f"Longitude {lon} is not within [{left}, {right}]")

    # Get the image (includes sanity check on received time)
    image = downloadLayer(str(layer), time)
    imgWidth, imgHeight = image.size

    # Get fraction from left and bottom
    widthFrac = (lon - left) / (right - left)
    heightFrac = (lat - bottom) / (top - bottom)

    # Get corresponding pixel
    # careful: pixel-Y starts at top, while latitude starts at bottom, need to convert
    pixelX = max(0, min(imgWidth - 1, round(widthFrac * imgWidth)))
    pixelY = max(0, min(imgHeight - 1, round((1 - heightFrac) * imgHeight)))

    logMsg(f"Returning pixel ({pixelX}, {pixelY})")
    return image.getpixel((pixelX, pixelY))


def main():
    testPxHeat = getLayerSpaceTimePixel(Layer.PERCEIVED_TEMPERATURE, 51.08477, 13.77843,
                                        datetime.fromisoformat("2023-08-10T15:00:00+00:00"))
    testPxKlima = getLayerSpaceTimePixel(Layer.KLIMATOPE, 51.08477, 13.77843)
    print(f"Pixel value:\n  heat:   {testPxHeat}\n  climate: {testPxKlima}")


if __name__ == "__main__":
    main()
