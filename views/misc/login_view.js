export default class LoginView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <h1>Logga in eller registrera en ny användare</h1>
        <div class="double-buttons-wrapper">
            <div class="image-div">
                <div class="map-pin-circle"></div>
            </div>
            <div class="left-button">
                <h2>Logga in</h2>
            </div>
            <div class="right-button">
                <h2>Registrera</h2>
            </div>
        </div>
            <form>
                <label for="username">Användarnamn</label>
                <input type="text" name="username">
                <label for="email">E-post</label>
                <input type="email" name="email">
                <label for="password">Lösenord</label>
                <input type="password" name="password">
                <input type="submit">
            </form>
        `
    }
}