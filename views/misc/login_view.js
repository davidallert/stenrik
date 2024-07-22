export default class LoginView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <div class="pin-and-buttons-wrapper">

            <div class="image-div">
                <div class="map-pin-circle"></div>
            </div>

            <div class="buttons-wrapper">
                <div class="left-button">
                    <h2 class="left-button-text noselect">Logga in</h2>
                </div>
                <div class="right-button">
                    <h2 class="right-button-text noselect">Registrera</h2>
                </div>
            </div>

        </div>

        `
    }
}

{/* <form>
<label for="username">Användarnamn</label>
<input type="text" name="username">
<label for="email">E-post</label>
<input type="email" name="email">
<label for="password">Lösenord</label>
<input type="password" name="password">
<input type="submit">
</form> */}