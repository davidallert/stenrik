/**
 * The Element Model object includes functions that handle element manipulation.
 */
const elementModel = {
    /**
     * Fade an element.
     * The function assumes that the element's visibility is set to visible and that it has a CSS transition-duration property set to 0.3s.
     * @param {HTMLElement} element The element that should fade out.
     */
    fadeElement: function fadeElement(element) {
        const computedStyle = window.getComputedStyle(element);
        const visibility = computedStyle.visibility;
        if (visibility === "visible") {
            element.style.opacity = "0";
            setTimeout(() => {
                element.classList.toggle("hidden");
            }, 300);
        }
    },

    /**
     * Fade in an element.
     * The function assumes that the element's visibility is set to hidden and that it has a CSS transition-duration property set to 0.3s.
     * @param {HTMLElement} element The element that should fade in.
     */
    fadeInElement: function fadeInElement(element) {
        const computedStyle = window.getComputedStyle(element);
        const visibility = computedStyle.visibility;
        if (visibility === "hidden") {
            element.classList.toggle("hidden");
            element.style.opacity = "1";
        }
    },

    /**
     * Fade an element out and then in, to create a simple blinking effect.
     * @param {HTMLElement} element The element that should fade out, then in.
     */
    fadeInFadeOut: (element) => {
        element.style.opacity = "0";
        setTimeout(() => {
            element.style.opacity = "1";
        }, 600);
    },
}

export default elementModel;