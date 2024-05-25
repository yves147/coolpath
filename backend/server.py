# python server.py
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware

from generate_graph import Map, Node  # noqa
from main import find_path, get_nearest_node_from_coordinates

map_object = Map.load_from_file()

app = FastAPI(title="CoolPath API", docs_url="/")


class Location(BaseModel):
    longitude: float
    latitude: float

    @staticmethod
    def from_list_of_points(points: list[float]) -> "Location":
        return Location(longitude=points[0], latitude=points[1])

    def to_list_of_floats(self) -> list[float]:
        return [self.longitude, self.latitude]


@app.get("/route")
def search_pos(
    start_long: float = 13.732952417266883,
    start_lat: float = 51.03403674195253,
    target_long: float = 13.751770840358994,
    target_lat: float = 51.06299305729817,
) -> list[Location]:

    map_object.nodes.values()

    start_node = get_nearest_node_from_coordinates(start_long, start_lat, map_object)
    end_node = get_nearest_node_from_coordinates(target_long, target_lat, map_object)

    found_path = find_path(
        [start_node.longitude, start_node.latitude],
        [end_node.longitude, end_node.latitude],
        map_object,
    )

    locations = [Location.from_list_of_points(point) for point in found_path]

    return locations


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:63342"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8015, workers=1)
