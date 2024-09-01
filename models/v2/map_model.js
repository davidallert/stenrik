/**
 * The Map Model object includes functions that handle the initialization of the map, rendering of markers, etc.
 */

const mapModel = {
    /**
     * 
     * @param {L.map} map The Leaflet map object.
     * @param {*} latlng ?
     * @param {number} zoomLevel Map zoom level.
     * @param {Object} options 
     * @returns {Promise} ?
     */
    flyToAsync(map, latlng, zoomLevel, options) {
        return new Promise((resolve) => {
            map.flyTo(latlng, zoomLevel, options);
            map.once('moveend', resolve); // Resolve when the animation ends
        });
    },

    /**
     * Set the view.
     * @param {L.map} map The Leaflet map object.
     * @param {*} latlng ?
     * @param {number} zoomLevel Map zoom level.
     * @returns {Promise} ?
     */
    setViewAsync(map, latlng, zoomLevel) {
        return new Promise((resolve) => {
            map.setView(latlng, zoomLevel);
            resolve(); // Immediately resolve, as setView does not animate by default
        });
    }
}

export default mapModel;