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
                    <favorites-list></favorites-list>
                </div>
            </div>
        `
    }
}