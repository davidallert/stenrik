import AppRouter    from "./components/router/router.js";

import AboutView    from "./views/misc/about-view.js";
import NotFoundView from "./views/errors/not-found-view.js";
import MapView      from "./views/map/map-view.js";

customElements.define('about-view',     AboutView);
customElements.define('not-found-view', NotFoundView);
customElements.define('map-view',       MapView);
customElements.define('app-router',     AppRouter);
