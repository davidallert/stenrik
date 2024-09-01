/**
 * The Auth Model object includes functions that handle authentication of users and fetching of user data.
 */

import supabase from "../util/supabase_client.js";
import supabaseModel from "./v2/supabase_model.js";

const authModel = {
    accessToken: "",

    /**
     * Login a user.
     * @param {string} email The email input.
     * @param {string} password The password input.
     */
    login: async function login(email, password) {
        let { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error(error);
        } else if (!error) {
            // console.log(data);
            authModel.accessToken = data.session.access_token; // Set the accessToken.
            supabaseModel.collectUserFavoriteSites(); // Fetch all favorite sites.
        }

    },

    /**
     * Sign out a user.
     */
    logout: async function logout() {
        let { error } = await supabase.auth.signOut();
    },

    /**
     * Register a new user.
     * @param {string} username The username input.
     * @param {string} email The email input.
     * @param {string} password The password input.
     */
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

    /**
     * Set the user's display name.
     * @param {string} username The username input.
     */
    setDisplayName: async function setDisplayName(username) {
        const data = {
            display_name: username,
          };
          const { error } = await supabase.auth.updateUser({ data });

          console.log(data);
          console.log(error);
    },

    /**
     * Gets all user data.
     * @returns {Object} All user data.
     */
    getAllUserData: async function getAllUserData() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    /**
     * Outdated func?
     * @param {string} location A unique site ID.
     */
    addFavoriteLocation: async function addFavoriteLocation(location) {
        const data = {};
        const { error } = await supabase.auth.updateUser({ data });

          console.log(data);
          console.log(error);
    },
}

export default authModel;