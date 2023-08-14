'use strict';
document.addEventListener('DOMContentLoaded', function () {
  const map = document.getElementById('map');
  const locations = JSON.parse(map.dataset.locations);
  let location=[0,55]
  const mapLocation = L.map('map',{
    maxBounds:location,
    maxBoundsViscosity:1.0,
  })
  mapLocation.on('click', (e) => {
    mapLocation.flyTo([locations[0].coordinates[1],locations[0].coordinates[0]],4)
  });
  navigator.geolocation.getCurrentPosition(position=>{
    location=[position.coords.latitude,position.coords.longitude]
    mapLocation.setView(
    [position.coords.latitude, position.coords.longitude],
    5
  );
   L.popup().setLatLng([position.coords.latitude, position.coords.longitude]).setContent("<h2>click on map to see tour location</h2>").openOn(mapLocation)
  },()=>{
    location=[45,155]
    mapLocation.setView(
        [45, 155],
        5
      )
      L.popup().setLatLng([45,155]).setContent("<h2>click on map to see tour location</h2>").openOn(mapLocation)
  })
  
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(mapLocation);
  locations.forEach((point, index) => {
    const marker = L.marker(
      [point.coordinates[1], point.coordinates[0]],
      {}
    ).addTo(mapLocation);
    marker.bindPopup(`<h2>${point.description}</h2>`);
  });

});
