export default class SingleSite extends HTMLElement {
    static get observedAttributes() {
        return ['site'];
    }

    get site() {
        return JSON.parse(this.getAttribute('site'))
    }

    connectedCallback() {
        let siteTitle = this.site.site_type;
        let siteType = this.site.site_type
        let siteZones = "";
        let siteId = this.site.site_id;
        let raaId = this.site.raa_id;
        if (this.site.site_name) {
            siteTitle = this.site.site_name
        }
        if (this.site.municipality && this.site.parish && this.site.province && this.site.county) {
            siteZones = `${this.site.municipality}, ${this.site.parish}, ${this.site.province}, ${this.site.county}`
        }
        this.innerHTML = `
        <div class="single-site-container">
        <h2>${siteTitle}</h2>
        <p>${siteZones}</p>
        <p>Kategori: ${siteType}</p>
        <p>Lämningsnummer: ${siteId}</p>
        <p>RAÄ-nummer: ${raaId}</p>
        </div>
        `
    }
}