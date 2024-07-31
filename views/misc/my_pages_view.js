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
            <profile-component></profile-component>
        `
    }
}