"use strict";

import mapModel from '../map.js';
import getCoordinates from '../nominatim.js';
import parseGml from '../gml.js';
import locationModel from '../location.js';
import mapEventModel from '../map_events.js';
import apiModel from '../api.js';

export default class MapView extends HTMLElement {
    constructor() {
        super();

        this.map = null;
        this.geolocation = {
            latitude: 51,
            longitude: 1
        };
        this.searchBoxEventTriggered = false;
    }
    async connectedCallback() {
        await this.render();
        await mapEventModel.addSearchAreaEventOnMove(this.map);
    }

    async render() {
        this.innerHTML = `
        <main id="mapOverlay" class="mapOverlay">
            <div id="map" class="map" style="height: 100vh; width: 100%;"></div>
        </main>`;

        try {
            const position = await locationModel.getInitialPosition();

            this.map = L.map('map', {
                center: [position.coords.latitude, position.coords.longitude],
                zoom: 13
            });

            // TODO End the try here and set a static center point when catching the error?

            // Create marker for the user's location.
            let locationMarkerIcon = L.icon({
                iconUrl: "./assets/images/location.png",
                iconSize: [24, 24],
                iconAnchor: [12, 12],
                popupAnchor: [0, 0]
            });

            this.locationMarker = L.marker(
                [position.coords.latitude, position.coords.longitude],
                { icon: locationMarkerIcon }
            );

            this.locationMarker.addTo(this.map);

            // this.geolocation = {
            //     latitude: position.coords.latitude,
            //     longitude: position.coords.longitude
            // };

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);

            let bounds = this.map.getBounds();
            // console.log(bounds);

            let boundingBox = {
                west: bounds._southWest.lng,
                east: bounds._northEast.lng,
                south: bounds._southWest.lat,
                north: bounds._northEast.lat
            }
            // Make K-SAMSÖK API call and fetch data.
            const records = await apiModel.fetchGeoData(boundingBox);

            // Create map pins from the data.
            const pins = apiModel.createPins(records);
    
            // Render the pins/markers after all of them have been created. (Improves performance.)
            this.renderMarkers(pins);
        } catch (error) {
            console.error("Error getting geolocation:", error);
        }

        // Start watching the user's position for changes. Update when changed.
        locationModel.watchPosition((position) => {
            locationModel.updatePosition(position, this.locationMarker);
        });

    }

    /**
     * Gets coorinates based on an address and renders a pin at the address location.
     */
    async renderMarkersFromAddress() {

        let adress = 'Harstigen 9, Billdal';

        const result = await getCoordinates(adress);

        L.marker([
            parseFloat(result[0].lat),
            parseFloat(result[0].lon)
        ]).addTo(this.map);

    }

    renderMarkers(pins) {

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
        let markers = new L.MarkerClusterGroup();
        let uniqueLocations = [];
        let excludedLocations = ["övrigt", "fyndplats", "fossil åker", "område med fossil åkermark", "blästbrukslämning", "lägenhetsbebyggelse", "husgrund, historisk tid", "kemisk industri", "textilindustri"];
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
                                    <h3><a href="https://www.google.com/search?q=${pin.name}">${pin.name}</a></h3>
                                    <p>${pin.description}</p>
                                </div>
                                `));
                        };
                    } else if (pin.coords.type === "MultiPolygon") { // Larger sites with many individual points.
                        let polygon = L.polygon(pin.coords.coordsArray).addTo(this.map);
                        polygon.bindPopup(`
                            <div class="pin">
                                <h3><a href="https://www.google.com/search?q=${pin.name}">${pin.name}</a></h3>
                                <p>${pin.description}</p>
                            </div>
                            `);
                    }
                };
            };
        };

        this.map.addLayer(markers);
    }
}