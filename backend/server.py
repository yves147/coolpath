# fastapi dev server.py

from fastapi import FastAPI

app = FastAPI(title="CoolPath API", docs_url="/")


@app.get("/search")
def search_pos(query: str):
    return {
        "results": [
        {
            "result_name": query,
            "result_data": {
                "temperature": 30,
                "index": "",
                "coords": [51.03239191784698, 13.732435435916585]
            }
        }
    ]}

@app.post("/recommend")
def calculate_path():
    return {}

