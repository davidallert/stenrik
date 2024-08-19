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

    /**
     * Adds a click event to a button in the bottom right corner.
     * The button centers the map around the user's position and zooms in.
     * @param {Object} map The Leaflet map object (this.map in map_view.js).
     */
    addFlyToUserButtonEvent: async function addFlyToUserButtonEvent(map) {
        const flyToUserButton = document.getElementById("flyToUserButton");
        flyToUserButton.addEventListener("click", (e) => {
            // Get the current position using the locationModel.
            const position = locationModel.getCurrentPosition(); // Uses watchPosition in location_model.js.
            const zoomLevel = 17; // Set the zoom level.
            map.flyTo([position.coords.latitude, position.coords.longitude], zoomLevel, {
                animate: true,
                duration: 1
            });
        })
    }
}

export default mapEventModel;