export default class AppRouter extends HTMLElement {
    constructor() {
        super();

        this.currentRoute = '';
        this.wildcard = '';

        this.allRoutes = {
            '': {
                view: '<map-view></map-view>',
                name: 'Karta'
            },
            'logga-in': {
                view: '<login-view></login-view>',
                name: 'Logga in'
            },
            'mina-sidor': {
                view: '<my-pages-view></my-pages-view>',
                name: 'Profil'
            },
            'om-oss': {
                view: '<about-view></about-view>',
                name: 'Om oss'
            },
        };
    }

    get routes() {
        return this.allRoutes;
    }

    connectedCallback() {
        window.addEventListener('hashchange', () => {
            this.resolveRoute();
        });
        this.resolveRoute();
    }

    resolveRoute() {
        let cleanHash = location.hash.replace('#', '');

        this.wildcard = "";
        if (cleanHash.indexOf("/") > -1) {
            let splitHash = cleanHash.split("/");

            cleanHash = splitHash[0];
            this.wildcard = splitHash[1];
        }

        this.currentRoute = cleanHash;

        this.render();

    }


    render() {
        let html = '<not-found-view></not-found-view>';

        if (this.routes[this.currentRoute]) {
            html = this.routes[this.currentRoute].view;

            if (this.wildcard) {
                html = html.replace("$wildcard", this.wildcard);
            }
        }
        // console.log(html);
        this.innerHTML = html;
    }
}


