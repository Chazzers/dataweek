var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

// Map and projection
var projection = d3.geoMercator()
    .center([6, 60])                // GPS of location to zoom on
    .scale(6000)                       // This is like the zoom
    .translate([ width/2, height/2 ])

// Load external data and boot

d3.json("../data/OVERNACHTINGSBELEID.json").then(function(data){
	projection.fitSize([width,height],data)
    // Draw the map
    svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
          .attr("fill", "white")
          .attr("d", d3.geoPath()
              .projection(projection)
          )
        .style("stroke", "white")
		.style("stroke-width", 0.25)
		.style("opacity", 0.14);
})

d3.csv("../data/listings.csv").then(function(data) {
	svg.append("g").attr("class", "airbnb").selectAll("circle")
	.data(data)
	.enter()
	.append("circle")
    .attr("class", "active")
	.attr("cx", function(d) {
		return projection([d.longitude, d.latitude])[0];
	})
	.attr("cy", function(d) {
		return projection([d.longitude, d.latitude])[1];
	})
	.attr("r", function(d) {
		return 0.8;
	})
		.style("fill", "#ff5a5f")
		.style("opacity", 0.55)
})

d3.json("../data/hotelsgeo.json").then(function(data) {
	setTimeout(()=>{
		data.features.forEach(item => {
			item.geometry.lon = item.geometry.coordinates[0];
			item.geometry.lat = item.geometry.coordinates[1];
		})

		svg.append("g").attr("class", "hotel").selectAll("circle")
		.data(data.features)
		.enter()
		.append("circle")
        .attr("class", "active")
		.attr("cx", function(d) {
			return projection([d.geometry.lon, d.geometry.lat])[0];
		})
		.attr("cy", function(d) {
			return projection([d.geometry.lon, d.geometry.lat])[1];
		})
		.attr("r", function(d) {
			return 1.2;
		})
			.style("fill", "#ffffff")
			// .style("opacity", 0.85)
	}, 1000)
})

function addVisibilityHotels() {
    const dots = document.querySelectorAll(".hotel circle")
    dots.forEach(dot => dot.classList.toggle("active"))
}
document.querySelector("#hotel").addEventListener("click", addVisibilityHotels)
function addVisibilityAirbnb() {
    const dots = document.querySelectorAll(".airbnb circle")
    dots.forEach(dot => dot.classList.toggle("active"))
}
document.querySelector("#airbnb").addEventListener("click", addVisibilityAirbnb)
