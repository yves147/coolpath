import heapq

import unicodedata
from typing import Optional

from path_weight import trapeziodal_integral


def get_feature_by_start_point(start_point: list[float], json_data: dict) -> list[dict]:
    features = []

    for feature in json_data['features']:
        if feature['geometry']['coordinates'][0] == start_point:
            features.append(feature)

    return features


def get_features_by_end_point(end_point: list[float], json_data: dict) -> list[dict]:
    features = []

    for feature in json_data['features']:
        if feature['geometry']['coordinates'][-1] == end_point:
            features.append(feature)

    return features


def get_features_by_point(point: list[float], json_data: dict) -> list[dict]:
    features = []

    for feature in json_data['features']:
#        if len(feature["geometry"]["coordinates"]) == 0:
#            continue

#        if feature['geometry']['coordinates'][0] == point or feature['geometry']['coordinates'][-1] == point:
#            features.append(feature)
        for current_point in feature['geometry']['coordinates']:
            if current_point == point:
                features.append(feature)
                continue

    return features


def normalize_caseless(text):
    return unicodedata.normalize("NFKD", text.casefold())


def caseless_equal(left, right):
    return normalize_caseless(left) == normalize_caseless(right)


def get_features_by_street_name(street_name: str, json_data: dict) -> any:
    streets = []

    for feature in json_data['features']:
        if caseless_equal(feature['properties']['strasse'], street_name):
            streets.append(feature)

    return streets


def calculate_heuristic(start_point: list[float], end_point: list[float]):
    # Calculate the Manhattan distance between the current node and the end node
    return abs(start_point[0] - end_point[0]) + abs(start_point[1] - end_point[1])


def get_neighbours_only_inside_feature(point: list[float], feature: dict) -> list[(dict, list[float])]:
    coordinates = feature["geometry"]["coordinates"]

    coordinates_index = coordinates.index(point)

    neighbours = []

    if coordinates_index > 0:
        neighbours.append((feature, coordinates[coordinates_index - 1]))

    if coordinates_index < len(coordinates) - 1:
        neighbours.append((feature, coordinates[coordinates_index + 1]))

    return neighbours


def get_neighbours(point: list[float], feature: Optional[dict], json_data: dict) -> list[(dict, list[float])]:
    if feature is None:
        feature = get_features_by_point(point, json_data)[0]

    coordinates = feature["geometry"]["coordinates"]

    coordinates_index = coordinates.index(point)

    neighbours = []

    if coordinates_index > 0:
        neighbours.append((feature, coordinates[coordinates_index - 1]))
    else:
        neighbour_features = get_features_by_point(point, json_data)

        for neighbour_feature in neighbour_features:
            neighbours.extend(get_neighbours_only_inside_feature(point, neighbour_feature))

    if coordinates_index < len(coordinates) - 1:
        neighbours.append((feature, coordinates[coordinates_index + 1]))
    else:
        neighbour_features = get_features_by_point(point, json_data)

        for neighbour_feature in neighbour_features:
            neighbours.extend(get_neighbours_only_inside_feature(point, neighbour_feature))

    return neighbours


def find_path(start: list[float], end: list[float], json_data) -> list[list[float]]:
    open_list = []
    g_scores = {tuple(start): 0}
    parent = {}

    # Add the start node to the open list
    heapq.heappush(open_list, (0, tuple(start)))

    while open_list:
        # Get the node with the lowest f score from the open list
        current_node = heapq.heappop(open_list)[1]

        if list(current_node) == end:
            # Reached the end node, reconstruct the path
            path = []
            while current_node in parent:
                path.append(list(current_node))
                current_node = parent[current_node]
            path.append(start)
            path.reverse()
            return path

        # Get the neighbors of the current node using the provided function
        neighbors = get_neighbours(list(current_node), None, json_data)

        for (feature, neighbor) in neighbors:
            if tuple(neighbor) not in g_scores:
                g_scores[tuple(neighbor)] = float('inf')

            if current_node not in g_scores:
                g_scores[current_node] = float('inf')

            if g_scores[current_node] + 1 < g_scores[tuple(neighbor)]:
                # Update the neighbor's g score and f score
                g_scores[tuple(neighbor)] = g_scores[current_node] + 1
                f_score = g_scores[tuple(neighbor)] + calculate_heuristic(neighbor, end)

                if (f_score, tuple(neighbor)) not in open_list:
                    # Add the neighbor to the open list
                    heapq.heappush(open_list, (f_score, tuple(neighbor)))
                    parent[tuple(neighbor)] = current_node

    # If no path is found, return an empty list
    return []


import json

start_point = [13.736975484488212, 51.06307837490126]
end_point = [13.74074625406342,51.05907939552469]

with open("daten.json", encoding='utf-8') as f:
    json_data = json.load(f)

print("loaded")

found_path = find_path(start_point, end_point, json_data)

print(found_path)
