L.mapbox.accessToken = 'pk.eyJ1IjoieXlhbmdhbyIsImEiOiJjaWp3OW00bHAwNXc5dmdsenRyeHl4OWp0In0.GttZVazpBgy4mt78LoXijA';

var map = L.map('google-container',{
    'attributionControl': false
}).setView([22.26, 114.13], 15);

var mapboxToken = 'pk.eyJ1IjoieXlhbmdhbyIsImEiOiJjaWp3OW00bHAwNXc5dmdsenRyeHl4OWp0In0.GttZVazpBgy4mt78LoXijA';

L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{mapid}/tiles/256/{z}/{x}/{y}?access_token={apikey}', {
    mapid: 'light-v9',
    apikey: mapboxToken
}).addTo(map);

L.marker([22.26, 114.13], {
    icon: L.mapbox.marker.icon({
        'marker-size': 'large',
        'marker-symbol': 'star',
        'marker-color': '#0099d5'
    })
}).addTo(map);