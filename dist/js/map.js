$(document).ready(function() {
    var map = L.map('mapid').setView([-12.839671, -50.401721], 5);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Repeater data: DVBrazil Team & BrandMeister | Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibGFtYXJhbCIsImEiOiJjamwxMGJoeDUxYW5jM3BvNnZ3dXZ5cDFvIn0.-UGQeZHNPy0EW5eL1ivuWw'
    }).addTo(map);
    var lat, lng;     
    var thousands = [];
    
//    for (var i=0; i<100; i++){
//          lat = Math.floor(Math.random()*88) + 1;
//          lat *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
//            
//          lng = Math.floor(Math.random()*88) + 1;
//          lng *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
//            
//          marker = new L.marker([lat, lng]);
//          marker.addTo(map);
//      }
    
    
    
    $.getJSON( "https://api.brandmeister.network/v1.0/repeater/?action=LIST", function( data ) {
        $.each( data, function( key, val ) {
            if ((val['repeaterid'] >= 724000) && (val['repeaterid'] <= 724999) && (val['lat'] != null) && (val['lng'] != null) && (val['lat'] != 0) && (val['lng'] != 0)) {
//                console.log(val['callsign'], val['lat'], val['lng']);
                L.marker(L.latLng(parseFloat(val['lat']), parseFloat(val['lng']))).bindPopup(val['callsign']).addTo(map);
//                console.log(val);
            }
        });
    });
});

$(document).ajaxStart(function() {
    $(".loading").show();
});

$(document).ajaxComplete(function() {
    $(".loading").hide();
});