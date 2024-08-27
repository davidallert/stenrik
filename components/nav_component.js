import positioningModel from "../models/positioning_model.js";
import authModel from "../models/auth_model.js";

export default class NavComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div id="navPopup" class="nav-popup">
                <ul class="nav-wrapper">
                    <a href="#stenrik"><li class="nav-item">Karta</li></a>
                    <a href="#logga-in"><li class="nav-item">Logga in</li></a>
                    <a href="#logga-in" id="logout"><li class="nav-item">Logga ut</li></a>
                    <a href="#mina-sidor"><li class="nav-item">Mina sidor</li></a>
                </ul>
            </div>
            <div id="hamburgerMenuBtn" class="icon-button hamburger-menu-btn"><i id="hamburgerMenuBtnIcon" class="hamburger-menu-btn-icon noselect fa-solid fa-bars"></i></div>`

        this.addHamburgerMenuEvent();
        this.addCloseNavPopupOnClickEvent();
        this.addLogoutEvent();
    }

    addLogoutEvent() {
        let logoutBtn = document.getElementById("logout");
        logoutBtn.addEventListener("click", async () => {
            await authModel.logout();
            authModel.accessToken = "";
        })
    }

    /**
     * Adds a click event to the hamburger menu icon.
     * The event animates and changes the icon from a hamburger menu to an X.
     * It also shows/hides the entire menu.
     */
    addHamburgerMenuEvent() {
        const navPopup = document.getElementById("navPopup");
        const hamburgerMenu = document.getElementById('hamburgerMenuBtn');

        // Center the popup menu/nav.
        positioningModel.addCenterElementEvent(navPopup);
        positioningModel.centerElement(navPopup);

        hamburgerMenu.addEventListener("click", (e) => {
            const navPopup = document.getElementById("navPopup");

            // !navPopup.style.visibility is used the first time, before visibility has been set.
            if (navPopup.style.visibility === 'hidden'  || !navPopup.style.visibility) {

                // Nav popup animation from hidden to visible.
                navPopup.style.transition = 'opacity 0.3s';
                navPopup.style.visibility = 'visible';
                navPopup.style.opacity = 1;

                this.switchIcon('fa-solid fa-xmark');

            } else if (navPopup.style.visibility === 'visible') {

                // Nav popup animation from visible to hidden.
                navPopup.style.transition = 'opacity 0.3s';
                navPopup.style.opacity = 0;
                setTimeout(() => {
                    navPopup.style.visibility = 'hidden';
                }, 300);

                this.switchIcon('fa-solid fa-bars');
            }

        })
    }

    /**
     * Switches the hamburger menu icon to an X when it is clicked.
     * @param {String} icon The fontawesome icon name, as a string. I.e. 'fa-solid fa-bars'.
     */
    switchIcon(icon) {
        const hamburgerMenuBtn = document.getElementById("hamburgerMenuBtn");
        let hamburgerMenuBtnIcon = document.getElementById("hamburgerMenuBtnIcon");

        // Fade out the icon. The transition duration is preset through CSS.
        hamburgerMenuBtnIcon.style.opacity = 0;
        setTimeout(() => {
            // Replace the icon after the fade out is completed.
            hamburgerMenuBtn.innerHTML = `<i id="hamburgerMenuBtnIcon" class="hamburger-menu-btn-icon noselect ${icon}"></i>`;

            // The previous icon has been replaced. Get the new icon.
            hamburgerMenuBtnIcon = document.getElementById("hamburgerMenuBtnIcon");
            hamburgerMenuBtnIcon.style.opacity = 0;

            // Use requestAnimationFrame to ensure the opacity transition is applied
            requestAnimationFrame(() => {
                hamburgerMenuBtnIcon.style.opacity = 1;
            })

        }, 300);
    }

    // TODO this code isn't DRY.
    /**
     * Add an event listener to each menu event. It hides the menu when a link is clicked.
     * As the menu element isn't deleted, it only needs to be called once.
     */
    addCloseNavPopupOnClickEvent() {
        let navItems = document.getElementsByClassName('nav-item');
        for (let item of navItems) {
            item.addEventListener("click", (e) => {
                let navPopup = document.getElementById("navPopup");

                // Nav popup animation from visible to hidden.
                navPopup.style.transition = 'opacity 0.3s';
                navPopup.style.opacity = 0;
                setTimeout(() => {
                    navPopup.style.visibility = 'hidden';
                }, 300);

                this.switchIcon('fa-solid fa-bars');
            })
        }
    }

}