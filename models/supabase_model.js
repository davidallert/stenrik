"use strict";

const supabaseModel = {
    fetchData: async function fetchData() {
        const { data, error } = await supabase.from('your_table').select('*');
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          console.log('Data:', data);
        }
      }
}

export default supabaseModel;