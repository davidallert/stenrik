/**
 * The Map Model object includes functions that handle the initialization of the map, rendering of markers, etc.
 */

import apiModel from "./v1/raa_model.js";

const mapModel = {
    getBoundingBoxCoords: async function getBoundingBoxCoords(map) {

        let bounds = map.getBounds();
        // console.log(bounds);

        let boundingBox = {
            west: bounds._southWest.lng,
            east: bounds._northEast.lng,
            south: bounds._southWest.lat,
            north: bounds._northEast.lat
        }

        return boundingBox;

    },

    renderMarkers: function renderMarkers(map, pins) {

        let runeIcon = L.icon ({
            iconUrl: './assets/images/runic_letter_raido.svg',
            // shadowUrl: './assets/images/runic_letter_raido_shadow.svg',
            iconSize:     [9.5, 23.75], // size of the icon
            // shadowSize:   [20, 25], // size of the shadow
            // shadowSize:   [12.5, 16], // Default numbers.
            iconAnchor:   [5.5, 23.5], // point of the icon which will correspond to marker's location
            // shadowAnchor: [5.5, 23.5],  // the same for the shadow
            // shadowAnchor: [1, 15.5],  // Default numbers.
            popupAnchor:  [-3, -29] // point from which the popup should open relative to the iconAnchor
        });
        let markers = new L.MarkerClusterGroup({
            disableClusteringAtZoom: 16,
            spiderfyOnMaxZoom: false,
            showCoverageOnHover: false,
        });
        let uniqueLocations = [];
        let excludedLocations = [];
        // let excludedLocations = ["övrigt", "fyndplats", "fossil åker", "område med fossil åkermark", "blästbrukslämning", "lägenhetsbebyggelse", "husgrund, historisk tid", "kemisk industri", "textilindustri", "boplatsområde", "boplats", "bytomt/gårdstomt", "depåfynd", "fyndsamling", "kolningsanläggning"];
        // console.log(pins);
        for (let pin of pins) {
            if (!excludedLocations.includes(pin.name.toLowerCase())) {
                if (pin.coords && pin.visibleAboveGround) {
                    if (pin.coords.type === "MultiPoint") { // "Normal" locations, a single point on the map.
                        if (!uniqueLocations.includes((pin.coords.lat + pin.coords.lon))) {
                            uniqueLocations.push((pin.coords.lat + pin.coords.lon));
                            markers.addLayer(L.marker([pin.coords.lat, pin.coords.lon], {icon: runeIcon})
                            .bindPopup(`
                                <div class="pin">
                                    <h2>${pin.name}</h2>
                                    <p>${pin.description}</p>
                                </div>
                                `, {'maxHeight': '500'}));
                        };
                    } else if (pin.coords.type === "MultiPolygon") { // Larger sites with many individual points.
                        let polygon = L.polygon(pin.coords.coordsArray).addTo(map);
                        polygon.setStyle({color: '#333333'});
                        polygon.bindPopup(`
                            <div class="pin">
                                <h2>${pin.name}</h2>
                                <p>${pin.description}</p>
                            </div>
                        `, {'maxHeight': '500'});
                    }
                };
            };
        };

        map.addLayer(markers);
    },

    /**
     * Gets coorinates based on an address and renders a pin at the address location.
     */
    renderMarkersFromAddress: async function renderMarkersFromAddress(map) {

        let adress = 'Harstigen 9, Billdal';

        const result = await getCoordinates(adress);

        L.marker([
            parseFloat(result[0].lat),
            parseFloat(result[0].lon)
        ]).addTo(map);

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