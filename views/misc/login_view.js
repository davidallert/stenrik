export default class LoginView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <h1>Registrera ny användare</h1>
            <form>
            <label for="username"></label>
            <input type="text" name="username">
            <label for="email"></label>
            <input type="email" name="email">
            <label for="password"></label>
            <input type="password" name="password">
            <input type="submit">
            </form>
        `
    }
}