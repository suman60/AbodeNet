const popupText = "Exact location provided after booking";

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=' + ACCESS_TOKEN,
    center: listing.geometry.coordinates,
    zoom: 8
});

// Create popup
const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
    `<h3>${listing.title}</h3><p>${popupText}</p>`
);

// Create marker
const marker = new maplibregl.Marker({ color: 'red' })
    .setLngLat(listing.geometry.coordinates)
    .addTo(map);

// Add event listeners
marker.getElement().addEventListener('mouseenter', () => {
    popup.setLngLat(listing.geometry.coordinates).addTo(map);
});
marker.getElement().addEventListener('mouseleave', () => {
    popup.remove();
});
