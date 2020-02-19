var url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-02-01&endtime=2020-02-07';
var tectonicUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(url, function (data) {
    createFeature(data.features);
});
function circleColor(magnitude) {
    if (magnitude < 1) {
      return "green"
    }
    else if (magnitude < 2) {
      return "lime"
    }
    else if (magnitude < 3) {
      return "yellow"
    }
    else if (magnitude < 4) {
      return "gold"
    }
    else if (magnitude < 5) {
      return "orange"
    }
    else {
      return "red"
    }
}
function createFeature(earthquake){
    var earthquake=L.geoJSON(earthquake,{
        onEachFeature:function(feature,layer){
            return layer.bindPopup(
                "<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
        "</h3><hr><h3>" + new Date(feature.properties.time) + "</h3>"
            )},
        pointToLayer:function(feature,latlng){
            return L.circleMarker(latlng, {
                fillColor:circleColor(feature.properties.mag),
                color:'white',
                radius: feature.properties.mag*4,
                stroke:true,
                fillOpacity:0.6,
                weight:0.8
            })},
        })
    createMap(earthquake)
}
function createMap(earthquake){
    var greyscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: 'pk.eyJ1Ijoid2lyZWQzNjEiLCJhIjoiY2s2ZGlpejUzMWZ1MzNsbjhzZ2xkcmI0aiJ9.k2xgSBHP9QHpiaorTRRwHw' 
    });
    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: 'pk.eyJ1Ijoid2lyZWQzNjEiLCJhIjoiY2s2ZGlpejUzMWZ1MzNsbjhzZ2xkcmI0aiJ9.k2xgSBHP9QHpiaorTRRwHw' 
    });
    var outdoor = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: 'pk.eyJ1Ijoid2lyZWQzNjEiLCJhIjoiY2s2ZGlpejUzMWZ1MzNsbjhzZ2xkcmI0aiJ9.k2xgSBHP9QHpiaorTRRwHw' 
    });
    var baseMaps={
      'greyscale':greyscale,
      'satellite':satellite,
      'outdoor':outdoor
    };
    var tectonic=new L.LayerGroup();
    d3.json(tectonicUrl,function(plateData){
      L.geoJson(plateData, {
        color: 'orange'
      }).addTo(tectonic);
    })
    var overLay={
        'Earthquake':earthquake,
        'Tectonic Plates': tectonic
    };
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [greyscale, earthquake, tectonic]
    });
    L.control.layers(baseMaps,overLay,{
        collapsed:false
    }).addTo(myMap);
  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    magnitudes = [0, 1, 2, 3, 4, 5];
    for (var i = 0; i < magnitudes.length; i++) {
      div.innerHTML += '<i style="background:' + circleColor(magnitudes[i]) + '"></i> ' + magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }
    return div;
  
  // loop through our density intervals and generate a label with a colored square for each interval
    // magnitudes.forEach(function (mag, i) {
    //   div.innerHTML +=('<i style="background-color: ' + circleColor(mag[i]) + '"></i>' +
    //   mag[i] + mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
    // });
    // return div
  };
  legend.addTo(myMap);
}


