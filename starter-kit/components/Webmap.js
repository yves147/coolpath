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

            var imageUrl = 'https://cdn.discordapp.com/attachments/598147871409438750/1244222120326729769/klips_klima.png?ex=665453a6&is=66530226&hm=1a6129ef039ed8f2a39814f5abd6cd6e772d828ad5c27d84da4f21deb867fb05&';
            var errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
            var altText = 'Klimatopkarte Dresden';
            var latLngBounds = L.latLngBounds([[50.9468637, 13.48226089], [51.22268143, 14.07460033]]);

            
            var imageOverlay = L.imageOverlay(imageUrl, latLngBounds, {
                opacity: 0.4,
                errorOverlayUrl: errorOverlayUrl,
                alt: altText,
                interactive: false
            }).addTo(map);


            // Listen for messages from React Native
            document.addEventListener("message", function(event) {
                var data = JSON.parse(event.data);
                if (data.type === 'line') {
                    L.polyline(data.pnts, {color: 'red', weight: 6}).addTo(map)
                    L.marker(data.pnts[0], {color: 'blue'}).addTo(map)
                    L.marker(data.pnts[data.pnts.length-1], {color: 'green'}).addTo(map)
                    L.circleMarker(data.pnts[54], {weight:1, fillColor: 'red'}).addTo(map)
                } else if(data.type ==='point') {
                    L.marker(data.pnts[0]).addTo(map)
                    L.marker(data.pnts[1]).addTo(map)
                }
            });
        </script>
    </body>
</html>
`;

export { HTMLContent };