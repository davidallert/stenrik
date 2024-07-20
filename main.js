import AppRouter    from "./components/router/router.js";

import AboutView    from "./views/misc/about_view.js";
import NotFoundView from "./views/errors/not_found_view.js";
import MapView      from "./views/map/map_view.js";

customElements.define('about-view',     AboutView);
customElements.define('not-found-view', NotFoundView);
customElements.define('map-view',       MapView);
customElements.define('app-router',     AppRouter);
