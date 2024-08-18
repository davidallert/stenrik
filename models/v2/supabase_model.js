/**
 * The Supabase Model object includes functions that handle API calls to the Supabase database. Not currently in use.
 */

"use strict";

import supabase from "../../util/supabase_client.js";

// Doc: https://supabase.com/docs/guides/auth/passwords

const supabaseModel = {
    fetchData: async function fetchData() {
        let { data: site_data, error } = await supabase
        .from('site_data')
        .select('*')
        // .eq('site_type', ['Fyr'])
        // .in('site_type', ['Kloster', 'Kyrka/kapell'])
        .limit(10);

        if (!error) {
            console.log(site_data);
            return site_data;
        }
        console.log(error);
    },

    fetchBoundingBoxData: async function fetchBoundingBoxData(boundingBox) {
        const { data, error } = await supabase.rpc('fetch_bounding_box_data', {
            west: boundingBox.west,
            south: boundingBox.south,
            east: boundingBox.east, 
            north: boundingBox.north,
            max_rows: 100000
        });
    
        if (error) {
            console.error('Error fetching points:', error);
            return null;
        }

        return data;
    }
    
}



export default supabaseModel;