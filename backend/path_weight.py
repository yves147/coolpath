from datetime import datetime
import math

from geoapi import convertColorToValue, getLayerSpaceTimePixel, Layer

def coords_to_distance(coords_list: list[tuple[float,float]]) -> tuple[float,tuple[float,float]]:
    distance_list = []
    distance_list.append((0, coords_list[0]))
    d = 0.0
    i = 0
    for el in coords_list[1:]:
        last_coords = distance_list[i][1]
        distance_to_last = math.sqrt(pow(last_coords[0]-el[0], 2) + pow(last_coords[1]-el[1], 2))
        d += distance_to_last
        distance_list.append((distance_to_last, el))
        i += 1
    
    return distance_list

def temperature_at_coords(lon, lat) -> float:
    return 1

def average_windspeed_at_coords(lon, lat) -> float:
    return 0

def perceived_temperature_at_coords(lon, lat) -> float:
    layer = Layer.PERCEIVED_TEMPERATURE
    time = datetime.fromisoformat("2023-08-11T10:00:00+00:00")  # TODO: proper time parameter

    pixel = getLayerSpaceTimePixel(layer, lat, lon, time)
    approxTemperature = convertColorToValue(layer, pixel)

    return approxTemperature

def climatope_at_coords(lon, lat) -> float:
    layer = Layer.KLIMATOPE

    pixel = getLayerSpaceTimePixel(layer, lat, lon)
    climateCategory = convertColorToValue(layer, pixel)

    return climateCategory

def function_at_coords(lat, long, parameters = dict(temperature_alpha = 1, windspeed_beta=0.2, perceived_gamma=0.4, climatope_zeta=0.3)) -> float:
    return parameters["temperature_alpha"] * temperature_at_coords(lat, long) + \
            parameters["windspeed_beta"] * average_windspeed_at_coords(lat, long) + \
            parameters["perceived_gamma"] * perceived_temperature_at_coords(lat, long) + \
            parameters["climatope_zeta"] * climatope_at_coords(lat, long)

def function_at_distance(distance, coords_list: list[tuple[float,tuple[float,float]]]) -> float:
    last_el = coords_list[0]
    d = 0
    for el in coords_list[1:]:
        d += el[0]
        if distance <= d:
            last_coords = last_el[1]
            current_coords = el[1]
            distance_ratio = (distance - (d - el[0])) / (el[0] - last_el[0])

            interp_x = last_coords[0] + (current_coords[0] - last_coords[0]) * distance_ratio
            interp_y = last_coords[1] + (current_coords[1] - last_coords[1]) * distance_ratio
            
            return function_at_coords(interp_x, interp_y)

def trapeziodal_integral(coords_list: list[tuple[float,float]] = list(), T: float = 0, n: int = 1024):
    if len(coords_list) == 2:
        T = math.sqrt(pow(coords_list[0][0] - coords_list[1][0], 2) + pow(coords_list[0][1] - coords_list[1][1], 2))
        n = 2 * (int(T) + 1)
        distance_coords_list = [(0, coords_list[0]), (T, coords_list[1])]
    else:
        distance_coords_list = coords_to_distance(coords_list)

    dx = T / n;
    sum = 0.5 * (function_at_distance(0, distance_coords_list) + function_at_distance(T, distance_coords_list))
    for i in range(1, n):
        xi = i * dx
        sum += function_at_distance(xi, distance_coords_list)
    return sum * dx
