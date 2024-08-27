import authModel from "../../models/auth_model.js";
import supabaseModel from "../../models/v2/supabase_model.js";

export default class MyPagesView extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        if (!authModel.accessToken) {
            window.location.hash = "logga-in";
        } else {
            this.render();
            let favoriteSitesContainer = document.getElementById("favoriteSitesContainer");
            const data = await supabaseModel.getUserFavoriteSiteData();

            for (let site of data) {
                if (site.site_name) {
                    favoriteSitesContainer.innerHTML += `<h2>${site.site_name}</h2>`
                } else {
                    favoriteSitesContainer.innerHTML += `<h2>${site.site_type}</h2>`
                }
            }
            console.log(data);
        }
    }

    render() {
        this.innerHTML = `
            <div class="two-col-wrapper">
                <div class="col-one">
                    <h1>Profil</h1>
                    <profile-component></profile-component>
                </div>
                <div class="col-two">
                    <h1>Sparade platser</h1>
                    <div id="favoriteSitesContainer" style="background-color: #f2efe8;height: 500px; width: 100%;"></div>
                </div>
            </div>
        `
    }
}