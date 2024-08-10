/**
 * The Positioning Model object includes functions that handle positioning of elements on the page, such as dynamic centering.
 */

const positioningModel = {
    centerElementHorizontally: function centerElementHorizontally(element) {
        const left = (window.innerWidth / 2) - (element.clientWidth / 2);

        element.style.left = `${left}px`;
    },

    addCenterElementHorizontallyEvent: function addCenterElementHorizontallyEvent(element) {
        window.addEventListener("resize", (e) => {
            positioningModel.centerElementHorizontally(element);
        });
    },

    centerElement: function centerElement(element) {
        const left = (window.innerWidth / 2) - (element.clientWidth / 2);
        const top = (window.innerHeight / 2) - (element.clientHeight / 2);

        element.style.left = `${left}px`;
        element.style.top = `${top}px`;
    },

    addCenterElementEvent: function addCenterElementEvent(element) {
        window.addEventListener("resize", (e) => {
            positioningModel.centerElement(element);
        });
    }
}

export default positioningModel;