/**
 * The Map Model object includes functions that handle the initialization of the map, rendering of markers, etc.
 */

const mapModel = {
    flyToAsync(map, latlng, zoomLevel, options) {
        return new Promise((resolve) => {
            map.flyTo(latlng, zoomLevel, options);
            map.once('moveend', resolve); // Resolve when the animation ends
        });
    },

    setViewAsync(map, latlng, zoomLevel) {
        return new Promise((resolve) => {
            map.setView(latlng, zoomLevel);
            resolve(); // Immediately resolve, as setView does not animate by default
        });
    }
}

export default mapModel;