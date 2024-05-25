import numpy as np
import os
from PIL import Image
from numpy.typing import NDArray

from .klips_connector import Layer


__resourcePath__ = os.path.join(os.path.dirname(__file__), "resources")
__layerToLegend__ = {
    Layer.PERCEIVED_TEMPERATURE: {
        "path": os.path.join(__resourcePath__, "legend_perceived_temp_only_colors.png"),
        "minTemp": 14,
        "maxTemp": 31
    }
}

__layerColorTempMap__: dict[Layer, tuple[NDArray, list]] = {}


def logMsg(msg):
    print(f"[{__name__}] {msg}")


def extractColorsAndTemperatures(layer: Layer):
    global __layerToLegend__, __layerColorTempMap__

    # Check if the legend colors and temperatures are already cached
    if layer in __layerColorTempMap__:
        logMsg(f"Returning cached legend colors for layer {str(layer)}")
        return __layerColorTempMap__[layer]

    # Load the legend image
    layerInfo = __layerToLegend__[layer]
    legendImage = Image.open(layerInfo["path"]).convert("RGB")

    # Get the image dimensions
    width, height = legendImage.size

    # Extract the colors at each vertical position
    colors = []
    temperatures = []

    for y in range(height):
        # Get the color at the middle of the width
        color = legendImage.getpixel((width // 2, y))
        colors.append(color)

        # Calculate the corresponding temperature based on the y position
        # Here we assume that the temperature range is linear from top to bottom; this is not accurate is the legend is
        # stretched in the middle, but it's not gonna get any better for now
        temperature = layerInfo["minTemp"] + (layerInfo["maxTemp"] - layerInfo["minTemp"]) * (y / height)
        temperatures.append(temperature)

    # Convert colors to a numpy array for easy distance calculation
    colors = np.array(colors)

    # Cache the results
    __layerColorTempMap__[layer] = (colors, temperatures)

    return (colors, temperatures)


def closestTemperature(inputColor, colors, temperatures):
    # Calculate the Euclidean distance between the input color and all colors in the palette
    distances = np.sqrt(np.sum((colors - inputColor) ** 2, axis=1))

    # Find the index of the smallest distance
    closestIndex = np.argmin(distances)

    # Return the corresponding temperature
    return temperatures[closestIndex]


def convertColorToTemperature(layer: Layer, pixel: tuple[int, int, int] | tuple[int, int, int, int]):
    pixelWithoutAlpha = pixel[:3]
    colors, temperatures = extractColorsAndTemperatures(layer)
    return closestTemperature(pixelWithoutAlpha, colors, temperatures)


def main():
    # Example usage
    inputColor = (255, 0, 0)  # Replace this with your input color
    colors, temperatures = extractColorsAndTemperatures(Layer.PERCEIVED_TEMPERATURE)
    temperature = closestTemperature(inputColor, colors, temperatures)
    print(f"The temperature corresponding to the color {inputColor} is {temperature:.2f} °C")


if __name__ == "__main__":
    main()
