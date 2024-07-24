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

    createAnimation(backgroundColor) {
        this.moveArrow(backgroundColor);
        this.scrollDown();
        this.createFormBg(backgroundColor);

    }

    moveArrow(backgroundColor) {
        const animationArea = document.getElementById("animationArea");
        const arrowDown = document.getElementById("arrowDown");

        animationArea.style.height = "100vh";
        arrowDown.style.transitionDuration = "5s";
        arrowDown.style.transform = "translateY(100vh)";
        arrowDown.style.borderTopColor = `${backgroundColor}`
    }

    createFormBg(backgroundColor) {
        const arrowDown = document.getElementById("arrowDown");
        const formWrapper = document.getElementById("signInUpFormWrapper");

        setTimeout(() => {
            formWrapper.classList.add("animate-form-bg");
            formWrapper.style.backgroundColor = `${backgroundColor}`;
            arrowDown.style.opacity = "0";
            arrowDown.style.visibility = "hidden";
        }, 300);
    }

    createLoginForm() {
        if(!this.formExists) {
            setTimeout(() => {
                this.createLoginFormHtml();
                this.fadeInForm();
            }, 900);
        } else if (this.formExists) {
            this.fadeOutForm();
            setTimeout(() => {
                this.createLoginFormHtml();
                this.fadeInForm();
            }, 1000);
        }
    }

    createRegisterForm() {
        if(!this.formExists) {
            setTimeout(() => {
                this.createRegisterFormHtml();
                this.fadeInForm();
            }, 900);
        } else if (this.formExists) {
            this.fadeOutForm();
            setTimeout(() => {
                this.createRegisterFormHtml();
                this.fadeInForm();
            }, 1000);
        }
    }

    createRegisterFormHtml() {
        const formWrapper = document.getElementById("signInUpFormWrapper");
        formWrapper.innerHTML = `
        <div id="fadeInDiv" class="fade-in">
            <h2 id="formHeading">Registrera användare</h2>
            <form id="signInUpForm" class="sign-in-up-form">
                <label for="username">Användarnamn</label>
                <input type="text" name="username">
                <label for="email">E-post</label>
                <input type="email" name="email">
                <label for="password">Lösenord</label>
                <input type="password" name="password">
                <input type="submit">
            </form>
        </div>
    `
    }

    createLoginFormHtml() {
        const formWrapper = document.getElementById("signInUpFormWrapper");
        formWrapper.innerHTML = `
        <div id="fadeInDiv" class="fade-in">
            <h2 id="formHeading">Logga in</h2>
            <form id="signInUpForm" class="sign-in-up-form">
                <label for="username">Användarnamn</label>
                <input type="text" name="username">
                <label for="password">Lösenord</label>
                <input type="password" name="password">
                <input type="submit">
            </form>
        </div>
        `
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
}