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
        let initialOrientationTriggered = false;
        let initialHeadingSet = false;
        let initialOrientation = null;
        let locationMarker = null;
        const zoomLevel = 19; // 17
        const locationTrackingBtn = document.getElementById("locationTrackingBtn");
        // const listOfHeadingVals = [1, 348, 2, 10, 11, 13, 23, 18, 12, 5, 3, 13, 20, 14, 20, 30, 40, 30, 25, 15, 10, 10, 100];
        // let i = 0;
        locationTrackingBtn.addEventListener("click", async () => {

            // locationModel.calculateDirection(listOfHeadingVals[i]);
            // console.log(locationModel.headingArr);
            // i++;
            if (init) {
                init = false;
                const position = await locationModel.getInitialPosition();
                locationModel.setCurrentPosition(position);
                const locationMarkerIcon = L.divIcon({
                    html: `<i id="locationMarkerIconEl" class="fa-regular fa-circle-up"></i>`,
                    className: 'fa-location-icon',
                });

                locationModel.watchPosition((position) => {
                    locationModel.updatePosition(position, locationMarker);
                });

                locationMarker = L.marker(
                  [position.coords.latitude, position.coords.longitude],
                  { icon: locationMarkerIcon }
                );

                locationMarker.addTo(map);

                locationTrackingBtn.childNodes[0].style.color = "#abd2df";

                let relativeTrueNorth = 0;
                let relativeFalseNorth = 0;
                let relativeNorthDifference = 0;
                let adjustedRotation = 0;

                window.addEventListener("deviceorientationabsolute", (event) => {
                    locationMarker.bindPopup(`event.alpha absolute: ${event.alpha}`);
                });

                // window.addEventListener("deviceorientation", (event) => {
                //     locationMarker.bindPopup(`Arr: ${locationModel.headingArr}, lastHeading: ${locationModel.headingForTest}`);
                //     if (locationModel.heading && !initialHeadingSet) {
                //         initialHeadingSet = true;
                //         const locationMarkerIcon = L.divIcon({
                //             html: `<i id="locationMarkerIconEl" class="fa-regular fa-circle-up"></i>`,
                //             className: 'fa-location-icon',
                //         });
                //         locationMarker.setIcon(locationMarkerIcon);
                //         let locationMarkerIconEl = document.getElementById("locationMarkerIconEl");
                //         locationMarkerIconEl.style.transform = `rotate(${locationModel.heading}deg)`;
                //         relativeTrueNorth = locationModel.heading;
                //         relativeFalseNorth = event.alpha;
                //         relativeNorthDifference = relativeFalseNorth - relativeTrueNorth;
                //     } else if (initialHeadingSet) {
                //         adjustedRotation = (360 - event.alpha + relativeNorthDifference) % 360;
                //         // TODO TESTA DETTA IMORGON.
                //         if (adjustedRotation < 0) {
                //             adjustedRotation += 360;
                //         }
                //         let locationMarkerIconEl = document.getElementById("locationMarkerIconEl");
                //         locationMarkerIconEl.style.transform = `rotate(${adjustedRotation}deg)`;
                //         locationMarker.bindPopup(`event.alpha: ${Math.ceil(event.alpha)}, relativeTrueNorth: ${Math.ceil(relativeTrueNorth)}, relativeFalseNorth: ${Math.ceil(relativeFalseNorth)}, relativeNorthDifference: ${Math.ceil(relativeNorthDifference)}, adjustedRotation: ${Math.ceil(adjustedRotation)}, locationModel.headingArr: ${locationModel.headingArr}`);
                //     }
                // });


                // window.addEventListener("deviceorientation", (event) => {
                //   if (!initialOrientationTriggered) {
                //     initialOrientationTriggered = true;
                //     initialOrientation = event.alpha;
                //     let locationMarkerIconEl = document.getElementById("locationMarkerIconEl");
                //     locationMarkerIconEl.style.transform = `rotate(${event.alpha}deg)`;
                //   }
                //   else {
                  // Calculations.
                //   let rotationAdjustment = (360 - initialOrientation) % 360;
                //   let deviceOrientation = 360 - event.alpha % 360;
                //   let correctedOrientation = (deviceOrientation + rotationAdjustment) % 360;
                  // Update the element.
                //   let locationMarkerIconEl = document.getElementById("locationMarkerIconEl");
                //   locationMarkerIconEl.style.transform = `rotate(${360 - event.alpha % 360}deg)`;
                //   locationMarker.bindPopup(`Event.alpha: ${Math.ceil(event.alpha)}, Actual rotation applied: ${Math.ceil((360 - event.alpha % 360))}, Event.absolute: ${event.absolute}, Initial Orientation: ${Math.ceil(initialOrientation)}, Heading: ${Math.ceil(locationModel.heading)}`);
                //   locationMarker.bindPopup(`event.alpha: ${event.alpha}, rotationAdjustment: ${rotationAdjustment}, deviceOrientation: ${deviceOrientation}, initialOrientation: ${initialOrientation}, correctedOrientation: ${correctedOrientation}`);
                //   }
            //   });

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