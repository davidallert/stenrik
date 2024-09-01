"use strict";

import positioningModel from "../models/positioning_model.js";
import elementModel from "../models/v2/element_model.js";

const loading = {
    /**
     * Create a spinner icon.
     */
    createSpinner() {
        let spinner = document.createElement("div");
        let spinnerIcon = '<i class="fa-regular fa-compass fa-spin"></i>';

        spinner.classList.add("spinner");
        spinner.classList.add("hidden");
        spinner.id = "spinner";
        spinner.innerHTML = `${spinnerIcon}`;

        document.body.append(spinner);

        positioningModel.addCenterElementEvent(spinner);
        positioningModel.centerElement(spinner);
    },

    /**
     * Display the spinner icon.
     */
    displaySpinner() {
        const spinner = document.getElementById("spinner");
        elementModel.fadeInElement(spinner);
    },

    /**
     * Remove the spinner icon.
     */
    removeSpinner() {
        const spinner = document.getElementById("spinner");
        elementModel.fadeElement(spinner);
    }
};

export default loading;
