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

                // Check which compass event should be used (essentially Android vs iOS).
                const compassEvent = this.getCompassSupport();
                // Need explicit permission granted from Apple users to be able to use device orientation.
                const permission = await this.requestDeviceOrientationPermission();

                // Get the initial position and save it.
                const position = await locationModel.getInitialPosition();
                locationModel.setCurrentPosition(position);

                // Init two icons. A dot, used for desktops and unsupported devices, and an arrow, used for device orientation.
                const locationMarkerIconDot = L.divIcon({
                    html: `<i id="locationMarkerIconEl" class="fa-regular fa-circle-dot"></i>`,
                    className: 'fa-location-icon',
                });
                const locationMarkerIconArrow = L.divIcon({
                    html: `<i id="locationMarkerIconEl" <i class="fa-solid fa-location-arrow fa-rotate-by" style="--fa-rotate-angle: -45deg;""></i>`,
                    className: 'fa-location-icon',
                });

                // Watch the user's precision with high accuracy.
                locationModel.watchPosition((position) => {
                    locationModel.updatePosition(position, locationMarker);
                });

                // Create the location marker. Always initialized as the dot.
                locationMarker = L.marker(
                  [position.coords.latitude, position.coords.longitude],
                  { icon: locationMarkerIconDot }
                );

                locationMarker.addTo(map);

                // Optional, change the style of the location tracking button when it's active.
                // locationTrackingBtn.childNodes[0].style.color = "black";

                if (compassEvent === "DeviceOrientationAbsoluteEvent") {
                    this.deviceOrientationAbsoluteEvent(locationMarker, locationMarkerIconArrow, deviceOrientationTriggerIndex);
                } else if (compassEvent === "webkitCompassHeading") {
                    this.webkitCompassHeadingEvent(locationMarker, locationMarkerIconArrow, deviceOrientationTriggerIndex, permission);
                } else if (compassEvent === "unsupported") {
                    alert("Unsupported device :(")
                }

                // Add a compass if the device is mobile.
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

    /**
     * Starts tracking the device's orientation. Android.
     * @param {L.marker} locationMarker The Leaflet marker object displaying location.
     * @param {string} locationMarkerIconArrow Font awesome arrow icon.
     * @param {number} deviceOrientationTriggerIndex Index that checks how many times the orientation event has been triggered.
     */
    deviceOrientationAbsoluteEvent: (locationMarker, locationMarkerIconArrow, deviceOrientationTriggerIndex) => {
        window.addEventListener("deviceorientationabsolute", (event) => {
            // The event will always trigger once when it's initialized.
            // On desktop, it will never trigger twice.
            // This will cause the dot icon to change to an arrow icon the first time it's triggered by an actual device orientation change.
            if (deviceOrientationTriggerIndex === 1 && checkIf.deviceIsMobile()) {
                locationMarker.setIcon(locationMarkerIconArrow);
            }
            deviceOrientationTriggerIndex++;

            // Change the rotation of the marker.
            // (360 - (other calc)) % 360 is used to reverse the rotation and make sure it's always positive.
            let locationMarkerIconEl = document.getElementById("locationMarkerIconEl");
            // Remove 45 degrees to account for the default rotation of the arrow.
            let adjustedRotation = (360 - event.alpha - 45) % 360;
            locationMarkerIconEl.style.transform = `rotate(${adjustedRotation}deg)`;

            // Rotate the compass so that it always points north.
            let compass = document.getElementById("compass");
            compass.style.transform = `rotate(${event.alpha - 45}deg)`;
        });
    },

    /**
     * Starts tracking the device's orientation. Apple.
     * @param {L.marker} locationMarker The Leaflet marker object displaying location.
     * @param {string} locationMarkerIconArrow Font awesome arrow icon.
     * @param {number} deviceOrientationTriggerIndex Index that checks how many times the orientation event has been triggered.
     * @param {string} permission Explicit permission from the user.
     */
    webkitCompassHeadingEvent: (locationMarker, locationMarkerIconArrow, deviceOrientationTriggerIndex, permission) => {
        if (permission === 'granted') {
            window.addEventListener("deviceorientation", (event) => {
                // The event will always trigger once when it's initialized. This happens on all devices.
                // On desktop, it will never trigger twice.
                // This will cause the dot icon to change to an arrow icon the first time it's triggered by an actual device orientation change.
                if (deviceOrientationTriggerIndex === 1 && checkIf.deviceIsMobile()) {
                    locationMarker.setIcon(locationMarkerIconArrow);
                }
                deviceOrientationTriggerIndex++;

                // Change the rotation of the marker.
                // (360 - (other calc)) % 360 is used to reverse the rotation and make sure it's always positive.
                // Remove 45 degrees to account for the default rotation of the arrow.
                let locationMarkerIconEl = document.getElementById("locationMarkerIconEl");
                let adjustedRotation = (event.webkitCompassHeading - 45);
                locationMarkerIconEl.style.transform = `rotate(${adjustedRotation}deg)`;

                // Rotate the compass so that it always points north.
                let compass = document.getElementById("compass");
                adjustedRotation = 360 - event.webkitCompassHeading - 45;
                compass.style.transform = `rotate(${adjustedRotation}deg)`;
            });
        }
    },
    /**
     * Checks whether the device supports the device orientation absolute event, webkit compass heading, or neither.
     * @returns {string} The name of the orientation event or unsupported.
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
       * @returns {string} Is granted or denied.
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

    /**
     * Select which bookmark icon to display and add an event listener to it.
     * @param {L.map} map The Leaflet map object.
     */
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

    /**
     * Save/bookmark the site if it isn't already bookmarked when the bookmark icon is clicked.
     * Remove the bookmark if it is.
     * @param {Event} e The click event.
     */
    async saveBookmarkEvent(e) {
        if (authModel.accessToken) {
            let result = await supabaseModel.toggleFavoriteSite(e.target.dataset.site);
            if (result === "success") {
                if (supabaseModel.userFavoriteSites.includes(e.target.dataset.site)) {
                    elementModel.fadeInFadeOut(e.target);
                    e.target.classList.remove('fa-solid');
                    e.target.classList.add('fa-regular');
                    let index = supabaseModel.userFavoriteSites.indexOf(e.target.dataset.site);
                    if (index !== -1) {
                        supabaseModel.userFavoriteSites.splice(index, 1); // Removes the first occurrence.
                    }
                } else {
                    elementModel.fadeInFadeOut(e.target);
                    e.target.classList.remove('fa-regular');
                    e.target.classList.add('fa-solid');
                    supabaseModel.userFavoriteSites.push(e.target.dataset.site);
                    console.log(supabaseModel.userFavoriteSites);
                }
            }
            // TODO add flash message here.
            else if (result === "User is not authenticated") {
                console.log(result);
            }
        }
    },
}

export default mapEventModel;