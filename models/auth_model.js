/**
 * The Auth Model object includes functions that handle authentication of users and fetching of user data.
 */

import supabase from "../util/supabase_client.js";
import supabaseModel from "./v2/supabase_model.js";

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
            supabaseModel.collectUserFavoriteSites();
        }

    },

    logout: async function logout() {
        let { error } = await supabase.auth.signOut();
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