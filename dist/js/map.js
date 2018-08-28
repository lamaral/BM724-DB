$(document).ready(function() {
    var mymap = L.map('mapid').setView([-12.839671, -50.401721], 5);
                L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Repeater data: DVBrazil Team & BrandMeister | Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibGFtYXJhbCIsImEiOiJjamwxMGJoeDUxYW5jM3BvNnZ3dXZ5cDFvIn0.-UGQeZHNPy0EW5eL1ivuWw'
    }).addTo(mymap);
    console.log("Teste");
    $.getJSON( "https://api.brandmeister.network/v1.0/repeater/?action=LIST", function( data ) {
        now = new Date();
        console.log("Dentro");
        $.each( data, function( key, val ) {
            if ((val['repeaterid'] >= 724000) && (val['repeaterid'] <= 724999) && (val != null)) {
                console.log(L.latLng(parseFloat(val['lat']), parseFloat(val['lng'])))
                L.marker(L.latLng(parseFloat(val['lat']), parseFloat(val['lng']))).bindPopup(val['callsign']).addTo(mymap);
                console.log(val);
            }
        });
    });
});