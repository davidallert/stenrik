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
            <h1>Hello world</h1>
            <form>
                <label for="displayName">Användarnamn</label>
                <input type="text" name="displayName" value="${this.data.user_metadata.display_name}" readonly>
                <label for="email">E-post</label>
                <input type="email" name="email" value="${this.data.email}" readonly>
            </form>
        `
    }

    async getUserData() {
        this.data = await authModel.getAllUserData();
        console.log(this.data);
    }
}