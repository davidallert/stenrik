import supabaseModel from "../models/v2/supabase_model.js";

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

    render() {
        
        const favoritesList = this.favoriteSites.map((site) => {
            return `<single-site site='${JSON.stringify(site)}'></single-site>`;
        }).join('');

        this.innerHTML = `<div class="site-list-wrapper">${favoritesList}</div>`;
    }

}