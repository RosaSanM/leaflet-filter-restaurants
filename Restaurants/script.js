var map = L.map('mapid').on('load', onMapLoad).setView([41.400, 2.206], 9);
map.locate({setView: true, maxZoom: 17});

var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

map.on('locationerror', errorLocation);
map.locate({setView: true, maxZoom: 16});

//if geolocation fail
function errorLocation() {
	
	alert("No podemos encontrar tu localización.");
}

//en el clusters almaceno todos los markers
var markers = L.markerClusterGroup();
var data_markers = [];


function onMapLoad() {

	console.log("Mapa cargado");
	//api request
	fetch('http://localhost/restaurants/api/apiRestaurants.php')
	.then(response => response.json())
	.then(data => {
		data_markers = data;
		
	});
}

//filter kind of food
$('#kind_food_selector').on('change', function() {
  console.log(this.value);
  render_to_map(data_markers, this.value);
});

//put markers on map
function render_to_map(data_markers,filter){
	//reset markers if necesary
	if(markers){
		markers.clearLayers();
		
	}
		//add markers on map
		for(let index in data_markers) {
			if(data_markers[index].kind_food.includes(filter)){
				
				markers.addLayer(L.marker([data_markers[index].lat,data_markers[index].lng ], {
					title: `${data_markers[index].name}`
				})
				
				.bindPopup(`<h1>${data_markers[index].name}</h1></p> <b>dirección</b>: ${data_markers[index].adress}
					</p><img style="height: 100px" src='${data_markers[index].photo}'/>`)
				.openPopup());
				
				
				map.addLayer(markers);
			}
		}
}