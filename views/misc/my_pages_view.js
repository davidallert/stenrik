import authModel from "../../models/auth_model.js";

export default class MyPagesView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // if (!authModel.accessToken) {
        //     window.location.hash = "logga-in";
        // }

        this.render();
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
                    <div style="background-color: #f2efe8;height: 500px; width: 100%;"></div>
                </div>
            </div>
        `
    }
}