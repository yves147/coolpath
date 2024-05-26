# python server.py
from typing import Optional

import uvicorn
from fastapi import FastAPI
from geopy import Point
from geopy.geocoders import Nominatim
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
    perceived_gamma: float = 0.4,
    climatope_zeta: float = 2.0,
) -> list[Location]:

    map_object.nodes.values()

    start_node = get_nearest_node_from_coordinates(start_long, start_lat, map_object)
    end_node = get_nearest_node_from_coordinates(target_long, target_lat, map_object)

    found_path = find_path(
        [start_node.longitude, start_node.latitude],
        [end_node.longitude, end_node.latitude],
        map_object,
        perceived_gamma=perceived_gamma,
        climatope_zeta=climatope_zeta,
    )

    locations = [Location.from_list_of_points(point) for point in found_path]

    return locations


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:63342", "http://localhost:8080", "http://127.0.0.1:63342", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/similar_addresses")
def get_similar_addresses(search_string: str):
    geolocator = Nominatim(user_agent="cool-path")

    # Coordinates for bounding box around Dresden
    southwest = Point(51.0000, 13.6000)
    northeast = Point(51.1500, 13.8000)

    results = geolocator.geocode(
        search_string,
        exactly_one=False,
        limit=10,
        viewbox=[southwest, northeast],
        bounded=True,
        country_codes="de",
        language="de-DE",
    )
    if results:
        suggestions = [result.address for result in results]
        return suggestions
    else:
        return []


@app.get("/coordinate_from_address")
def get_coordinates_from_address(search_string: str) -> Optional[Location]:
    geolocator = Nominatim(user_agent="cool-path")

    # Coordinates for bounding box around Dresden
    southwest = Point(51.0000, 13.6000)
    northeast = Point(51.1500, 13.8000)

    result = geolocator.geocode(
        search_string,
        exactly_one=True,
        viewbox=[southwest, northeast],
        bounded=True,
        country_codes="de",
        language="de-DE",
    )

    if not result:
        return None

    return Location(longitude=result.longitude, latitude=result.latitude)


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8015, workers=1)
