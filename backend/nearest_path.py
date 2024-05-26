
def calculate_projection(px, py, ax, ay, bx, by) -> tuple[tuple[float, float], float]:
    abx, aby = bx - ax, by - ay
    apx, apy = px - ax, py - ay

    ab_ap_product = abx * apx + aby * apy

    ab_sq = abx * abx + aby * aby

    if ab_sq == 0:
        return (ax, ay), 0
    
    t = ab_ap_product / ab_sq
    
    t = max(0, min(1, t))
    
    closest_x = ax + t * abx
    closest_y = ay + t * aby
    
    distance = ((closest_x - px)**2 + (closest_y - py)**2)**0.5
    
    return (closest_x, closest_y), distance

def compute_hashmap(data):
    features = []

    x = 51
    y = 13

    while x < 52:
        while y < 14:
            for feature in data['features']:
                for i, line_segment in enumerate(feature['geometry']['coordinates']):
                    if feature['geometry']['coordinates'][-1] == end_point:
                        features.append(feature)

    return features

def find_closest_point(px, py, hashmap, cellsize) -> tuple[tuple[float, float], float]:
    min_distance = float('inf')
    closest_point = None
    search_keys = [(int(px // cellsize), int(py // cellsize))] # theoretisch beliebig erweiterbar
    for key in search_keys:
        if key in hashmap:
            segments = hashmap[key]
            for segment in segments:
                point, distance = calculate_projection(px, py, segment[0][0], segment[0][1], segment[1][0], segment[1][1])
                if distance < min_distance:
                    min_distance = distance
                    closest_point = point
    return closest_point, min_distance

