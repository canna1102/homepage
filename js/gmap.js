var myCenter=new google.maps.LatLng(22.3364,114.26543);

function initialize()
{
var mapProp = {
  center:myCenter,
  zoom:14,
  mapTypeId:google.maps.MapTypeId.ROADMAP,
  streetViewControl:false
  };

var map=new google.maps.Map(document.getElementById("google-container"),mapProp);

var marker=new google.maps.Marker({
  position:myCenter,
  });

marker.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);