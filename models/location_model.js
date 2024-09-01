/**
 * The Location Model object includes functions that handle users' geolocation.
 */

const locationModel = {
    currentPosition: null,
    initialOrientation: null,
    orientation: null,
    userInit: false,
    heading: null,
    headingArr: [],
    headingForTest: 0,


    /**
     * Get the user's initial position.
     * @returns {Promise}
     */
    getInitialPosition: async function getInitialPosition() {
        const geolocationOptions = {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
          };

        return new Promise((resolve, reject) => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    geolocationOptions
                );
            } else {
                reject("Geolocation is not available");
            }
        });
    },

    /**
     * Continuously watch the user's position.
     * @param {callback} callback ?
     */
    watchPosition: function(callback) {
        const geolocationOptions = {
            enableHighAccuracy: true,
            maximumAge: 0, // Ensures that the position is always updated, never using a cached one.
            timeout: 30000,
          };

        // Uses navigator.geolocation.watchPosition().
        // This ensures the position is efficiently handled. Saves battery compared to setInterval.
        // Only gets updated when the user's position changes.
        if ("geolocation" in navigator) {
            this.watchId = navigator.geolocation.watchPosition(
                (position) => {
                    callback(position);
                    // if (position.coords.heading !== undefined && position.coords.heading !== null) {
                    //     locationModel.calculateDirection(position.coords.heading);
                    // } else {
                    //     console.log('Heading data is not available on this device.');
                    // }
                    this.setCurrentPosition(position);
                },
                (error) => console.error('Geolocation update error:', error),
                geolocationOptions
            );
        } else {
            reject(new Error ("Geolocation is not available"));
        }
    },

    /**
     * Obsolete?
     * @param {*} heading 
     * @returns 
     */
    calculateDirection: (heading) => {
        heading = Math.ceil(heading);
        locationModel.headingForTest = heading;
        if (locationModel.headingArr.length === 0) {
            if (heading) {
                locationModel.headingArr.push(heading);
            }
            return;
        }

        let lastHeadingIndex = locationModel.headingArr.length;
        let lastHeadingValue = locationModel.headingArr[lastHeadingIndex - 1];
        let degreeDifference = heading - lastHeadingValue;
        console.log('Heading:', heading);
        console.log('Difference:', degreeDifference);
        if (degreeDifference <= 10 && degreeDifference >= -10) {
            locationModel.headingArr.push(heading);
            if (locationModel.headingArr.length >= 20) {
                let totalVal = 0;
                let averageVal = 0;
                for (let headingVal of locationModel.headingArr) {
                    totalVal = totalVal + headingVal;
                }
                averageVal = totalVal / locationModel.headingArr.length;
                console.log('Total Value:', totalVal);
                console.log('Average Value:', averageVal);
                locationModel.heading = averageVal;
                return;
            }
            return;
        }

        locationModel.headingArr = [];
    },

    /**
     * Obsolete?
     */
    watchOrientation: function() {
        window.addEventListener("deviceorientation", (event) => {
            if (!locationModel.initialOrientation && event.alpha > 1 && locationModel.userInit) {
                locationModel.initialOrientation = event.alpha;
            } else if (locationModel.initialOrientation) {
                locationModel.orientation = event.alpha;
            }
          });
    },

    /**
     * Obsolete?
     */
    setUserInitTrue: () => {
        locationModel.userInit = true;
    },

    /**
     * Function to move the location marker in accordance with the user's position.
     * @param {Object} position Position object.
     * @param {L.marker} locationMarker Leaflet marker displaying location.
     */
    updatePosition: function(position, locationMarker) {
        const {latitude, longitude } = position.coords;
        locationMarker.setLatLng([latitude, longitude]); // Set the updated latitude and longitude for the marker.
    },

    /**
     * Gets the most recent position.
     * @returns {Object} Position object.
     */
    getCurrentPosition: function getCurrentPosition() {
        return this.currentPosition;
    },

    /**
     * Sets the most recent position.
     * @param {*} currentPosition ?
     */
    setCurrentPosition: function setCurrentPosition(currentPosition) {
        this.currentPosition = currentPosition;
    },

    /**
     * Obsolete?
     * @returns 
     */
    getOrientation: function getOrientation() {
        return locationModel.orientation;
    },

    /**
     * Obsolete?
     * @returns 
     */
    getHeading: () => {
        return this.heading;
    },

    /**
     *  Obsolete? 
     */
    // setOrientation: (orientation) => {
    //     console.log(orientation);
    //     if (orientation) {
    //         let correctedAlpha = (360 - orientation);
    //         locationModel.orientation = correctedAlpha;
    //     }
    // },

    /**
     * ?
     * @returns 
     */
    getWatchId: function getWatchId() {
        return this.watchId;
    }
}

export default locationModel;