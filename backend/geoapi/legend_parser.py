import numpy as np
import os
from PIL import Image
from numpy.typing import NDArray

from .klips_connector import Layer


__resourcePath__ = os.path.join(os.path.dirname(__file__), "resources")
__layerToLegend__ = {
    Layer.PERCEIVED_TEMPERATURE: {
        "path": os.path.join(__resourcePath__, "legend_perceived_temp_only_colors.png"),
        "min": 14,
        "max": 31
    },
    Layer.KLIMATOPE: {
        "path": os.path.join(__resourcePath__, "legend_klimatope_only_colors.png"),
        "min": -2,
        "max": 6
    }
}

__layerColorValueMap__: dict[Layer, tuple[NDArray, list]] = {}


def logMsg(msg):
    if "LOGGING" in os.environ:
        print(f"[{__name__}] {msg}")


def extractColorsAndValues(layer: Layer):
    global __layerToLegend__, __layerColorValueMap__

    # Check if the legend colors and values are already cached
    if layer in __layerColorValueMap__:
        logMsg(f"Returning cached legend colors for layer {str(layer)}")
        return __layerColorValueMap__[layer]

    # Load the legend image
    layerInfo = __layerToLegend__[layer]
    legendImage = Image.open(layerInfo["path"]).convert("RGB")

    # Get the image dimensions
    width, height = legendImage.size

    # Extract the colors at each vertical position
    colors = []
    values = []

    for y in range(height):
        # Get the color at the middle of the width
        color = legendImage.getpixel((width // 2, y))
        colors.append(color)

        # Calculate the corresponding temperature based on the y position
        # Here we assume that the temperature range is linear from top to bottom; this is not accurate is the legend is
        # stretched in the middle, but it's not gonna get any better for now
        temperature = layerInfo["min"] + (layerInfo["max"] - layerInfo["min"]) * (y / height)
        values.append(temperature)

    # Convert colors to a numpy array for easy distance calculation
    colors = np.array(colors)

    # Cache the results
    __layerColorValueMap__[layer] = (colors, values)

    return (colors, values)


def closestValue(inputColor, colors, values):
    # Calculate the Euclidean distance between the input color and all colors in the palette
    distances = np.sqrt(np.sum((colors - inputColor) ** 2, axis=1))

    # Find the index of the smallest distance
    closestIndex = np.argmin(distances)

    # Return the corresponding temperature
    return values[closestIndex]


def convertColorToValue(layer: Layer, pixel: tuple[int, int, int] | tuple[int, int, int, int]):
    pixelWithoutAlpha = pixel[:3]
    colors, values = extractColorsAndValues(layer)
    value = closestValue(pixelWithoutAlpha, colors, values)
    logMsg(f"Returning value: {value}")
    return value


def main():
    # Example usage
    inputColor = (200, 255, 200)  # Replace this with your input color
    colors, values = extractColorsAndValues(Layer.KLIMATOPE)
    print(f"Colors: {colors}, values: {values}")
    value = closestValue(inputColor, colors, values)
    print(f"The value corresponding to the color {inputColor} is {value}")


if __name__ == "__main__":
    main()
