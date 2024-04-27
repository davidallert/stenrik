import getCoordinates from '../../models/nominatim.js';
import { fetchGeoData, findCoords } from '../../models/api.js';
import parseGml from '../../models/gml.js';

export default class MapView extends HTMLElement {
    constructor() {
        super();

        this.map = null;
        this.geolocation = {
            latitude: 50,
            longitude: 50
        };
    }
    connectedCallback() {
        this.render();
    }

    async render() {

        this.innerHTML = `<div id="map" class="map"></div>`;

        const records = await fetchGeoData();
        const coordsarray = findCoords(records);
        console.log(coordsarray);

        this.map = L.map('map', {doubleClickZoom: true}).locate({setView: true, maxZoom: 13});

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        this.renderMarkers(coordsarray);
        this.renderLocation();

    }

    async renderMarkersFromAddress() {

        let adress = 'Harstigen 9, Billdal';

        const result = await getCoordinates(adress);

        L.marker([
            parseFloat(result[0].lat),
            parseFloat(result[0].lon)
        ]).addTo(this.map);

    }

    renderMarkers(coordsarray) {
        for (let coords of coordsarray) {
            L.marker([
                coords.lat,
                coords.lon
            ]).addTo(this.map);
        }
    }

    renderLocation() {
        let locationMarker = L.icon({
            iconUrl: "./assets/images/location.png",
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, 0]
        });

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {

                let geolocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }

                L.marker(
                    [position.coords.latitude, position.coords.longitude],
                    {icon: locationMarker}
                ).addTo(this.map);

                return geolocation
            });
        }
    }
}
