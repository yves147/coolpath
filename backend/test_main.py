from generate_graph import Node, Map
from main import (
    get_neighbours,
    get_neighbours_only_inside_feature,
    get_nearest_node_from_coordinates,
)


def test_get_neighbours_middle():
    first_point = [10, 10]
    point = [13.4213, 51.123]
    last_point = [20, 20]

    feature = {"geometry": {"coordinates": [first_point, point, last_point]}}

    json_data = {"features": [{"geometry": {"coordinates": []}}]}

    neighbours = get_neighbours(point, feature, json_data)

    assert len(neighbours) == 2
    assert neighbours[0][1] == first_point
    assert neighbours[1][1] == last_point


def test_get_neighbours_first():
    point = [13.4213, 51.123]
    last_point = [20, 20]

    feature = {"geometry": {"coordinates": [point, last_point]}}

    json_data = {"features": [{"geometry": {"coordinates": []}}]}

    neighbours = get_neighbours(point, feature, json_data)

    assert len(neighbours) == 1
    assert neighbours[0][1] == last_point


def test_get_neighbours_last():
    point = [13.4213, 51.123]
    first_point = [20, 20]

    feature = {"geometry": {"coordinates": [first_point, point]}}

    json_data = {"features": [{"geometry": {"coordinates": []}}]}

    neighbours = get_neighbours(point, feature, json_data)

    assert len(neighbours) == 1
    assert neighbours[0][1] == first_point


def test_get_neighbours_only_inside_feature():
    first_point = [10, 10]
    point = [13.4213, 51.123]
    last_point = [20, 20]

    feature = {"geometry": {"coordinates": [first_point, point, last_point]}}

    neighbours = get_neighbours_only_inside_feature(point, feature)

    assert len(neighbours) == 2
    assert neighbours[0][1] == first_point
    assert neighbours[1][1] == last_point


def test_get_nearest_node_from_coordinates():
    closestNode = Node([0, 1])
    otherNode = Node([5, 1])

    map_object = Map()

    map_object.add_node(closestNode)
    map_object.add_node(otherNode)

    returned_node = get_nearest_node_from_coordinates(0, 1, map_object)

    assert returned_node == closestNode
