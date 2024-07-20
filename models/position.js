const positionModel = {
    centerElementHorizontally: function centerElement(element) {

        const left = (window.innerWidth / 2) - (element.clientWidth / 2)
        element.style.left = `${left}px`;

    }
}

export default positionModel;