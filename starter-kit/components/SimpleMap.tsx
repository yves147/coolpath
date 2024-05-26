import { useRef } from "react";

const SimpleMap = () => {
    const mapRef = useRef(null)
    const latitude = 51.505
    const longitude = -0.09
    return (<div></div>)/*(
        <MapContainer center={[latitude, longitude]} zoom={13} ref={mapRef} style={{height: "100vh", width: "100vw"}}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    )*/
}

export default SimpleMap;