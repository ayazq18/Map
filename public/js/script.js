const socket = io()

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('send-location', { latitude, longitude });
    }, (error)=>{
        console.error(error)
    },
    {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    }
)
}

// show map on screen
const map = L.map('map').setView([0,0], 16)

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
}).addTo(map)

const markers = {};
const offsetStep = 0.0001; // Adjust this value for more or less separation of the markers

socket.on('receive-location', (data) => {
    const {id, latitude, longitude } = data;

    const offset = Object.keys(markers).length * offsetStep;
    const adjustedLatitude = latitude + offset;
    const adjustedLongitude = longitude + offset;

    map.setView([adjustedLatitude, adjustedLongitude])

    if(markers[id]){
        markers[id].setLatlng([adjustedLatitude, adjustedLongitude]);
    }else{
        markers[id] = L.marker([adjustedLatitude, adjustedLongitude]).addTo(map)
    }
})


// remove marker when location is off
socket.on('user-disconnected', (id) =>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id]
    }
})