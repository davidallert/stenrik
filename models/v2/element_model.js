const elementModel = {
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

    fadeInElement: function fadeInElement(element) {
        const computedStyle = window.getComputedStyle(element);
        const visibility = computedStyle.visibility;
        if (visibility === "hidden") {
            element.classList.toggle("hidden");
            element.style.opacity = "1";
        }
    },

    fadeInFadeOut: (element) => {
        element.style.opacity = "0";
        setTimeout(() => {
            element.style.opacity = "1";
        }, 600);
    },
}

export default elementModel;