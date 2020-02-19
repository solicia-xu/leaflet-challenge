var url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-02-01&endtime=2020-02-07';
d3.json(url, function(data){
    var earthquakes=L.geojson(data.features, {
        onEachFeature: addPopup,
        pointToLayer: circleMarker
    })
    createMap(earthquakes);
})
function addPopup(feature, layer){
    return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <p> ${Date(feature.properties.time)} </p>`);
}
function markerColor(mag){
    var color="";
    if (mag>5){
        color="#ff3333";
    }
    else if (mag>4){
        color="#ff6633";
    }
    else if (mag>3){
        color="#ff9933";
    }
    else if (mag>2){
        color="#ffcc33";
    }
    else if (mag>1){
        color="#ffff33";
    }
    else {
        color="#ccff33";
    }
}
function circleMarker(feature, latlng){
    var marker={
        radius: feature.properties.mag,
        fillColor: markerColor,
        color: "#000",
        weight:1,
        opacity:1,
        fillOpacity: 0.66
    };
    return L.circleMarker(latlng, marker);
}
function createMap(earthquakes){
    var greyscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: 'pk.eyJ1Ijoid2lyZWQzNjEiLCJhIjoiY2s2ZGlpejUzMWZ1MzNsbjhzZ2xkcmI0aiJ9.k2xgSBHP9QHpiaorTRRwHw' 
    });
    var overLayMaps={
        Earthquakes: earthquakes
    };
    var map=L.map('map',{
        center: [37.09, -95.71],
        zoom: 5,
        layers: [greyscale, earthquakes]
    });
    L.control.layers(greyscale, overLayMaps,{
        collapsed: false
    }).addTo(map)
}