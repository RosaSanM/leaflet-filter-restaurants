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
  let kind = this.value;
  render_to_map(data_markers, this.value);
  kind_food (kind);
});


function kind_food (kind) {
	let exist = document.getElementById('kind_food');
	if(exist){
		let father = exist.parentNode;
		father.removeChild(exist);
		
	}
		//create new select options
		let selectRestaurant = document.getElementById('restaurants');
		(document.getElementById('hidden').classList.remove('hidden'));
		let element = document.createElement('select');
		

		element.id = ('kind_food');
		element.name = ('select2');
		
		selectRestaurant.appendChild(element);
		//default option
		let optionRestaurant = document.createElement('option');
		optionRestaurant.value = (`Elige restaurante`);
		optionRestaurant.text = (`Elige restaurante`);
		element.appendChild(optionRestaurant);
		
		//create options from db	
		for(let i in data_markers) {
			if(data_markers[i].kind_food.includes(kind)){
				let optionRestaurant = document.createElement('option');
				optionRestaurant.value = (`${data_markers[i].name}`);
				optionRestaurant.text = (`${data_markers[i].name}`);
				element.appendChild(optionRestaurant);
			}
		}
		$('#kind_food').on('change', function() {
			console.log(this.value);
			renderToMapSelectRestaurant (this.value);
			
		});
		
}	

//put marker on map
function renderToMapSelectRestaurant (restaurant) {
	
	if(markers){
		markers.clearLayers();
	}
	//add marker on map
	for(let i in data_markers){
		if(data_markers[i].name.includes(restaurant)){
			markers.addLayer(L.marker([data_markers[i].lat,data_markers[i].lng ], {
				title: `${data_markers[i].name}`
			})
		
				.bindPopup(`<h1>${data_markers[i].name}</h1></p> <b>dirección</b>: ${data_markers[i].adress}
					</p><img style="height: 100px" src='${data_markers[i].photo}'/>`)
				.openPopup());
				
				
				map.addLayer(markers);
			}
	}
	
}

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


