"use strict";

// Fetch byggnad geodata: https://kulturarvsdata.se/ksamsok/api?method=search&hitsPerPage=10&query=itemType=byggnad+and+geoDataExists=j
// Fetch byggnad GBG fungerar ej, annan datastruktur: https://kulturarvsdata.se/ksamsok/api?method=search&hitsPerPage=10&query=itemType=kulturlämning+and+geoDataExists=j+and+place=göteborg
// Fetch kulturlämning med bild och koordinater: https://kulturarvsdata.se/ksamsok/api?method=search&hitsPerPage=1&query=itemType=kulturl%C3%A4mning+and+geoDataExists=j+and+thumbnailExists=j
// Fetch örestens fästning: https://kulturarvsdata.se/ksamsok/api?method=search&hitsPerPage=22&query=text=%C3%B6resten+and+itemType=kulturl%C3%A4mning+and+geoDataExists=j
// Fetch subject https://kulturarvsdata.se/ksamsok/api?method=search&hitsPerPage=10&query=itemType=kulturl%C3%A4mning+and+geoDataExists=j+and+subject=Milj%C3%B6

// Example bounding box, doesn't work. https://kulturarvsdata.se/ksamsok/api?method=search&hitsPerPage=10&query=itemType=kulturl%C3%A4mning+and+geoDataExists=j+and+subject=Milj%C3%B6+and+boundingBox=/WGS84%2211.462860107421877%2057.348755660256494%2013.860626220703127%2057.348755660256494%22

// Excludes duplicates from Statens Historiska Museer: %20AND%20serviceOrganization%3D%22RAÄ%22%20AND%20serviceName%3Dkmr_lamningar
// Excludes sites that aren't visible above ground: %20AND%20itemDescription%3D%22synlig%20ovan%20mark%22

// TODO Make the file into a proper model. Export default class ApiModel... etc. See kmom10 for reference.

const apiModel = {

    fetchGeoData: async function fetchGeoData(boundingBox) {

    // console.log(boundingBox);

    const response = await fetch(`https://kulturarvsdata.se/ksamsok/api?method=search&hitsPerPage=100&query=itemType=kulturl%C3%A4mning+and+geoDataExists=j+and+subject=Milj%C3%B6%20AND%20serviceOrganization%3D%22RAÄ%22%20AND%20serviceName%3Dkmr_lamningar%20AND%20itemDescription%3D%22synlig%20ovan%20mark%22+and+boundingBox=/WGS84"${boundingBox.west} ${boundingBox.south} ${boundingBox.east} ${boundingBox.north}"`,
    {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    });

    const result = await response.json();
    // console.log(result);

    // console.log(result.result.records);
    return result.result.records;
},

    createPins: function createPins(records) {
        let pins = [];
        let building = false;
        let site = true;
        const regex = /^L\d{4}:\d{4}$/;

        // console.log(records);
        for (let record of records) {
            console.log('----------------------- NEW ITEM ----------------------------');

            let pinData = {};

            // Coordinates can exist in a couple different data locations.
            // The flag makes sure one set of coordinates is only found once.
            let coordinatesFound = false;

            // Clean up the code by removing unnecessary syntax.
            record = record.record["@graph"];
            // console.log(record);

            // TODO ?
            // Check if the collection type is "Arkeologiskt object".
            // Such objects are generally of no interest.
            // if (!record[7].collection === "Arkeologiskt object") {}

                for (let data of record) { // Each record contains an array of data.
                    // ................................................................................
                    // Works for: https://kulturarvsdata.se/ksamsok/api?method=search&hitsPerPage=10&query=itemType=byggnad+and+geoDataExists=j
                    // data.spec contains "byggnadsminne" = remove?

                    if (building) {
                        if (data.name) {
                            // console.log(data.name);
                            pinData.name = data.name;
                        }
                        if (data.country && !coordinatesFound) { // data.country contains coordinates.
                            // console.log(data.coordinates);
                            let gmlString = data.coordinates; // The coordinates are contained within a GML-tag/string.
                            let coords = this.extractGmlFromCountry(gmlString); // Perform some string magic and return the coords.
                            // console.log(coords);
                            pinData.coords = coords;
                            pinData.period = data.fromPeriodName;
                            pins.push(pinData);

                            // coordsarray.push(coords); // Add the coords to an array. The array will be used to display the pins.
                            coordinatesFound = true; // Set the aforementioned flag to true.
                        }
                    } else if (site) {
                        // console.log(data.desc);
                    // Works for https://kulturarvsdata.se/ksamsok/api?method=search&hitsPerPage=50&query=itemType=kulturl%C3%A4mning+and+geoDataExists=j+and+subject=Milj%C3%B6+and+boundingBox=/WGS84"${boundingBox.west} ${boundingBox.south} ${boundingBox.east} ${boundingBox.north}"
                    // ................................................................................
                        if (data.name) {
                            pinData.name = data.name["@value"];
                        }

                        if (data.number)  {
                            if (regex.test(data.number["@value"])) {
                                pinData.id = data.number["@value"]
                            }
                        }

                        if (data.desc) {
                            let desc = data.desc["@value"];
                            // Check whether the location is visible above ground or not.
                            // Sites that aren't visible will not be added to the map.
                            if (desc === "Ej synlig ovan mark") {
                                pinData.visibleAboveGround = false;
                            } else if (desc === "Synlig ovan mark") {
                                pinData.visibleAboveGround = true;
                            } else if (desc === "Ej skadad" || desc === "Åverkan" || desc === "Förstörd") {
                                pinData.condition = desc;
                            } else if (desc === "Ej undersökt" || desc === "Helt undersökt" || desc === "Okänd" || desc === "Delundersökt") {
                            } else {

                                if (desc.includes("Beskrivning saknas.")) {
                                    desc = desc.replace("Beskrivning saknas.", "")
                                }
                                if (desc.includes("Beskrivningen är inte kvalitetssäkrad. Information kan saknas, vara felaktig eller inaktuell. Se även Inventeringsbok.")) {
                                    desc = desc.replace("Beskrivningen är inte kvalitetssäkrad. Information kan saknas, vara felaktig eller inaktuell. Se även Inventeringsbok.", "");
                                }
                                if (desc.includes("För beskrivning av lämningen se Inventeringsbok under Dokument och bilder.")) {
                                    desc = desc.replace("För beskrivning av lämningen se Inventeringsbok under Dokument och bilder.", "");
                                }
                                if (desc.includes("Överförd.")) {
                                    desc = desc.replace("Överförd.", "");
                                }
                                pinData.description = pinData.description || '';
                                pinData.description += desc + " ";
                            }
                        }

                        if (data.contextSuperType && !coordinatesFound) {
                            let coords = this.extractCoordsFromContextSuperType(data.coordinates);
                            pinData.coords = coords;
                            coordinatesFound = true;
                        }
                    }
                }
            pins.push(pinData);
        }
            console.log(pins);
            return pins;
    },

    // GML = Geography Markup Language.
    extractGmlFromCountry: function extractGmlFromCountry(gmlString) {

        // console.log(gmlString);
        let coords = gmlString.slice(113);
        coords = coords.replace("</gml:coordinates></gml:Point>", "");
        coords = coords.split(",");
        coords = {
            lat: parseFloat(coords[1]),
            lon: parseFloat(coords[0])
        }

        return coords;
    },

    extractCoordsFromContextSuperType: function extractCoordsFromContextSuperType(gmlString) {

        // console.log(gmlString);

        if (gmlString.slice(5, 15) === "MultiPoint") {
            let coords = gmlString.slice(146);
            coords = coords.replace("</gml:coordinates></gml:Point></gml:pointMember></gml:MultiPoint>", "");
            coords = coords.split(",");
            coords = {
                type: "MultiPoint",
                lat: parseFloat(coords[1]),
                lon: parseFloat(coords[0])
            }

            return coords;
        } else if (gmlString.slice(5, 17) === "MultiPolygon") {
            // console.log(gmlString);

            // console.log(gmlString);
            // let coordinates = gmlString.slice(189);
            let coordinates = gmlString.replace('<gml:MultiPolygon xmlns:gml="http://www.opengis.net/gml" srsName="EPSG:4326"><gml:polygonMember><gml:Polygon><gml:outerBoundaryIs><gml:LinearRing><gml:coordinates cs="," decimal="." ts=" ">', "")
            coordinates = coordinates.replace("</gml:coordinates></gml:LinearRing></gml:outerBoundaryIs></gml:Polygon></gml:polygonMember></gml:MultiPolygon>", "");
            coordinates = coordinates.split(" ");
            let coordsArray = []
            for (let coords of coordinates) {
                coords = coords.split(",");
                let lat = parseFloat(coords[1]);
                let lon = parseFloat(coords[0]);

                // Avoid adding coords if they are NaN.
                if (!isNaN(lat) && !isNaN(lon)) {
                    coords = [lat, lon];
                    coordsArray.push(coords);
                }

            }


            let coords = {
                type: "MultiPolygon",
                coordsArray: coordsArray
            }

            // console.log(coords);

            return coords;
        }
},

}
export default apiModel;