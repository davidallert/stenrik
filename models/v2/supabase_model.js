/**
 * The Supabase Model object includes functions that handle API calls to the Supabase database. Not currently in use.
 */

"use strict";

import supabase from "../../util/supabase_client.js";
import loading from "../../util/loading.js";

// Doc: https://supabase.com/docs/guides/auth/passwords

const supabaseModel = {
    userFavoriteSites: [], // An array where user favorite sites will be saved when they log in.
    /**
     * Get data from Supabase. Returns an object with the result and records.
     * @returns {Object} An object containing the result and records.
     * @returns {string} return.result - A description of the result.
     * @returns {Array} return.records - An array of record objects.
     */
    fetchData: async function fetchData() {
        loading.displaySpinner();
        let { data: site_data, error } = await supabase
        .from('site_data')
        .select('id, site_id, raa_id, site_name, site_type, municipality, parish, province, county, desc_terrain, desc_orientation, desc_tradition, desc_text, coordinates')
        // .eq('site_type', ['Runristning'])
        .limit(1000);
        // .in('site_type', ['Kloster', 'Kyrka/kapell'])

        loading.removeSpinner();

        if (error) {
            let result = false;
            let records = [];
            return { result, records };
        }
        let result = true;
        let records = site_data
        return { result, records };
    },

    /**
     * Fetch data from within a bounding box.
     * @param {Object} boundingBox A boundingBox object containing the four corners of the current viewport.
     * @returns {Array} An array of sites.
     */
    fetchBoundingBoxData: async function fetchBoundingBoxData(boundingBox) {
        const { data, error } = await supabase.rpc('fetch_bounding_box_data', {
            west: boundingBox.west,
            south: boundingBox.south,
            east: boundingBox.east, 
            north: boundingBox.north,
            max_rows: 5000
        });
    
        if (error) {
            console.error('Error fetching points:', error);
            return null;
        }

        return data;
    },

    /**
     * Toggle a favorite site via its siteId.
     * @param {string} siteId A unique site ID (K-SAMSÖK lämningsnummer).
     * @returns {string} 'Success' or an error message.
     */
    toggleFavoriteSite: async (siteId) => {
        const { data, error } = await supabase.rpc('toggle_favorite_site', {
            site_id_input: siteId
        });

        if (error) {
            console.error('An error occurred.', error);
            return error.message;
        }

        return 'success';
    },

    /**
     * Get all favorite sites for the logged in user.
     * @returns {Array} An array containing the logged in user's favorite site IDs.
     */
    getUserFavoriteSiteData: async () => {
        const { data, error } = await supabase.rpc('get_user_favorite_site_data');

        if (error) {
            console.error('An error occurred.', error);
            return [];
        }

        return data;
    },

    /**
     * Add the user's favorite sites to an array, so that they can be checked accross the application.
     */
    collectUserFavoriteSites: async () => {
        supabaseModel.userFavoriteSites = [];
        const data = await supabaseModel.getUserFavoriteSiteData();
        for (let site of data) {
            supabaseModel.userFavoriteSites.push(site.site_id);
        }
    }
}



export default supabaseModel;