"use strict";

import mapModel from '../../models/map_model.js';
import supabaseModel from '../../models/supabase_model.js'

export default class MapViewFromDb extends HTMLElement {
    constructor() {
        super();

        this.init = true;
        this.markers = null;
    }

    async connectedCallback() {
        this.render();
    }

    async render() {
        this.innerHTML = `
        <main id="mapOverlay" class="map-overlay">
            <div id="map" class="map" style="height: 100vh; width: 100%;"></div>
        </main>`;

        this.map = mapModel.initMap(62.334591, 16.063240, 5);

        let data = await supabaseModel.fetchData();
        let geometryType;
        let coordinates;
        let longitude;
        let latitude;
        let fontAwesomeIcon;
        let popupContent;
        let siteTitle = "";
        let siteZones = "";
        let siteDescText = "";
        let siteDescTradition;
        let siteDescTerrain = "";
        let siteDescOrientation = "";
        let maxWidth = "500";

        if (this.isMobile()) {
            maxWidth = "320";
        }

        for (let site of data) {
            if (this.init) {
                this.markers = new L.MarkerClusterGroup({
                    disableClusteringAtZoom: 16,
                    spiderfyOnMaxZoom: false,
                    showCoverageOnHover: false,
                });
                this.init = false;
            }

            geometryType = "";
            coordinates = [];
            longitude = null;
            latitude = null;
            fontAwesomeIcon = "";

            geometryType = site.coordinates.features[0].geometry.type;
            coordinates = site.coordinates.features[0].geometry.coordinates;

            switch (geometryType) {
                case "MultiPoint":
                    longitude = coordinates[0][0];
                    latitude = coordinates[0][1];
                    break;
                default:
                    continue;
            };

            fontAwesomeIcon = this.selectIcon(site.site_type);
            popupContent = this.addPopupContent(site, siteTitle, siteZones, siteDescText, siteDescTradition, siteDescTerrain, siteDescOrientation);

            this.markers.addLayer(L.marker([latitude, longitude], {icon: fontAwesomeIcon})
            .bindPopup(`${popupContent}`, {'maxHeight': '500', 'maxWidth': maxWidth}));

        }
        if (this.markers) {
            this.map.addLayer(this.markers);
        }
    }

    selectIcon(siteType) {
        let icon;
        switch(siteType) {
            case "Runristning":
            case "Minnesmärke":
                icon = L.divIcon({
                    html: '<i class="fa-solid fa-monument"></i>',
                    className: 'fa-marker-icon',
                    iconAnchor: [8, 10], // Point of the icon which will correspond to marker's location
                  });

                break;
                case "Röse":
                    icon = L.divIcon({
                        html: '<i class="fa-solid fa-mound"></i>',
                        className: 'fa-marker-icon',
                        iconAnchor: [13.5, 15], // Point of the icon which will correspond to marker's location
                      });
    
                    break;
                case "Bro":
                icon = L.divIcon({
                    html: '<i class="fa-solid fa-bridge-water"></i>',
                    className: 'fa-marker-icon',
                    iconAnchor: [13.5, 15], // Point of the icon which will correspond to marker's location
                    });

                break;
                case "Avrättningsplats":
                case "Offerplats":
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
                case "Kloster":
                case "Kyrka/kapell":
                    icon = L.divIcon({
                        html: '<i class="fa-solid fa-church"></i>',
                        className: 'fa-marker-icon',
                        iconAnchor: [11.5, 15], // Point of the icon which will correspond to marker's location
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

    addPopupContent(site, siteTitle, siteDescText, siteZones, siteDescTradition, siteDescTerrain, siteDescOrientation) {

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
    }

    isMobile() {
        var check = false;
        (function(a){
          if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) 
            check = true;
        })(navigator.userAgent||navigator.vendor||window.opera);

        return check;
      };
}