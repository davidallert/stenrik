
// Fetch byggnad geodata: https://kulturarvsdata.se/ksamsok/api?method=search&hitsPerPage=10&query=itemType=byggnad+and+geoDataExists=j
// Fetch byggnad GBG fungerar ej, annan datastruktur: https://kulturarvsdata.se/ksamsok/api?method=search&hitsPerPage=10&query=itemType=kulturlämning+and+geoDataExists=j+and+place=göteborg
async function fetchGeoData() {
    const response = await fetch(`https://kulturarvsdata.se/ksamsok/api?method=search&hitsPerPage=10&query=itemType=byggnad+and+geoDataExists=j`,
    {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    });
    const result = await response.json();

    // console.log(result.result.records);
    return result.result.records;
}

function findCoords(records) {
    let coordsarray = []
    for (let record of records) {
        let coordinatesFound = false;
        record = record.record["@graph"];
        for (let data of record) {
            if (data.country && !coordinatesFound) {
                let gmlString = data.coordinates;
                let coords = extractGmlFromCountry(gmlString);
                coordsarray.push(coords);
                coordinatesFound = true;
                // TODO Add support for when contextSuperType is used instead of country, for some reason.
                // Happens when place="" is used in the api call... maybe. Or maybe because the data returned for place=göteborg just happenede to be different? I'm not sure.
            } else if (data.contextSuperType && !coordinatesFound) {
                // console.log(data);
                coordinatesFound = true;
            }
        }
    }
    return coordsarray;
}

// GML = Geography Markup Language.
function extractGmlFromCountry(gmlString) {

    // console.log(gmlString);
    let coords = gmlString.slice(113);
    coords = coords.replace("</gml:coordinates></gml:Point>", "");
    coords = coords.split(",");
    coords = {
        lat: parseFloat(coords[1]),
        lon: parseFloat(coords[0])
    }

    return coords;
}

export { fetchGeoData, findCoords }