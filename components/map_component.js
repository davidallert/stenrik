/**
 * ...
 */
"use strict";

import mapEventModel from '../models/v2/map_event_model.js';
import supabaseModel from '../models/v2/supabase_model.js';
import popupModel from '../models/v2/popup_model.js';
import checkIf from '../util/is_mobile.js';
import positioningModel from '../models/positioning_model.js';
import locationModel from '../models/location_model.js';
import loading from '../util/loading.js';
import elementModel from '../models/v2/element_model.js';

export default class MapComponent extends HTMLElement {
    constructor() {
        super();

        this.init = true;
        this.map = null;
        this.markers = null;
        this.addedSites = [];
    }

    async connectedCallback() {
        loading.createSpinner();
        await this.render();
        mapEventModel.addLocationTrackingEvent(this.map);
        this.addSearchAreaOnMoveEvent();
        this.initSearchButton();
        mapEventModel.removeSearchButtonOnPopupOpen(this.map);
        mapEventModel.addSearchButtonOnPopupClose(this.map);
    }

    async render() {
        this.innerHTML = `
        <main id="mapOverlay" class="map-overlay">
            <div id="map" class="map" style="height: 100vh; width: 100%;"></div>
            <div id="searchButton" class="search-button hidden">Sök i området</div>
            <div id="locationTrackingBtn" class="icon-button fly-to-user-button"><i class="fa-solid fa-location-crosshairs"></i></div>
            <div class="icon-button compass-div hidden"><i id="compass" class="fa-solid fa-compass fa-rotate-by" style="--fa-rotate-angle: -45deg;""></i></div>
        </main>`;

        this.map = this.initMap(62.334591, 16.063240, 5);

        const records = await supabaseModel.fetchData();

        this.createMarkers(records);

        this.init = false;
    }

    getBoundingBoxCoords() {
        let bounds = this.map.getBounds();
        let boundingBox = {
            west: bounds._southWest.lng,
            east: bounds._northEast.lng,
            south: bounds._southWest.lat,
            north: bounds._northEast.lat
        }

        return boundingBox;
    }

    createMarkers(records) {
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
                if (this.init) {
                    this.markers = new L.MarkerClusterGroup({
                        disableClusteringAtZoom: 16,
                        spiderfyOnMaxZoom: false,
                        showCoverageOnHover: false,
                    });
                    this.init = false;
                }

                if (this.addedSites.includes(site.site_id)) {
                    continue;
                }

                this.addedSites.push(site.site_id);

                geometryType = "";
                coordinates = [];
                longitude = null;
                latitude = null;
                fontAwesomeIcon = "";

                fontAwesomeIcon = popupModel.selectIcon(site.site_type);
                popupContent = popupModel.addPopupContent(site, siteTitle, siteZones, siteDescText, siteDescTradition, siteDescTerrain, siteDescOrientation);

                geometryType = site.coordinates.features[0].geometry.type;
                coordinates = site.coordinates.features[0].geometry.coordinates;

                // Handle the different geometry types.
                switch (geometryType) {
                    case "MultiPoint":
                        longitude = coordinates[0][0];
                        latitude = coordinates[0][1];

                        this.markers.addLayer(L.marker([latitude, longitude], {icon: fontAwesomeIcon})
                        .bindPopup(`${popupContent}`, {'maxHeight': '500', 'maxWidth': maxWidth}));

                        break;
                    case "MultiPolygon":
                        coordinates = coordinates[0][0]
                        this.handleGeoJsonGeometry(site, coordinates, popupContent, fontAwesomeIcon, maxWidth);
                        break;
                    case "MultiLineString":
                        coordinates = coordinates[0]
                        this.handleGeoJsonGeometry(site, coordinates, popupContent, fontAwesomeIcon, maxWidth);
                        break;
                    default:
                        continue;
                };

            }
        }
        if (this.markers) {
            this.map.addLayer(this.markers);
        }
    }

    initMap(latitude, longitude, zoomLevel) {
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
    }

    /**
     * Adds an event listener to the Leaflet map, which tracks movement.
     * When the event is triggered, a search button will appear at the top of the screen.
     * @param {Object} map The Leaflet map object (this.map in map_view.js).
     */
    async addSearchAreaOnMoveEvent() {
        this.map.on("moveend", (e) => { // Triggers at the end of the movement. Other options are "movestart" and "move".
            // TODO Make sure the event is only triggered once for a unique set of bounds.
            const searchButton = document.getElementById("searchButton");
            if (this.map.getZoom() >= 9) {
                elementModel.fadeInElement(searchButton);
            } else if (this.map.getZoom() < 9) {
                elementModel.fadeElement(searchButton);
            }
        });
    }

    initSearchButton() {
        let searchButton = document.getElementById("searchButton");

        searchButton.style.opacity = "0";

        // Initial centering of the search box.
        positioningModel.centerElementHorizontally(searchButton);

        // Add continuous centering of the search box if the window is changed/resized.
        positioningModel.addCenterElementHorizontallyEvent(searchButton);

        searchButton.addEventListener("click", () => {
            this.searchButtonClickEvent();
        });
    }

    /**
     * Adds a click event to the search button which is created by addSearchAreaEventOnMove.
     * The button fades out and is then removed from the page.
     * An API call is made, using the current bounding box coordinates.
     * The records that were found is then turned into markers and added to the map.
     * @param {Object} map The Leaflet map object (this.map in map_view.js).
     */
    async searchButtonClickEvent() {
        loading.displaySpinner();
        // Fade the search button, then remove it after a duration of 300ms (Its transition-duration is 0.3s).
        let searchButton = document.getElementById("searchButton");
        elementModel.fadeElement(searchButton);

        // Get the coords of the current bounding box via the mapModel.
        const boundingBox = this.getBoundingBoxCoords();

        // Fetch the data from within the current bounding box.
        const records = await supabaseModel.fetchBoundingBoxData(boundingBox);
        if (records) {
            this.createMarkers(records);
        }
        loading.removeSpinner();
    }

    handleGeoJsonGeometry(site, coordinates, popupContent, fontAwesomeIcon, maxWidth) {
        let center = this.getCenter(coordinates);
        let marker = L.marker([center[0], center[1]], {icon: fontAwesomeIcon});
        marker.bindPopup(`${popupContent}`, {'maxHeight': '500', 'maxWidth': maxWidth});

        const boundCreateGeoJson = this.createGeoJson.bind(this, this.map, site, popupContent, maxWidth);
        marker.addEventListener("click", function handleClick() {
            boundCreateGeoJson();
            marker.removeEventListener("click", handleClick); // Use the same reference
        });

        this.markers.addLayer(marker);
    }

    // Function to calculate the centroid of a polygon
    getCenter(coordinates) {
        let x = 0, y = 0, n = coordinates.length;
        coordinates.forEach(coord => {
            x += coord[0];
            y += coord[1];
        });
        return [y / n, x / n];
    }

    createGeoJson(map, site, popupContent, maxWidth) {
            let geoJsonGeometry  = site.coordinates;
            let layer = L.geoJSON(geoJsonGeometry, {
                onEachFeature: function (feature, layer) {
                    // Bind popup to each feature
                    layer.bindPopup(popupContent, { maxHeight: '500', maxWidth: maxWidth });
                    layer.setStyle({ color: '#ffffff' });
                }
            });

            layer.addTo(map);
    }

}
