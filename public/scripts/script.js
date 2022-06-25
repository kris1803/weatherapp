
var mymap = L.map('worldmap',
    {
        center: [48.866667, 2.333333],
        zoom: 4
    }
);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '(c) <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);

let cities = document.getElementsByClassName('city');

var customIcon = L.icon({
    iconUrl: './images/leaf-green.png',
    shadowUrl: './images/leaf-shadow.png',

    iconSize: [38, 95],
    shadowSize: [50, 64],

    iconAnchor: [22, 94],
    shadowAnchor: [4, 62],

    popupAnchor: [-3, -76]
});

for (let i = 0; i < cities.length; i++) {
    let cityName = document.getElementsByClassName('cityName')[i].textContent;
    var lat = cities[i].getAttribute('data-lat');
    var lon = cities[i].getAttribute('data-lon');
    var marker = L.marker([lat, lon], {icon: customIcon} ).addTo(mymap).bindPopup(cityName);
}