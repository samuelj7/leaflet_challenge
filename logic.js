console.log("working");
// Store our API endpoint as queryUrl.
 var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
console.log("working too");

// Create the base layers.
var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create a baseMaps object.
var baseMaps = {
  "Street Map": street,
  "Topographic Map": topo
};

let earthquakeLayer = new L.layerGroup();

// Create an overlay object to hold our overlay.
var overlayMaps = {
  Earthquakes: earthquakeLayer
};

// Create our map, giving it the streetmap and earthquakes layers to display on load.
 var myMap = L.map("map", {
   center: [
     37.09, -95.71
   ],
   zoom: 5,
   layers: [street, earthquakeLayer]
 });

// Create a layer control.
// Pass it our baseMaps and overlayMaps.
// Add the layer control to the map.
 L.control.layers(baseMaps, overlayMaps, {
   collapsed: false
 }).addTo(myMap);


 





// Perform a GET request to the query URL/
 d3.json(queryUrl).then(function (data) {
   //function createFeatures(earthquakeData) {

    function styleInfo(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: circleColor(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: circleRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
      };
    }

  




  
  //Function to determine circle size
  function circleColor(depth) {
    var color="#FFEDA0";
    switch(true) {
        case (depth < 10):
            color="#FFEDA0";
            break;
        case (depth < 30):
            color="#FEB24C";
            break;
        case (depth < 50):
            color="#FD8D3C";
            break;
        case (depth < 70):
            color="#E31A1C";
            break;
        case (depth < 90):
            color="#BD0026";
            break;
        case (depth >= 90):
            color="#800026";
            break;
    }
    return color;
  }
  
  
  //Function to determine circle size
  function circleRadius(mag) {
    if (mag===0) {
      return 1;
    }
    return mag * 4;
  }


  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    // We set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // We create a popup for each marker to display the magnitude and location of
    // the earthquake after the marker has been created and styled
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "Magnitude: "
          + feature.properties.mag
          + "<br>Depth: "
          + feature.geometry.coordinates[2]
          + "<br>Location: "
          + feature.properties.place
      );
    }
   
  
    // We add the data to the earthquake layer instead of directly to the map.
  }).addTo(earthquakeLayer);

  earthquakeLayer.addTo(myMap);

})

// let legend = L.control({ 
//   position: "bottom right"
// });
// legend.onAdd = function(){
//   let div = L.DomUtil.create("div", "info legend");
//   const Magnitudes = []
//   const Colors = []
// }

/*Legend specific*/
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>Legend</h4>";
  div.innerHTML += '<i style="background: #FFEDA0"></i><span>0-10</span><br>';
  div.innerHTML += '<i style="background: #FEB24C"></i><span>10-30</span><br>';
  div.innerHTML += '<i style="background: #FD8D3C"></i><span>30-50</span><br>';
  div.innerHTML += '<i style="background: #E8E6E0"></i><span>50-70</span><br>';
  div.innerHTML += '<i style="background: #BD0026"></i><span>70-90</span><br>';
  div.innerHTML += '<i style="background: #800026"></i><span>90+</span><br>';
  div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Grænse</span><br>';
  
  

  return div;
};

legend.addTo(myMap);

