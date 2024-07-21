import positioningModel from "../../models/positioning_model.js";

export default class NavComponent extends HTMLElement {
    constructor() {
        super();

        this.render();
    }

    render() {
        this.innerHTML = `
            <div id="navPopup" class="nav-popup">
                <ul class="nav-wrapper">
                    <li class="nav-item">Karta</li>
                    <li class="nav-item">Kunskap</li>
                    <li class="nav-item">Om oss</li>
                    <li class="nav-item">Logga in</li>
                </ul>
            </div>
            <div id="hamburgerMenuBtn" class="icon-button hamburger-menu-btn"><i id="hamburgerMenuBtnIcon" class="hamburger-menu-btn-icon fa-solid fa-bars"></i></div>`
        this.addHamburgerMenuEvent();

        const navPopup = document.getElementById("navPopup");

        positioningModel.addCenterElementEvent(navPopup);
        positioningModel.centerElement(navPopup);

    }

    addHamburgerMenuEvent() {
        const hamburgerMenu = document.getElementById('hamburgerMenuBtn');
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

    switchIcon(icon) {
        const hamburgerMenuBtn = document.getElementById("hamburgerMenuBtn");
        let hamburgerMenuBtnIcon = document.getElementById("hamburgerMenuBtnIcon");

        // Fade out the icon. The transition duration is preset through CSS.
        hamburgerMenuBtnIcon.style.opacity = 0;
        setTimeout(() => {
            // Replace the icon after the fade out is completed.
            hamburgerMenuBtn.innerHTML = `<i id="hamburgerMenuBtnIcon" class="hamburger-menu-btn-icon ${icon}"></i>`;

            // The previous icon has been replaced. Get the new icon.
            hamburgerMenuBtnIcon = document.getElementById("hamburgerMenuBtnIcon");
            hamburgerMenuBtnIcon.style.opacity = 0;

            // Use requestAnimationFrame to ensure the opacity transition is applied
            requestAnimationFrame(() => {
                hamburgerMenuBtnIcon.style.opacity = 1;
            })

        }, 300);
    }

}