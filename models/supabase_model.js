"use strict";

// Doc: https://supabase.com/docs/guides/auth/passwords

const supabaseModel = {
    fetchData: async function fetchData() {
        const { data, error } = await supabase.from('your_table').select('*');
        if (error) {
          console.error('Error fetching data:', error);
        } else {
          console.log('Data:', data);
        }
      },

      signUpNewUser: async function signUpNewUser() {
        const { data, error } = await supabase.auth.signUp({
          email: 'example@email.com',
          password: 'example-password',
          options: {
            emailRedirectTo: 'https://example.com/welcome',
          },
        })
      },

      signInWithEmail: async function signInWithEmail() {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'example@email.com',
          password: 'example-password',
        })
      },

}

export default supabaseModel;