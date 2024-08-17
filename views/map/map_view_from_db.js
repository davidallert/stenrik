"use strict";

import mapModel from '../../models/map_model.js';
import supabaseModel from '../../models/v2/supabase_model.js'
import popupModel from '../../models/v2/popup_model.js';
import checkIf from '../../util/is_mobile.js';

export default class MapViewFromDb extends HTMLElement {
    constructor() {
        super();

        this.init = true;
        this.markers = null;
    }

    async connectedCallback() {
        this.render();
    }

    async render() {
        this.innerHTML = `
        <main id="mapOverlay" class="map-overlay">
            <div id="map" class="map" style="height: 100vh; width: 100%;"></div>
        </main>`;

        this.map = mapModel.initMap(62.334591, 16.063240, 5);

        let data = await supabaseModel.fetchData();
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

        for (let site of data) {
            if (this.init) {
                this.markers = new L.MarkerClusterGroup({
                    disableClusteringAtZoom: 16,
                    spiderfyOnMaxZoom: false,
                    showCoverageOnHover: false,
                });
                this.init = false;
            }

            geometryType = "";
            coordinates = [];
            longitude = null;
            latitude = null;
            fontAwesomeIcon = "";

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

            this.markers.addLayer(L.marker([latitude, longitude], {icon: fontAwesomeIcon})
            .bindPopup(`${popupContent}`, {'maxHeight': '500', 'maxWidth': maxWidth}));

        }
        if (this.markers) {
            this.map.addLayer(this.markers);
        }
    }
}