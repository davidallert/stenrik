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
    
    test: (map) => {
        let initialAlpha = null;
        let locationMarker = null;
        let locationMarkerIconElement = null;

        const locationMarkerIcon = L.divIcon({
          html: `<i id="locationMarkerIconElement" class="fa-solid fa-circle-up"></i>`,
          className: 'fa-location-icon',
        });

        locationMarker = L.marker(
          [57.490224, 12.632039],
          { icon: locationMarkerIcon }
        );
        locationMarker.addTo(map);

        locationMarkerIconElement = document.getElementById("locationMarkerIconElement");

        mapEventModel.waitForDeviceOrientation()
          .then((event) => {
            initialAlpha = event.alpha;
            mapEventModel.handleOrientationEvent(event);
          })
          .catch((error) => {
            console.error('Error waiting for deviceorientation event:', error);
            // Handle the error, e.g., display a message to the user
          });
      },

      handleOrientationEvent: (event) => {
        let alpha = null;
        let correctedAlpha = null;
        let locationMarker = null;
        alpha = event.alpha;

        if (alpha !== null) {
          correctedAlpha = (360 - alpha) % 360;
          locationMarkerIconElement.style.transform = `rotate(${correctedAlpha}deg)`;
        //   locationMarker.bindPopup(`Alpha: ${alpha}, Corrected: ${correctedAlpha}, Initial: ${initialAlpha}, Absolute: ${event.absolute}`, {'maxHeight': '500', 'maxWidth': '300'});
        }
      },

      waitForDeviceOrientation: () => {
        return new Promise((resolve, reject) => {
          let orientationEventFired = false;
    
          const handleOrientationEvent = (event) => {
            orientationEventFired = true;
    
            // Check if event.alpha is valid
            if (typeof event.alpha === 'number') {
              window.removeEventListener('deviceorientation', handleOrientationEvent);
              resolve(event);
            } else {
              reject(new Error('event.alpha is not a valid number'));
            }
          };
    
          if (window.addEventListener) {
            window.addEventListener('deviceorientation', handleOrientationEvent, false);
          } else if (window.attachEvent) {
            window.attachEvent('deviceorientation', handleOrientationEvent);
          }
    
          // Reject the promise after a timeout, in case the event doesn't fire
          setTimeout(() => {
            if (!orientationEventFired) {
              reject(new Error('Timeout waiting for deviceorientation event'));
            }
          }, 5000);
        });
      },


    /**
     * Adds a click event to a button in the bottom right corner.
     * The button centers the map around the user's position and zooms in.
     * @param {Object} map The Leaflet map object (this.map in map_view.js).
     */
    addLocationTrackingEvent: function addLocationTrackingEvent(map) {
        let init = true;
        let locationMarker = null;
        const zoomLevel = 17;
        let alpha = 0;
        const locationTrackingBtn = document.getElementById("locationTrackingBtn");
        window.addEventListener("deviceorientation", (event) => {
            console.log(`${event.alpha} : ${event.beta} : ${event.gamma}`);
            alpha = event.alpha;
          });
        locationTrackingBtn.addEventListener("click", async () => {
            if (init) {
                init = false;
                const position = await locationModel.getInitialPosition();
                locationModel.setCurrentPosition(position);
                const locationMarkerIcon = L.divIcon({
                    html: `<i id="locationMarkerIconEl" class="fa-solid fa-location-arrow fa-rotate-by" style="--fa-rotate-angle: 315deg;""></i>`,
                    className: 'fa-location-icon',
                });
                locationMarker = L.marker(
                    [position.coords.latitude, position.coords.longitude],
                    { icon: locationMarkerIcon, rotationAngle: alpha }
                );

                locationMarker.addTo(map);
                locationModel.watchPosition((position) => {
                    locationModel.updatePosition(position, locationMarker);
                });
                locationMarker.setRotationOrigin("center center");

                locationTrackingBtn.childNodes[0].style.color = "#abd2df";

                map.flyTo([position.coords.latitude, position.coords.longitude], zoomLevel, {
                    animate: true,
                    duration: 1
                });

                // Listen for device orientation changes
                if (window.DeviceOrientationEvent) {
                    window.addEventListener('deviceorientation', (e) => {
                        this.updateOrientation(e, locationMarker)
                    }, true);
                }

            } else if (!init) {
                const position = locationModel.getCurrentPosition();
                map.flyTo([position.coords.latitude, position.coords.longitude], zoomLevel, {
                    animate: true,
                    duration: 1
                });
            }
        })
    },

    updateOrientation: (e, locationMarker) => {
        let alpha = e.alpha; // 0-360 degrees
        let adjustedAlpha = (360 - alpha) % 360;

        locationMarker.setRotationAngle(adjustedAlpha);
        // const locationMarkerIconEl = document.getElementById("locationMarkerIconEl");
        // locationMarkerIconEl.style.transform = `rotate(${adjustedAlpha}deg)`;
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