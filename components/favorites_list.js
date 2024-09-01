import supabaseModel from "../models/v2/supabase_model.js";

/**
 * Renders a list of favorite locations for a logged in user.
 * The list consists of SingleSite custom elements.
 */
export default class FavoritesList extends HTMLElement {
    constructor() {
        super();
        this.favoriteSites = [];
    }

    async connectedCallback() {
        const data = await supabaseModel.getUserFavoriteSiteData();
        this.favoriteSites = data;
        this.render();
    }

    /**
     * Map each single site to a list of sites.
     */
    render() {
        const favoritesList = this.favoriteSites.map((site) => {
            return `<single-site site='${JSON.stringify(site)}'></single-site>`;
        }).join('');

        this.innerHTML = `<div class="site-list-wrapper">${favoritesList}</div>`;
    }

}