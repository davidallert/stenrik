export default class AboutView extends HTMLElement {
    connectedCallback() {
        this.innerHTML = '<h1>About</h1><p>About this application!</p>';
    }
}
