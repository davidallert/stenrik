"use strict";

import mapModel from '../../models/map_model.js';
import getCoordinates from '../../models/nominatim.js';
import parseGml from '../../models/gml.js';
import locationModel from '../../models/location_model.js';
import mapEventModel from '../../models/map_event_model.js';
import apiModel from '../../models/raa_model.js';

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
        await mapEventModel.addSearchAreaOnMoveEvent(this.map);
        await mapEventModel.addFlyToUserButtonEvent(this.map)
    }

    async render() {
        this.innerHTML = `
        <main id="mapOverlay" class="map-overlay">
            <div id="map" class="map" style="height: 100vh; width: 100%;"></div>
            <div id="flyToUserButton" class="icon-button fly-to-user-button"><i class="fa-solid fa-crosshairs"></i></div>

            <nav-component></nav-component>
        </main>`;

        // Create the map.
        this.map = mapModel.initMap(59.334591, 18.063240, 6);

        try {
            const position = await locationModel.getInitialPosition();
            const zoomLevel = 15; // Default is 13.

            // this.map.flyTo([position.coords.latitude, position.coords.longitude], zoomLevel, {
            //     animate: true,
            //     duration: 1
            // });

            // this.map.setView([position.coords.latitude, position.coords.longitude], zoomLevel);

            await mapModel.flyToAsync(this.map, [position.coords.latitude, position.coords.longitude], zoomLevel, {
                animate: true,
                duration: 1
            });

            await mapModel.setViewAsync(this.map, [position.coords.latitude, position.coords.longitude], zoomLevel);

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
                console.log(error);
            }
            else if (error.code === 3 && error.message === "Timeout expired") {
                // location.reload();
                console.log(error);
            };
        }

    }

}