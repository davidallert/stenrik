/**
 * Fetches and renders data about the user.
 */

import authModel from "../../models/auth_model.js";

export default class ProfileComponent extends HTMLElement {
    constructor() {
        super();

        this.data = "";
    }

    async connectedCallback() {
        await this.getUserData()
        this.render();
    }

    render() {
        this.innerHTML = `
            <form>
                <label for="displayName">Användarnamn</label>
                <input type="text" name="displayName" value="${this.data.user_metadata.display_name}" readonly>
                <label for="email">E-post</label>
                <input type="email" name="email" value="${this.data.email}" readonly>
            </form>
        `
    }

    /**
     * Get all user data from Supabase.
     */
    async getUserData() {
        this.data = await authModel.getAllUserData();
    }
}