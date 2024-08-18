/**
 * The Map Event Model object includes functions that handle event listeners related to the map.
 */

"use strict";

import positioningModel from "../positioning_model.js";
import mapModel from "../v2/map_model.js";
import locationModel from "../location_model.js";
import supabaseModel from "./supabase_model.js";

const mapEventModel = {
    /**
     * Adds an event listener to the Leaflet map, which tracks movement.
     * When the event is triggered, a search button will appear at the top of the screen.
     * @param {Object} map The Leaflet map object (this.map in map_view.js).
     */
    addSearchAreaOnMoveEvent: async function addSearchAreaOnMoveEvent(map, markers, addedSites) {
        this.searchButtonEventTriggered = false;

        map.on("moveend", (e) => { // Triggers at the end of the movement. Other options are "movestart" and "move".
            // TODO Make sure the event is only triggered once for a unique set of bounds.
            if (!this.searchButtonEventTriggered && map.getZoom() > 8) {
                this.searchButtonEventTriggered = true;
                // Create the search box element when the map is moved.
                let searchButton = document.createElement("div");
                let mapOverlay = document.getElementById("mapOverlay");

                // Add style to the search box.
                searchButton.textContent = "Sök i området";
                searchButton.classList.add("search-button");
                searchButton.id = "searchButton";

                // Append to the wrapper element.
                mapOverlay.append(searchButton);

                // Initial centering of the search box.
                positioningModel.centerElementHorizontally(searchButton);

                // Add continuous centering of the search box if the window is changed/resized.
                positioningModel.addCenterElementHorizontallyEvent(searchButton);

                searchButton.addEventListener("click", () => {
                    this.searchButtonClickEvent(map, markers, addedSites);
                });
            }
        });
    },

    /**
     * Adds a click event to the search button which is created by addSearchAreaEventOnMove.
     * The button fades out and is then removed from the page.
     * An API call is made, using the current bounding box coordinates.
     * The records that were found is then turned into markers and added to the map.
     * @param {Object} map The Leaflet map object (this.map in map_view.js).
     */
    searchButtonClickEvent: async function searchButtonClickEvent(map, markers, addedSites) {
        // Fade the search button, then remove it after a duration of 300ms (Its transition-duration is 0.3s).
        this.fadeSearchButton();

        // Get the coords of the current bounding box via the mapModel.
        const boundingBox = await mapModel.getBoundingBoxCoords(map);

        // Fetch the data from within the current bounding box.
        const records = await supabaseModel.fetchBoundingBoxData(boundingBox);

        if (records) {
            mapModel.createMarkers(map, markers, addedSites, records); // Create markers.
        }

        // Change the searchButtonEventTriggered flag in order to create a new search button when the map is moved.
        this.searchButtonEventTriggered = false;
    },

    fadeSearchButton: function fadeSearchButton() {
        let searchButton = document.getElementById("searchButton");
        if (searchButton) {
            searchButton.style.opacity = "0";
            setTimeout(() => {
                searchButton.remove();
            }, 300);
        }
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