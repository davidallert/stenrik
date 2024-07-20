const locationModel = {
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
            return navigator.geolocation.watchPosition(
                (position) => {
                    this.currentPosition = position;
                    callback(position);
                },
                (error) => console.error('Geolocation update error:', error),
                geolocationOptions
            );
        } else {
            reject(new Error ("Geolocation is not available"));
        }
    },

    // Function to move the location marker in accordance with the user's position.
    updatePosition: function(position, locationMarker) {
        const {latitude, longitude } = position.coords;
        locationMarker.setLatLng([latitude, longitude]); // Set the updated latitude and longitude for the marker.
    },

    getCurrentPosition: function getCurrentPosition() {
        return this.currentPosition;
    }
}

export default locationModel;