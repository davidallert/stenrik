export default class LoginView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.addCreateFormOnClickEvent();
    }

    render() {
        this.innerHTML = `
        <div class="pin-and-buttons-wrapper">

            <div class="image-div">
                <div class="map-pin-circle"></div>
            </div>

            <div class="buttons-wrapper">
                <div id="leftButton" class="left-button">
                    <h2 class="left-button-text noselect"><span class="grey">Redan medlem?</span><span class="underline">Logga in</span></h2>
                </div>
                <div id="rightButton" class="right-button">
                    <h2 class="right-button-text noselect"><span class="grey">Bli medlem?</span><span class="underline">Nytt konto</span></h2>
                </div>
                <div id="arrowDown" class="arrow-down"></div>
            </div>

        </div>

        <div id="signInUpFormWrapper" class="sign-in-up-form-wrapper"></div>

        `
    }

    addCreateFormOnClickEvent() {
        const formWrapper = document.getElementById("signInUpFormWrapper");
        const leftButton = document.getElementById("leftButton");
        const rightButton = document.getElementById("rightButton");

        leftButton.addEventListener("click", (e) => {
            formWrapper.innerHTML = `
            <h2>Logga in</h2>
            <form id="signInUpForm" class="sign-in-up-form">
                <label for="username">Användarnamn</label>
                <input type="text" name="username">
                <label for="password">Lösenord</label>
                <input type="password" name="password">
                <input type="submit">
            </form>
            `
        });

        rightButton.addEventListener("click", (e) => {
            formWrapper.innerHTML = `
            <h2>Registrera användare</h2>
            <form id="signInUpForm" class="sign-in-up-form">
                <label for="username">Användarnamn</label>
                <input type="text" name="username">
                <label for="email">E-post</label>
                <input type="email" name="email">
                <label for="password">Lösenord</label>
                <input type="password" name="password">
                <input type="submit">
            </form>
            `
        });
    }

    addRegisterFormOnClickEvent() {

    }
}