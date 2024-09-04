/**
 * The Positioning Model object includes functions that handle positioning of elements on the page, such as dynamic centering.
 */

const positioningModel = {
    /**
     * Center an element horizontally.
     * @param {HTMLElement} element An HTML element.
     */
    centerElementHorizontally: function centerElementHorizontally(element) {
        const left = (window.innerWidth / 2) - (element.offsetWidth / 2);

        element.style.left = `${left}px`;
    },

    /**
     * Continuously center an element horizontally.
     * @param {HTMLElement} element An HTML element.
     */
    addCenterElementHorizontallyEvent: function addCenterElementHorizontallyEvent(element) {
        // Initially center the element after ensuring the DOM is fully loaded.
        window.addEventListener("load", () => {
            requestAnimationFrame(() => {
                positioningModel.centerElementHorizontally(element);
            });
        });

        // Then add the resize event listener to continuously center it.
        window.addEventListener("resize", (e) => {
            positioningModel.centerElementHorizontally(element);
        });
    },

    /**
     * Center an element.
     * @param {HTMLElement} element An HTML element.
     */
    centerElement: function centerElement(element) {
        const left = (window.innerWidth / 2) - (element.offsetWidth / 2);
        const top = (window.innerHeight / 2) - (element.offsetHeight / 2);

        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
    },

    /**
     * Continuously center an element.
     * @param {HTMLElement} element An HTML element.
     */
    addCenterElementEvent: function addCenterElementEvent(element) {
        // Initially center the element after ensuring the DOM is fully loaded.
        window.addEventListener("load", () => {
            requestAnimationFrame(() => {
                positioningModel.centerElement(element);
            });
        });
        
        // Then add the resize event listener to continuously center it.
        window.addEventListener("resize", () => {
            positioningModel.centerElement(element);
        });
    }
}

export default positioningModel;