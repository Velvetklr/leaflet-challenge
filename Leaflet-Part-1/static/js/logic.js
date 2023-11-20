//Get Data
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
// 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson'
d3.json(url).then(response => {
    createFeatures(response.features)
});

getRadius = (magnitude) => {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
}

getColor = (depth) => {
    if(depth > 90) {
        return "#ea2c2c"
    } else if (depth > 70) {
        return "#ea822c"
    } else if (depth > 50) {
        return "#ee9c00"
    } else if (depth > 30) {
        return "#eecc00"
    } else if (depth) {
        return "#d4ee00"
    } else {
        return "#98ee00"
    }
    };

styleInfo = (feature) => {
    return{
        opacity: 1, 
        fillOpacity: 1,
        fillColor: getColor(feature.geometry.coordinates[2]) ,
        color: "#000000",
        radius: getRadius(feature.geometry.mag),
        stroke: true,
        weight: 0.6
    }
};

createFeatures = (earthquakeData) => {
    onEachFeature = (feature, layer) => {
        layer.bindPopup(`
        Magnitude: ${feature.properties.mag}<br>
        Depth; ${feature.geometry.coordinates[2]} <br>
        Location: ${feature.properties.place}
        `);
    }

    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng)
        },
        style: styleInfo,
        onEachFeature: onEachFeature
    });
    createMap(earthquakes)
}

createMap = (earthquakes) => {
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });

    let overlayMaps = {
        "Earthquakes": earthquakes
    };

    let map = L.map("map", {
        center: [14.4974, 14.4524],
        zoom: 3,
        layers: [topo, earthquakes]
      });

    
    let legend = L.control({position: "bottomright"});
        legend.onAdd = (map) => {

        let div = L.DomUtil.create('div', 'info legend');
        let grade = [-10, 10, 30, 50, 70, 90];
        let colors = ["#98ee00","#d4ee00", "#eecc00", "#ee9c00", "#ea822c", "#ea2c2c"];

        for (g in grade) {
            div.innerHTML += 
            `<i style="background: ${colors[g]}"></i> ${grade[g]}+ <br>`
        }
        return div;
    }
    legend.addTo(map)
    
}











