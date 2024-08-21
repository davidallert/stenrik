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
                    if (position.coords.heading !== undefined && position.coords.heading !== null) {
                        console.log('Heading:', position.coords.heading);
                        locationModel.calculateDirection(position.coords.heading);
                    } else {
                        console.log('Heading data is not available on this device.');
                    }
                    this.setCurrentPosition(position);
                },
                (error) => console.error('Geolocation update error:', error),
                geolocationOptions
            );
        } else {
            reject(new Error ("Geolocation is not available"));
        }
    },

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

    watchOrientation: function() {
        window.addEventListener("deviceorientation", (event) => {
            if (!locationModel.initialOrientation && event.alpha > 1 && locationModel.userInit) {
                locationModel.initialOrientation = event.alpha;
            } else if (locationModel.initialOrientation) {
                locationModel.orientation = event.alpha;
            }
          });
    },

    setUserInitTrue: () => {
        locationModel.userInit = true;
    },

    // Function to move the location marker in accordance with the user's position.
    updatePosition: function(position, locationMarker) {
        const {latitude, longitude } = position.coords;
        locationMarker.setLatLng([latitude, longitude]); // Set the updated latitude and longitude for the marker.
    },

    getCurrentPosition: function getCurrentPosition() {
        return this.currentPosition;
    },

    setCurrentPosition: function setCurrentPosition(currentPosition) {
        this.currentPosition = currentPosition;
    },

    getOrientation: function getOrientation() {
        return locationModel.orientation;
    },

    getHeading: () => {
        return this.heading;
    },

    // setOrientation: (orientation) => {
    //     console.log(orientation);
    //     if (orientation) {
    //         let correctedAlpha = (360 - orientation);
    //         locationModel.orientation = correctedAlpha;
    //     }
    // },

    getWatchId: function getWatchId() {
        return this.watchId;
    }
}

export default locationModel;