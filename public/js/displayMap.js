

maptilersdk.config.apiKey = window.maptilerApiKey;
const campground =  window.camp ;

const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.DATAVIZ.DARK,
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

new maptilersdk.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map)
