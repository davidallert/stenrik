"use strict";

const popupModel = {

    /**
     * Creates popup data for each site.
     * @param {Object} site An object containing all site data.
     * @param {string} siteTitle Part of the popup content. Popup header text.
     * @param {string} siteDescText Part of the popup content. Description of the site.
     * @param {string} siteZones Part of the popup content. Municipality, county, etc.
     * @param {string} siteDescTradition Part of the popup content. Tradition or story connected to the site.
     * @param {string} siteDescTerrain Part of the popup content. Terrain in the area surrounding the site.
     * @param {string} siteDescOrientation Part of the popup content. How to find the site.
     * @returns {string} A string with the full HTML content of the popup.
     */
    addPopupContent: function addPopupContent(site, siteTitle, siteDescText, siteZones, siteDescTradition, siteDescTerrain, siteDescOrientation) {

        // Make sure no data is saved from a previous iteration.
        siteTitle = "";
        siteZones = "";
        siteDescText = "";
        siteDescTradition = "";
        siteDescTerrain = "";
        siteDescOrientation = "";

        // Use the unique site name for the title, if there is one.
        // Also add the site_id to the bookmark icon HTML dataset.
        if (site.site_name) {
            siteTitle = `<div class="popup-header"><h1>${site.site_name} (${site.site_type})</h1><i id="bookmarkIcon" data-site="${site.site_id}" class="bookmark-icon fa-regular fa-bookmark"></i></div>`
        } else {
            siteTitle = `<div class="popup-header"><h1>${site.site_type}</h1><i id="bookmarkIcon" data-site="${site.site_id}" class="bookmark-icon fa-regular fa-bookmark"></i></div>`
        }
        if (site.desc_text) {
            siteDescText = `    <h2>Beskrivning</h2>
                                <p>${site.desc_text}</p>`
        }
        if (site.desc_tradition) {
            siteDescTradition = `   <h2>Tradition/berättelse kopplad till platsen</h2>
                                    <p>${site.desc_tradition}</p>`
        }
        if (site.desc_terrain) {
            siteDescTerrain = ` <h2>Terräng i området</h2>
                                <p>${site.desc_terrain}</p>`
        }
        if (site.desc_orientation) {
            siteDescOrientation = ` <h2>Hitta hit</h2>
                                    <p>${site.desc_orientation}</p>`
        }
        if (site.municipality && site.parish && site.province && site.county) {
            siteZones = `<h3>(${site.municipality}, ${site.parish}, ${site.province}, ${site.county})</h3>`
        }

        const popupContent = `<div class="pin">
                                ${siteTitle}
                                ${siteZones}
                                ${siteDescText}
                                ${siteDescTradition}
                                ${siteDescTerrain}
                                ${siteDescOrientation}
                                <p><i>${site.site_id} | ${site.raa_id}</i></p>
                             </div>`
        return popupContent;
    },

    /**
     * Select a font awesome icon based on the site type.
     * The default is: <i class="fa-solid fa-location-dot"></i>
     * @param {string} siteType The site type (category) of the current site.
     * @returns {string} The selected  font awesome icon.
     */
    selectIcon: function selectIcon(siteType) {
        let icon;
        switch(siteType) {
            case "Runristning":
            case "Minnesmärke":
            case "Bildsten":
            case "Bildsten runristad":
            case "Rest sten":
                icon = L.divIcon({
                    html: '<i class="fa-solid fa-monument"></i>',
                    className: 'fa-marker-icon',
                    iconAnchor: [9.5, 12], // Point of the icon which will correspond to marker's location
                  });
                break;
            case "Hällristning":
            case "Hällmålning":
            case "Bildristning":
                icon = L.divIcon({
                    html: '<i class="fa-solid fa-gavel"></i>',
                    className: 'fa-marker-icon',
                    iconAnchor: [13.5, 15], // Point of the icon which will correspond to marker's location
                    });
                break;
            case "Fångstgrop":
                icon = L.divIcon({
                    html: '<i class="fa-solid fa-road-spikes"></i>',
                    className: 'fa-marker-icon',
                    iconAnchor: [12.5, 17], // Point of the icon which will correspond to marker's location
                    });
                break;
            case "Treudd":
                icon = L.divIcon({
                    html: '<i class="fa-solid fa-circle-nodes"></i>',
                    className: 'fa-marker-icon',
                    iconAnchor: [13.5, 15], // Point of the icon which will correspond to marker's location
                    });
                break;
                case "Röse":
                    icon = L.divIcon({
                        html: '<i class="fa-solid fa-cubes-stacked"></i>',
                        className: 'fa-marker-icon',
                        iconAnchor: [12, 17], // Point of the icon which will correspond to marker's location
                      });
                    break;
                case "Bro":
                icon = L.divIcon({
                    html: '<i class="fa-solid fa-bridge-water"></i>',
                    className: 'fa-marker-icon',
                    iconAnchor: [14, 12], // Point of the icon which will correspond to marker's location
                    });

                break;
                case "Avrättningsplats":
                case "Offerplats":
                case "Offerkast":
                    icon = L.divIcon({
                        html: '<i class="fa-solid fa-skull-crossbones"></i>',
                        className: 'fa-marker-icon',
                        iconAnchor: [11.5, 15], // Point of the icon which will correspond to marker's location
                        });
                    break;
                case "Domarring":
                    icon = L.divIcon({
                        html: '<i class="fa-solid fa-spinner"></i>',
                        className: 'fa-marker-icon',
                        iconAnchor: [11.5, 15], // Point of the icon which will correspond to marker's location
                        });
                    break;
                case "Skeppssättning":
                    icon = L.divIcon({
                        html: '<i class="fa-solid fa-anchor"></i>',
                        className: 'fa-marker-icon',
                        iconAnchor: [11.5, 15], // Point of the icon which will correspond to marker's location
                        });
                    break;
                case "Slagfält":
                    icon = L.divIcon({
                        html: '<i class="fa-solid fa-person-falling-burst"></i>',
                        className: 'fa-marker-icon',
                        iconAnchor: [13, 15], // Point of the icon which will correspond to marker's location
                        });
                    break;
                case "Labyrint":
                    icon = L.divIcon({
                        html: '<i class="fa-solid fa-fingerprint"></i>',
                        className: 'fa-marker-icon',
                        iconAnchor: [13, 15], // Point of the icon which will correspond to marker's location
                        });
                    break;
                case "Fyr":
                    icon = L.divIcon({
                        html: '<i class="fa-solid fa-tower-observation"></i>',
                        className: 'fa-marker-icon',
                        iconAnchor: [13, 15], // Point of the icon which will correspond to marker's location
                        });
                    break;
                case "Stadsbefästning":
                case "Stadsvall/stadsmur":
                case "Stridsvärn":
                    icon = L.divIcon({
                        html: '<i class="fa-solid fa-archway"></i>',
                        className: 'fa-marker-icon',
                        iconAnchor: [13, 15], // Point of the icon which will correspond to marker's location
                        });
                    break;
                case "Kloster":
                case "Kyrka/kapell":
                    icon = L.divIcon({
                        html: '<i class="fa-solid fa-church"></i>',
                        className: 'fa-marker-icon',
                        iconAnchor: [15.25, 17], // Point of the icon which will correspond to marker's location
                        });
                    break;
                case "Grav – uppgift om typ saknas":
                case "Grav markerad av sten/block":
                case "Grav övrig":
                case "Gravfält":
                case "Gravklot":
                case "Hällgrav/stengrav":
                case "Hällkista":
                case "Stenkammargrav":
                case "Stenkistgrav":
                case "Blockgrav":
                case "Dös":
                    icon = L.divIcon({
                        html: '<i class="fa-solid fa-cross"></i>',
                        className: 'fa-marker-icon',
                        iconAnchor: [9.75, 15], // Point of the icon which will correspond to marker's location
                        });
                    break;
                case "Borg":
                case "Fästning/skans":
                case "Fornborg":
                case "Slott/herresäte":
                    icon = L.divIcon({
                        html: '<i class="fa-solid fa-chess-rook"></i>',
                        className: 'fa-marker-icon',
                        iconAnchor: [11.25, 15], // Point of the icon which will correspond to marker's location
                        });
                    break;
            default:
                icon = L.divIcon({
                    html: '<i class="fa-solid fa-location-dot"></i>',
                    className: 'fa-marker-icon',
                    iconAnchor: [9.5, 16], // Point of the icon which will correspond to marker's location
                  });
                  break;
        }
        return icon;
    }
}

export default popupModel;