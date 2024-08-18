/**
 * The Map Model object includes functions that handle the initialization of the map, rendering of markers, etc.
 */

import checkIf from "../../util/is_mobile.js";
import popupModel from "./popup_model.js";

const mapModel = {
    getBoundingBoxCoords: async function getBoundingBoxCoords(map) {

        let bounds = map.getBounds();

        let boundingBox = {
            west: bounds._southWest.lng,
            east: bounds._northEast.lng,
            south: bounds._southWest.lat,
            north: bounds._northEast.lat
        }

        return boundingBox;

    },

    createMarkers: function createMarkers(map, markers, addedSites, records) {
        let init = true;
        let geometryType;
        let coordinates;
        let longitude;
        let latitude;
        let fontAwesomeIcon;
        let popupContent;
        let siteTitle = "";
        let siteZones = "";
        let siteDescText = "";
        let siteDescTradition;
        let siteDescTerrain = "";
        let siteDescOrientation = "";
        let maxWidth = "500";

        if (checkIf.deviceIsMobile()) {
            maxWidth = "320";
        }

        if (records) {
            for (let site of records) {
                if (init) {
                    markers = new L.MarkerClusterGroup({
                        disableClusteringAtZoom: 16,
                        spiderfyOnMaxZoom: false,
                        showCoverageOnHover: false,
                    });
                    init = false;
                }

                if (addedSites.includes(site.site_id)) {
                    continue;
                }

                addedSites.push(site.site_id);

                geometryType = "";
                coordinates = [];
                longitude = null;
                latitude = null;
                fontAwesomeIcon = "";

                // geometryType = site.geometry.type;
                // coordinates = site.geometry.coordinates;
                geometryType = site.coordinates.features[0].geometry.type;
                coordinates = site.coordinates.features[0].geometry.coordinates;

                // Handle the different geometry types.
                switch (geometryType) {
                    case "MultiPoint":
                        longitude = coordinates[0][0];
                        latitude = coordinates[0][1];
                        break;
                    default:
                        continue;
                };

                fontAwesomeIcon = popupModel.selectIcon(site.site_type);
                popupContent = popupModel.addPopupContent(site, siteTitle, siteZones, siteDescText, siteDescTradition, siteDescTerrain, siteDescOrientation);

                markers.addLayer(L.marker([latitude, longitude], {icon: fontAwesomeIcon})
                .bindPopup(`${popupContent}`, {'maxHeight': '500', 'maxWidth': maxWidth}));

            }
        }
        if (markers) {
            map.addLayer(markers);
        }
    },

    initMap: function initMap(latitude, longitude, zoomLevel) {
        const map = L.map('map', {
            center: [latitude, longitude],
            zoom: zoomLevel, // Default is 13.
            zoomControl: false
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Find other map "skins" here: https://leaflet-extras.github.io/leaflet-providers/preview/

        return map;
    },

    flyToAsync(map, latlng, zoomLevel, options) {
        return new Promise((resolve) => {
            map.flyTo(latlng, zoomLevel, options);
            map.once('moveend', resolve); // Resolve when the animation ends
        });
    },

    setViewAsync(map, latlng, zoomLevel) {
        return new Promise((resolve) => {
            map.setView(latlng, zoomLevel);
            resolve(); // Immediately resolve, as setView does not animate by default
        });
    }
}

export default mapModel;