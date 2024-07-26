import authModel from "../../models/auth_model.js";

export default class LoginView extends HTMLElement {
    constructor() {
        super();

        this.formExists = false;
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

            <div id="buttonsWrapper" class="buttons-wrapper">
                <a href="#formHeading"><div id="leftButton" class="left-button"></a>
                    <h2 class="left-button-text noselect"><span class="grey">Redan medlem?</span><span class="underline">Logga in</span></h2>
                </div>
                <a href="#formHeading"><div id="rightButton" class="right-button"></a>
                    <h2 class="right-button-text noselect"><span class="grey">Bli medlem?</span><span class="underline">Nytt konto</span></h2>
                </div>
                <div id="arrowDown" class="arrow-down"></div>
            </div>

        </div>

        <div id="animationArea">
            <div id="signInUpFormWrapper" class="sign-in-up-form-wrapper"></div>
        </div>
        `
    }

    /**
     * HTML for the login form.
     */
    createLoginFormHtml() {
        const formWrapper = document.getElementById("signInUpFormWrapper");
        formWrapper.innerHTML = `
        <div id="fadeInDiv" class="fade-in">
            <h2 id="formHeading" class="form-heading">Logga in</h2>
            <form id="signInForm" class="sign-in-up-form">
                <label for="email">E-post</label>
                <input type="email" name="email" autocomplete="current-password">
                <label for="password">Lösenord</label>
                <input type="password" name="password" autocomplete="current-password">
                <label><br></label>
                <input type="submit" id="submitBtn" class="submit-btn" value="Logga in" data-action="login">
            </form>
        </div>
        `
    }
    
    /**
     * HTML for the register form.
     */
    createRegisterFormHtml() {
        const formWrapper = document.getElementById("signInUpFormWrapper");
        formWrapper.innerHTML = `
        <div id="fadeInDiv" class="fade-in">
            <h2 id="formHeading" class="form-heading">Registrera dig</h2>
            <form id="signUpForm" class="sign-in-up-form">
                <label for="dummy-username" style="display:none;">Username</label>
                <input type="username" id="dummy-username" style="display:none;" autocomplete="off">

                <label for="username">Användarnamn</label>
                <input type="text" id="username" name="username" autocomplete="off">
                <label for="email">E-post</label>
                <input type="email" id="email" name="email" autocomplete="email">
                <label for="password">Lösenord</label>
                <input type="password" id="password" name="password" autocomplete="current-password">
                <label><br></label>
                <input type="submit" id="submitBtn" class="submit-btn" value="Skapa nytt konto" data-action="register">
            </form>
        </div>
    `

    }

    /**
     * Adds event listeners to the left and right buttons.
     * On click, the buttons will create a form.
     * The left button creates a login form (the user is asked to provide username and password).
     * The right button creates a register form (the user is asked to provide username, password and email).
     */
    addCreateFormOnClickEvent() {
        const leftButton = document.getElementById("leftButton");
        const rightButton = document.getElementById("rightButton");
        const arrowDown = document.getElementById("arrowDown");

        leftButton.addEventListener("click", (e) => {
            this.createAnimation("#acd09e");
            this.createLoginForm();
        });

        rightButton.addEventListener("click", (e) => {
            this.createAnimation("#abd2df");
            this.createRegisterForm();
        });
    }

    /**
     * Adds an animation to the downward "arrow" (the triangle),
     * then scrolls down to the bottom of the page.
     * Lastly, the form is created.
     * @param {string} backgroundColor The color that the background of the form should use. E.g. a hex code.
     */
    createAnimation(backgroundColor) {
        this.moveArrow(backgroundColor);
        this.scrollDown();
        this.createFormBg(backgroundColor);
    }

    /**
     * Move the arrow/triangle downwards by 100 vh, while changing its color to match the background of the form.
     * @param {string} backgroundColor The color that the background of the form should use. E.g. a hex code.
     */
    moveArrow(backgroundColor) {
        const animationArea = document.getElementById("animationArea"); // Wrapper for the bottom half of the screen.
        const arrowDown = document.getElementById("arrowDown"); // The arrow/triangle.

        animationArea.style.height = "100vh"; // Add space so that the arrow has room to move down, outside of the viewport.
        arrowDown.style.transitionDuration = "6s"; // Can be changed to control the speed of the arrow/triangle.
        arrowDown.style.transform = "translateY(100vh)"; // Can be changed to control the distance traveled.
        arrowDown.style.borderRightWidth = "37.5vw";
        arrowDown.style.borderLeftWidth = "37.5vw";
        arrowDown.style.marginLeft = "-37.5vw";
        arrowDown.style.borderTopColor = `${backgroundColor}`
    }

    /**
     * Creates the colored background of the form. Uses CSS keyframes through the class animate-form-bg.
     * @param {string} backgroundColor The color that the background of the form should use. E.g. a hex code.
     */
    createFormBg(backgroundColor) {
        const arrowDown = document.getElementById("arrowDown");
        const formWrapper = document.getElementById("signInUpFormWrapper");

        setTimeout(() => {
            formWrapper.classList.add("animate-form-bg");
            formWrapper.style.backgroundColor = `${backgroundColor}`;
            arrowDown.style.opacity = "0"; // Make the arrow fade out along its path.
            arrowDown.style.visibility = "hidden";
        }, 300);

        setTimeout(() => {
            formWrapper.style.width = "100vw";
            formWrapper.style.height = "100vh";
            formWrapper.style.transitionDuration = "0s";
        }, 3000);
    }

    /**
     * Creates the login form and fades it in/out.
     */
    createLoginForm() {
        if(!this.formExists) {
            setTimeout(() => {
                this.createLoginFormHtml();
                this.addSubmitEvent();
                this.fadeInForm();
            }, 900);
        } else if (this.formExists) {
            this.fadeOutForm();
            setTimeout(() => {
                this.createLoginFormHtml();
                this.addSubmitEvent();
                this.fadeInForm();
            }, 1000);
        }
    }

    /**
     * Creates the register form and fades it in/out.
     */
    createRegisterForm() {
        if(!this.formExists) {
            setTimeout(() => {
                this.createRegisterFormHtml();
                this.addSubmitEvent();
                this.fadeInForm();
            }, 900);
        } else if (this.formExists) {
            this.fadeOutForm();
            setTimeout(() => {
                this.createRegisterFormHtml();
                this.addSubmitEvent();
                this.fadeInForm();
            }, 1000);
        }
    }

    fadeInForm() {
        setTimeout(() => {
            const fadeInDiv = document.getElementById("fadeInDiv");
                fadeInDiv.style.opacity = "1";
                this.formExists = true;
        }, 300);
    }

    fadeOutForm() {
        const fadeInDiv = document.getElementById("fadeInDiv");
        fadeInDiv.style.opacity = "0";
    }

    scrollDown() {
        const viewheight = window.innerHeight + 1000;
        setTimeout(() => {
            window.scrollBy(0, viewheight);
        }, 300);
    }

    addSubmitEvent() {
        const submitBtn = document.getElementById("submitBtn");
        submitBtn.addEventListener("click", (e) => {
            e.preventDefault();

            let username;
            let email;
            let password;

            if (e.target.dataset.action === "login") {
                const form = document.getElementById("signInForm");
                let formData = new FormData(form);
                email = formData.get("email");
                password = formData.get("password");

                // console.log(username);
                // console.log(email);
                // console.log(password);

                authModel.login(email, password);
            } else if (e.target.dataset.action === "register") {
                const form = document.getElementById("signUpForm");
                let formData = new FormData(form);
                username = formData.get("username");
                email = formData.get("email");
                password = formData.get("password");

                // console.log(username);
                // console.log(email);
                // console.log(password);

                authModel.register(username, email, password);
            }
        });
    }
}