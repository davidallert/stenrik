/**
 * The Map Event Model object includes functions that handle event listeners related to the map.
 */

"use strict";

import locationModel from "../location_model.js";

const mapEventModel = {
    fadeElement: function fadeElement(element) {
        const computedStyle = window.getComputedStyle(element);
        const visibility = computedStyle.visibility;
        if (visibility === "visible") {
            element.style.backgroundColor = "#D19FAE";
            element.style.opacity = "0";
            setTimeout(() => {
                element.classList.toggle("hidden");
                element.style.backgroundColor = "#ffffff";
            }, 300);
        }
    },

    fadeInElement: function fadeInElement(element) {
        const computedStyle = window.getComputedStyle(element);
        const visibility = computedStyle.visibility;
        if (visibility === "hidden") {
            element.classList.toggle("hidden");
            element.style.opacity = "1";
        }
    },

    screenFlash: function screenFlash() {
        // Maybe create a function that makes the screen or borders flash when the user is too far or close enough to search. Green/red pulse/blink. Has to be easy on the eyes, though.
    },
    // test: (map) => {
    //     let alpha = null;
    //     let initialAlpha = null;
    //     let correctedAlpha = null;
    //     let locationMarker = null;
    //     let testOnce = true;

    //     const locationMarkerIcon = L.divIcon({
    //         html: `<i id="locationMarkerIconElement" class="fa-solid fa-upload"></i>`,
    //         className: 'fa-location-icon',
    //     });
    
    //     locationMarker = L.marker(
    //         [57.490224, 12.632039],
    //         { icon: locationMarkerIcon }
    //     );
    //     locationMarker.addTo(map);

    //     let locationMarkerIconElement = document.getElementById("locationMarkerIconElement");

    //     window.addEventListener("deviceorientation", (event) => {
    //         alpha = event.alpha;
    //         console.log(alpha);
    //         if (testOnce && alpha) {
    //             testOnce = false;
    //             correctedAlpha = (360 - alpha) % 360;
    //             locationMarkerIconElement.style.transform = `rotate(${correctedAlpha}deg)`;
    //             locationMarker.bindPopup(`Alpha: ${alpha}, Corrected: ${correctedAlpha}, Initial: ${initialAlpha}, Absolute: ${event.absolute}`, {'maxHeight': '500', 'maxWidth': '300'});
    //         }
    //     });
    // },

    /**
     * Adds a click event to a button in the bottom right corner.
     * The button centers the map around the user's position and zooms in.
     * @param {Object} map The Leaflet map object (this.map in map_view.js).
     */
    addLocationTrackingEvent: function addLocationTrackingEvent(map) {
        let init = true;
        let deviceOrientationTriggerIndex = 0;
        let locationMarker = null;
        const zoomLevel = 17;
        const locationTrackingBtn = document.getElementById("locationTrackingBtn");

        locationTrackingBtn.addEventListener("click", async () => {
            if (init) {
                init = false;
                const position = await locationModel.getInitialPosition();
                locationModel.setCurrentPosition(position);

                const locationMarkerIconDot = L.divIcon({
                    html: `<i id="locationMarkerIconEl" class="fa-regular fa-circle-dot"></i>`,
                    className: 'fa-location-icon',
                });
                const locationMarkerIconArrow = L.divIcon({
                    html: `<i id="locationMarkerIconEl" <i class="fa-solid fa-location-arrow fa-rotate-by" style="--fa-rotate-angle: -45deg;""></i>`,
                    className: 'fa-location-icon',
                });

                locationModel.watchPosition((position) => {
                    locationModel.updatePosition(position, locationMarker);
                });

                locationMarker = L.marker(
                  [position.coords.latitude, position.coords.longitude],
                  { icon: locationMarkerIconDot }
                );

                locationMarker.addTo(map);

                locationTrackingBtn.childNodes[0].style.color = "#abd2df";

                let adjustedRotation = 0;

                window.addEventListener("deviceorientationabsolute", (event) => {
                    // The event will always trigger once when it's initialized. This happens on all devices.
                    // On desktop, it will never trigger twice.
                    // This will cause the dot icon to change to an arrow icon the first time it's triggered by an actual device orientation change.
                    locationMarker.bindPopup(`<h3>Longitud: ${position.coords.longitude} | Latitud: ${position.coords.latitude}, Riktning: ${Math.ceil((360 - event.alpha) % 360)}</h3>`);
                    if (deviceOrientationTriggerIndex === 1) {
                        locationMarker.setIcon(locationMarkerIconArrow);
                    }
                    deviceOrientationTriggerIndex++;

                    let locationMarkerIconEl = document.getElementById("locationMarkerIconEl");
                    adjustedRotation = (360 - event.alpha - 45) % 360;
                    locationMarkerIconEl.style.transform = `rotate(${adjustedRotation}deg)`;
                });

                map.flyTo([position.coords.latitude, position.coords.longitude], zoomLevel, {
                    animate: true,
                    duration: 1
                });

            } else if (!init) {
                const position = locationModel.getCurrentPosition();

                if (position) {
                  map.flyTo([position.coords.latitude, position.coords.longitude], zoomLevel, {
                      animate: true,
                      duration: 1
                  });
              }
            }
        })
    },

    removeSearchButtonOnPopupOpen: async function (map) {
        map.on('popupopen', () => {
            const searchButton = document.getElementById("searchButton");
            mapEventModel.fadeElement(searchButton);
            // Workaround to force the button to be hidden whenever a marker is open,
            // even if the moveend event is triggered and the zoomlevel is valid.
            // This prevents the search button from blocking the popup content.
            searchButton.style.display = "none";
          });
    },

    addSearchButtonOnPopupOpen: async function addSearchButtonOnPopupOpen(map) {
        map.on('popupclose', () => {
            const searchButton = document.getElementById("searchButton");
            searchButton.style.display = "flex"; // Must change from display: none; before fadeInElement is called.
            if (map.getZoom() >= 9) {
                mapEventModel.fadeInElement(searchButton);
            }
          });
    }
}

export default mapEventModel;