import os
import pickle

# from main import get_neighbours


class Node:
    longitude: float
    latitude: float
    point: list[float]

    def __init__(self, point: list[float]):
        self.longitude = point[0]
        self.latitude = point[1]
        self.point = point

    def get_hash(self) -> int:
        return hash(self.latitude) ^ hash(self.longitude)


class Map:
    nodes: dict[int, Node]
    connections: dict[int, list[Node]]

    def __init__(self):
        self.nodes = {}
        self.connections = {}

    def add_node(self, node: Node):
        node_hash = node.get_hash()
        self.nodes[node_hash] = node
        self.connections[node_hash] = []

    def get_node(self, node_hash: int) -> Node:
        return self.nodes.get(node_hash)

    def save_to_file(self):
        with open("map_data.pkl", 'wb') as file:
            pickle.dump(self, file)

    @staticmethod
    def load_from_file() -> "Map":
        file_path = "map_data.pkl"

        if os.path.getsize(file_path) > 0:
            with open(file_path, 'rb') as file:
                unpickler = pickle.Unpickler(file)

                return unpickler.load()
        else:
            print("File is empty")


def handle_node(node_to_handle: Node):
    open_points: list[Node] = [node_to_handle]

    while open_points:
        #if len(map_object.nodes) == 500:
        #    return

        if len(map_object.nodes) % 50 == 0:
            print(f"{len(map_object.nodes)}/{total_node_count}")

        current_node = open_points.pop()

        map_object.add_node(current_node)

        neighbour_points = get_neighbours(current_node.point, None, json_data)

        for (feature, neighbour_point) in neighbour_points:
            neighbour_node = Node(neighbour_point)

            existing_neighbour = map_object.get_node(neighbour_node.get_hash())

            if existing_neighbour:
                map_object.connections[existing_neighbour.get_hash()].append(current_node)
                map_object.connections[current_node.get_hash()].append(existing_neighbour)

                continue

            open_points.append(neighbour_node)


if __name__ == "__main__":

    start_point = [13.732952417266883, 51.03403674195253]

    import json

    with open("daten.json", encoding='utf-8') as f:
        json_data = json.load(f)

    map_object: Map = Map()

    current_point = Node(start_point)

    # Debug Total Nodes

    total_node_count = sum(len(feature["geometry"]["coordinates"]) for feature in json_data["features"])

    print(total_node_count)

    # handle_node(current_point)

    # map_object.save_to_file()

    map_object = Map.load_from_file()

    # print(map_object)
    # print(len(map_object.nodes))

    # for node in map_object.nodes.values():
    #    print(node.longitude)
    #    print(node.latitude)

    #for start_node, end_nodes in map_object.connections.items():
    #    print(f"{start_node}: {end_nodes}")

    print(map_object.connections[list(map_object.nodes.keys())[0]])
