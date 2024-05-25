# geoapi - get data from KLIPS and other WMS services

## geoapi folder

* **klips_connector.py**
  * connects to the KLIPS WMS service using the OWSLib python library
  * exports a **Layer** enum containing the names of the layers we access
  * caches the downloaded layers in memory
* **query.py**
  * provides the **getLayerSpaceTimePixel** function to retrieve pixel values based on geographic coordinates for a specific time (1h intervals)
  * talks to the klips\_connector to download the data
* **legend_parser.py**
  * responsible for mapping pixels to a machine-readable format (like absolute temperature values) based on the legend image corresponding to the layer
  * assumes a linear distribution of the values along the legend (this is an approximation, the legend for the heat map is not linear)
  * caches the computed colors and temperatures from the legend image in memory

# Scratchpad

geoserver getCapabilities() -> sagt welche Formate zur Verfügung stehen
* das XML selbst ist in einem OpenGIS / WMS Format -> Bibliothek zum parsen in Python
* wenn geschafft, den API-Baum sinnvoll zu traversieren: Geodaten runterladen
* Empfehlung: geotiff Format (Raster-Bilddaten mit Georeferenzierung)
* Dann weitere Bibliothek zum Parsen von geotiff nehmen

Overview:
* https://live.osgeo.org/en/overview/overview.html

WMS Infos:
* https://docs.geoserver.org/stable/en/user/services/wms/reference.html
* https://docs.geoserver.geo-solutions.it/edu/en/pretty_maps/wms.html

WMS Libs:
* https://pypi.org/project/OWSLib/

geotiff Libs:
* https://geopandas.org/en/stable/
* https://pypi.org/project/rasterio/
* https://gdal.org/ 
