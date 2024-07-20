"use strict";

// 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
// map: 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

import mapModel from '../../models/map_model.js';
import getCoordinates from '../../models/nominatim.js';
import parseGml from '../../models/gml.js';
import locationModel from '../../models/location_model.js';
import mapEventModel from '../../models/map_event_model.js';
import apiModel from '../../models/api_model.js';

export default class MapView extends HTMLElement {
    constructor() {
        super();

        this.map = null;
        // this.geolocation = {
        //     latitude: 59.334591,
        //     longitude: 18.063240
        // };
        this.searchEventTriggered = false;
    }
    async connectedCallback() {
        await this.render();
        await mapEventModel.addSearchAreaEventOnMove(this.map);
        await mapEventModel.flyToUserButtonEvent(this.map)
    }

    async render() {
        this.innerHTML = `
        <main id="mapOverlay" class="mapOverlay">
            <div id="map" class="map" style="height: 100vh; width: 100%;"></div>
            <div id="flyToUserButton" class="flyToUserButton"><i class="fa-solid fa-crosshairs"></i></div>
        </main>`;

        try {
            const position = await locationModel.getInitialPosition();
            const zoomLevel = 15; // Default is 13.

            // Create the map.
            this.map = mapModel.initMap(position.coords.latitude, position.coords.longitude, zoomLevel);

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

            // Get the coords of the bounding box from the Leaflet map.
            const boundingBox = await mapModel.getBoundingBoxCoords(this.map);

            // Make K-SAMSÖK API call and fetch data.
            const records = await apiModel.fetchGeoData(boundingBox);

            // Create map pins from the data.
            const pins = apiModel.createPins(records);

            // Render the pins/markers after all of them have been created. (Improves performance.)
            mapModel.renderMarkers(this.map, pins);

            // Start watching the user's position for changes. Update when changed.
            locationModel.watchPosition((position) => {
            locationModel.updatePosition(position, this.locationMarker);
        });

        } catch (error) {
            console.error("Error getting geolocation:", error);

            // Init vars that will be used in all error cases.
            const zoomLevel = 6; // Further away than normal, so that the user can zoom in to their location more easily.
            const stockholmLat = 59.334591;
            const stockholmLon = 18.063240;

            if (error.code === 1 && error.message === "User denied Geolocation") {
                // Create the map and center it on Stockholm.
                this.map = mapModel.initMap(stockholmLat, stockholmLon, zoomLevel);
            }
            else if (error.code === 3 && error.message === "Timeout expired") {
                location.reload();
                this.map = mapModel.initMap(stockholmLat, stockholmLon, zoomLevel);
            };
        }

    }

}