"use strict";

import mapModel from '../../models/v2/map_model.js';
import mapEventModel from '../../models/v2/map_event_model.js';

export default class MapViewFromDb extends HTMLElement {
    constructor() {
        super();

        this.init = true;
        this.markers = null;
        this.addedSites = [];
    }

    async connectedCallback() {
        this.render();
        mapEventModel.addSearchAreaOnMoveEvent(this.map, this.markers, this.addedSites);
    }

    async render() {
        this.innerHTML = `
        <main id="mapOverlay" class="map-overlay">
            <div id="map" class="map" style="height: 100vh; width: 100%;"></div>
        </main>`;

        this.map = mapModel.initMap(62.334591, 16.063240, 5);

        // let data = await supabaseModel.fetchData();
    }
}