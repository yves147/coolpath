import folium
import webbrowser
import os

from generate_graph import Map, Node
from main import find_path


def plot_coordinates_on_map(data, start, end):
    # Initialisiere die Karte, zentriert auf den Mittelwert der ersten Koordinate in der Liste
    average_lat = sum(lat for _, lat in data) / len(data)
    average_lon = sum(lon for lon, _ in data) / len(data)
    map = folium.Map(location=[average_lat, average_lon], zoom_start=12)

    # Füge für jedes Tupel einen Marker auf der Karte hinzu
    for lon, lat in data:
        folium.Marker([lat, lon]).add_to(map)

    folium.Marker([start[1], start[0]], icon=folium.Icon(color="red")).add_to(map)
    folium.Marker([end[1], end[0]], icon=folium.Icon(color="green")).add_to(map)

    # Speichere die Karte als HTML-Datei
    map_path = 'map.html'
    map.save(map_path)

    # Öffne die gespeicherte HTML-Datei in einem Webbrowser
    webbrowser.open('file://' + os.path.realpath(map_path))


import json

start_point = [13.732952417266883, 51.03403674195253]
end_point = [13.751770840358994, 51.06299305729817]

with open("daten.json", encoding='utf-8') as f:
    json_data = json.load(f)

print("loaded")

found_path = find_path(start_point, end_point, Map.load_from_file())

plot_coordinates_on_map(found_path, start_point, end_point)
