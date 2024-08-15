"use strict";

import mapModel from '../../models/map_model.js';
import supabaseModel from '../../models/supabase_model.js'

export default class MapViewFromDb extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.render();
    }

    async render() {
        this.innerHTML = `
        <main id="mapOverlay" class="map-overlay">
            <div id="map" class="map" style="height: 100vh; width: 100%;"></div>
            <div id="flyToUserButton" class="icon-button fly-to-user-button"><i class="fa-solid fa-crosshairs"></i></div>
        </main>`;

        this.map = mapModel.initMap(62.934591, 14.063240, 5);

        // let data = await supabaseModel.fetchData();

        // console.log(data);

    }
}