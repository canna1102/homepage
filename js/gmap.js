var map = L.map('google-container',{
    'attributionControl': false
}).setView([22.26, 114.13], 15);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

L.marker([22.26, 114.13]).addTo(map);