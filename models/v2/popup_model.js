"use strict";

const popupModel = {

    addPopupContent: function addPopupContent(site, siteTitle, siteDescText, siteZones, siteDescTradition, siteDescTerrain, siteDescOrientation) {

        siteTitle = "";
        siteZones = "";
        siteDescText = "";
        siteDescTradition = "";
        siteDescTerrain = "";
        siteDescOrientation = "";

        if (site.site_name) {
            siteTitle = `<h1>${site.site_name} (${site.site_type})</h1>`
        } else {
            siteTitle = `<h1>${site.site_type}</h1>`
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

        const popupContent = `<div class="pin">
                                ${siteTitle}
                                ${siteDescText}
                                ${siteDescTradition}
                                ${siteDescTerrain}
                                ${siteDescOrientation}
                             </div>`
        return popupContent;
    },

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
                    html: '<i class="fa-regular fa-circle-dot"></i>',
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