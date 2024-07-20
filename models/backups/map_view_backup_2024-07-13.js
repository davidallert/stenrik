import getCoordinates from '../nominatim.js';
import { fetchGeoData, createPins } from '../api.js';
import parseGml from '../gml.js';
import locationModel from '../location.js';
// import locationModel from '../../models/location.js';

export default class MapView extends HTMLElement {
    constructor() {
        super();

        this.map = null;
        this.geolocation = {
            latitude: 51,
            longitude: 1
        };
    }
    async connectedCallback() {
        await this.render();

        // Update the user's location every 5 seconds.
        // setInterval(locationModel.updateLiveLocation, 5000, this.locationMarker)
    }

    async render() {
        this.innerHTML = `<div id="map" class="map" style="height: 100vh; width: 100%;"></div>`;

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
            const records = await fetchGeoData(boundingBox);

            // Create map pins from the data.
            const pins = createPins(records);
    
            // Render the pins/markers after all of them have been created. (Improves performance.)
            this.renderMarkers(pins);
        } catch (error) {
            console.error("Error getting geolocation:", error);
        }

        // Uses navigator.geolocation.watchPosition().
        // This ensures the position is efficiently handled. Saves battery compared to setInterval.
        // Only gets updated when the user's position changes.
        // await locationModel.updateLiveLocation(this.locationMarker);

        // Start watching the user's position for continuous updates
        locationModel.watchPosition((position) => {
            locationModel.updatePosition(position, this.locationMarker);
        });
    }


    // Previous render.
    // async render() {

    //     this.innerHTML = `<div id="map" class="map" style="height: 100vh; width: 100%;"></div>`;

    //     this.map = L.map('map', {
    //         center: [this.geolocation.latitude, this.geolocation.longitude],
    //         zoom: 10
    //     });

    //     // this.map.locate({setView: true, maxZoom: 10});

    //     L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         maxZoom: 19,
    //         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    //     }).addTo(this.map);

    //     let bounds = this.map.getBounds();
    //     console.log(bounds);


    //     // Make K-SAMSÖK API call and fetch data.
    //     const records = await fetchGeoData();

    //     // Create map pins from the data.
    //     const pins = createPins(records);

    //     // Render the pins/markers after all of them have been created. (Improves performance.)
    //     this.renderMarkers(pins);

    // }

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

            iconSize:     [9.5, 23.75], // size of the icon
            shadowSize:   [12.5, 16], // size of the shadow
            iconAnchor:   [5.5, 23.5], // point of the icon which will correspond to marker's location
            shadowAnchor: [1, 15.5],  // the same for the shadow
            popupAnchor:  [-3, -29] // point from which the popup should open relative to the iconAnchor
        });
        let markers = new L.MarkerClusterGroup();
        let uniqueLocations = [];
        // console.log(pins);
        for (let pin of pins) {
            if (pin.coords && pin.visibleAboveGround) {
                if (pin.coords.type === "MultiPoint") {
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
                } else if (pin.coords.type === "MultiPolygon") {
                    // console.log(pin.coords.coordsArray);

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

        this.map.addLayer(markers);

        // Old version, no clusters.
        // for (let pin of pins) {
        //     let marker = L.marker([
        //         pin.coords.lat,
        //         pin.coords.lon
        //     ]).addTo(this.map);
        //     marker.bindPopup(`
        //         <div class="pin">
        //             <h3><a href="https://www.google.com/search?q=${pin.name}">${pin.name}</a></h3>
        //             Byggnaden är från: <b>${pin.period}</b>.
        //         </div>`
        //     ).openPopup();
        // }
    }

    renderLocation1() {
        let locationMarker = L.icon({
            iconUrl: "./assets/images/location.png",
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, 0]
        });

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                L.marker(
                    [position.coords.latitude, position.coords.longitude],
                    {icon: locationMarker}
                ).addTo(this.map);

                this.geolocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
            });
        }
    }
}