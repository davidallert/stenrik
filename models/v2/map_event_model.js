/**
 * The Map Event Model object includes functions that handle event listeners related to the map.
 */

"use strict";

import locationModel from "../location_model.js";
import loading from "../../util/loading.js";
import elementModel from "./element_model.js";
import checkIf from "../../util/is_mobile.js";
import supabaseModel from "./supabase_model.js";
import authModel from "../auth_model.js";

const mapEventModel = {
    screenFlash: function screenFlash() {
        // Maybe create a function that makes the screen or borders flash when the user is too far or close enough to search. Green/red pulse/blink. Has to be easy on the eyes, though.
    },

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
                loading.displaySpinner();

                const compassEvent = this.getCompassSupport();
                const permission = await this.requestDeviceOrientationPermission();

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

                // locationTrackingBtn.childNodes[0].style.color = "black";

                if (compassEvent === "DeviceOrientationAbsoluteEvent") {
                    this.deviceOrientationAbsoluteEvent(locationMarker, locationMarkerIconArrow, deviceOrientationTriggerIndex);
                } else if (compassEvent === "webkitCompassHeading") {
                    this.webkitCompassHeadingEvent(locationMarker, locationMarkerIconArrow, deviceOrientationTriggerIndex, permission);
                } else if (compassEvent === "unsupported") {
                    alert("UNSUPPORTED DEVICE")
                }

                if (compassEvent !== "unsupported" && checkIf.deviceIsMobile()) {
                    let compassDiv = document.getElementsByClassName("compass-div")[0];
                    compassDiv.classList.toggle("hidden");
                    compassDiv.style.bottom = "150px";
                }

                loading.removeSpinner();

                // Fly to the user's position.
                map.flyTo([position.coords.latitude, position.coords.longitude], zoomLevel, {
                    animate: true,
                    duration: 1
                });

            // Fly to the user's location if the button is clicked again.
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

    deviceOrientationAbsoluteEvent: (locationMarker, locationMarkerIconArrow, deviceOrientationTriggerIndex) => {
        window.addEventListener("deviceorientationabsolute", (event) => {
            // The event will always trigger once when it's initialized.
            // On desktop, it will never trigger twice.
            // This will cause the dot icon to change to an arrow icon the first time it's triggered by an actual device orientation change.
            if (deviceOrientationTriggerIndex === 2 && checkIf.deviceIsMobile()) {
                locationMarker.setIcon(locationMarkerIconArrow);
            }
            deviceOrientationTriggerIndex++;

            let locationMarkerIconEl = document.getElementById("locationMarkerIconEl");
            let adjustedRotation = (360 - event.alpha - 45) % 360;
            locationMarkerIconEl.style.transform = `rotate(${adjustedRotation}deg)`;

            let compass = document.getElementById("compass");
            compass.style.transform = `rotate(${event.alpha - 45}deg)`;
        });
    },

    webkitCompassHeadingEvent: (locationMarker, locationMarkerIconArrow, deviceOrientationTriggerIndex, permission) => {
        if (permission === 'granted') {
            window.addEventListener("deviceorientation", (event) => {
                // The event will always trigger once when it's initialized. This happens on all devices.
                // On desktop, it will never trigger twice.
                // This will cause the dot icon to change to an arrow icon the first time it's triggered by an actual device orientation change.
                if (deviceOrientationTriggerIndex === 2 && checkIf.deviceIsMobile()) {
                    locationMarker.setIcon(locationMarkerIconArrow);
                }
                deviceOrientationTriggerIndex++;

                let locationMarkerIconEl = document.getElementById("locationMarkerIconEl");
                let adjustedRotation = (event.webkitCompassHeading - 45);
                locationMarkerIconEl.style.transform = `rotate(${adjustedRotation}deg)`;

                let compass = document.getElementById("compass");
                adjustedRotation = 360 - event.webkitCompassHeading - 45;
                compass.style.transform = `rotate(${adjustedRotation}deg)`;
            });
        }
    },
    /**
     * Checks whether the device supports the device orientation absolute event, webkit compass heading, or neither.
     * @returns 
     */
    getCompassSupport: () => {
        if ('ondeviceorientationabsolute' in window) {
          return 'DeviceOrientationAbsoluteEvent';
        } else if ('webkitCompassHeading' in DeviceOrientationEvent.prototype) {
          return 'webkitCompassHeading';
        } else {
          return 'unsupported';
        }
      },

      /**
       * Used to request permission to track device motion from iOS devices.
       * @returns 
       */
      requestDeviceOrientationPermission: async () => {
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            try {
                const permissionState = await DeviceMotionEvent.requestPermission();
                if (permissionState === 'granted') {
                    return 'granted';
                } else {
                    console.log('Permission denied');
                    return 'denied';
                }
            } catch (error) {
                console.error('Error requesting device orientation permission:', error);
                return `Error requesting device orientation permission: ${error}`;
            }
        } else {
            // Non-iOS 13+ devices (or iOS 12 and below)
            return 'granted';
        }
    },

    /**
     * Fix, removes the search button when a popup is clicked, to avoid obstructing its content.
     * @param {*} map 
     */
    removeSearchButtonOnPopupOpen: async function (map) {
        map.on('popupopen', () => {
            const searchButton = document.getElementById("searchButton");
            elementModel.fadeElement(searchButton);
            // Workaround to force the button to be hidden whenever a marker is open,
            // even if the moveend event is triggered and the zoomlevel is valid.
            // This prevents the search button from blocking the popup content.
            searchButton.style.display = "none";
          });
    },

    /**
     * Display the search button when a popup is closed, if the zoom level is appropriate.
     * @param {*} map 
     */
    addSearchButtonOnPopupClose: async function addSearchButtonOnPopupClose(map) {
        map.on('popupclose', () => {
            const searchButton = document.getElementById("searchButton");
            searchButton.style.display = "flex"; // Must change from display: none; before fadeInElement is called.
            if (map.getZoom() >= 9) {
                elementModel.fadeInElement(searchButton);
            }
          });
    },

    addBookmarkEvents(map) {
        map.on('popupopen', (e) => {
            let popupContent = e.popup.getElement();
            let bookmarkIcon = popupContent.getElementsByClassName("bookmark-icon")[0];
            if (supabaseModel.userFavoriteSites.includes(bookmarkIcon.dataset.site)) {
                bookmarkIcon.classList.remove('fa-regular');
                bookmarkIcon.classList.add('fa-solid');
            } else {
                bookmarkIcon.classList.remove('fa-solid');
                bookmarkIcon.classList.add('fa-regular');
            }

            bookmarkIcon.addEventListener("click", this.saveBookmarkEvent);
        });
    },

    async saveBookmarkEvent(e) {
        if (authModel.accessToken) {
            let result = await supabaseModel.toggleFavoriteSite(e.target.dataset.site);
            if (result === "success") {
                console.log(result);

                if (supabaseModel.userFavoriteSites.includes(e.target.dataset.site)) {
                    e.target.classList.remove('fa-solid');
                    e.target.classList.add('fa-regular');
                    let index = supabaseModel.userFavoriteSites.indexOf(e.target.dataset.site);
                    if (index !== -1) {
                        supabaseModel.userFavoriteSites.splice(index, 1); // Removes the first occurrence of 'banana'
                    }
                } else {
                    e.target.classList.remove('fa-regular');
                    e.target.classList.add('fa-solid');
                    supabaseModel.userFavoriteSites.push(e.target.dataset.site);
                    console.log(supabaseModel.userFavoriteSites);
                }
            }
            else if (result === "User is not authenticated") {
                console.log(result);
            } 
        }
    },
}

export default mapEventModel;