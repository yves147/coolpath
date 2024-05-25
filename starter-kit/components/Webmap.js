const HTMLContent = `
<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Leaflet example in one file</title>

        <!-- include leaflet css and javascript -->
        <link rel="stylesheet" crossorigin="" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.0.3/dist/leaflet-src.js" crossorigin=""></script>

        <style>
            * {
                margin: 0;
            }
            #map {
                height: 100vh;
            }
        </style>
    </head>

    <body>
        <div id="map"></div>

        <script>
            var map = L.map('map').setView([51.05089, 13.73832], 13);

            L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker([51.05089, 13.73832]).addTo(map)
             .bindPopup('Dresden die Hood!')
             .openPopup();

            // Listen for messages from React Native
            document.addEventListener("message", function(event) {
                var data = JSON.parse(event.data);
                if (data.type === 'addMarker') {
                    L.marker([data.lat, data.lng]).addTo(map)
                     .bindPopup(data.popupText)
                     .openPopup();
                }
            });
        </script>
    </body>
</html>
`;

export { HTMLContent };