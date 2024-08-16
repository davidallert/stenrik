/**
 * The Supabase Model object includes functions that handle API calls to the Supabase database. Not currently in use.
 */

"use strict";

import supabase from "../util/supabase_client.js";

// Doc: https://supabase.com/docs/guides/auth/passwords

const supabaseModel = {
    fetchData: async function fetchData() {
        let { data: site_data, error } = await supabase
        .from('site_data')
        .select('*')
        // .eq('site_type', ['Bro'])
        // .in('site_type', ['Kloster', 'Kyrka/kapell'])
        .limit(25000);

        if (!error) {
            console.log(site_data);
            return site_data;
        }

        console.log(error);

    }

}

export default supabaseModel;