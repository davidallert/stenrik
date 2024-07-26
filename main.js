"use strict";

// Router.
import AppRouter    from "./components/router/router.js";

// Components.
import NavComponent from './components/router/nav_component.js';

// Views.
import AboutView    from "./views/misc/about_view.js";
import NotFoundView from "./views/errors/not_found_view.js";
import MapView      from "./views/map/map_view.js";
import LoginView    from './views/misc/login_view.js';

// Define views.
customElements.define('about-view',     AboutView);
customElements.define('not-found-view', NotFoundView);
customElements.define('map-view',       MapView);
customElements.define('app-router',     AppRouter);
customElements.define('login-view',     LoginView);

// Define components.
customElements.define('nav-component',  NavComponent);
