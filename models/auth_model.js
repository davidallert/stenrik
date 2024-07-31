
import config from '../config.js';

// Supabase.
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

const authModel = {
    accessToken: "",

    login: async function login(email, password) {
        let { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error(error);
        } else if (!error) {
            console.log(data);
            authModel.accessToken = data.session.access_token;
        }

    },

    register: async function register(username, email, password) {
        let { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            console.error(error);
        } else if (!error) {
            await this.setDisplayName(username);
            authModel.accessToken = data.session.access_token;
        }


    },

    setDisplayName: async function setDisplayName(username) {
        const data = {
            display_name: username,
          };
          const { error } = await supabase.auth.updateUser({ data });

          console.log(data);
          console.log(error);
    },

    getAllUserData: async function getAllUserData() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    addFavoriteLocation: async function addFavoriteLocation(location) {
        const data = {};
        const { error } = await supabase.auth.updateUser({ data });

          console.log(data);
          console.log(error);
    },
}

export default authModel;