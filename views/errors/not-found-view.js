export default class NotFoundView extends HTMLElement {
    connectedCallback() {
        this.innerHTML = '<h1>404 Not Found</h1><p>Page not found!</p>';
    }
}