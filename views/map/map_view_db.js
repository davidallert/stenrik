"use strict";

export default class MapViewDb extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.render();
    }

    async render() {
        this.innerHTML = `<map-component></map-component>`;
    }
}