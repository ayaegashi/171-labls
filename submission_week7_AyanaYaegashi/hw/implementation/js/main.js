
// margin conventions & svg drawing area - since we only have one chart, it's ok to have these stored as global variables
// ultimately, we will create dashboards with multiple graphs where having the margin conventions live in the global
// variable space is no longer a feasible strategy.

let margin = {top: 40, right: 40, bottom: 60, left: 60};

let width = 600 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

let svg = d3.select("#chart-area").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let infoBox = d3.select("#info-box").append("div")

// Date parser
let formatDate = d3.timeFormat("%Y");
let parseDate = d3.timeParse("%Y");


// Initialize data
loadData();

// FIFA world cup
let data;

// Dataset in use
let currData;


// Load CSV file
function loadData() {
	d3.csv("data/fifa-world-cup.csv", row => {
		row.YEAR = parseDate(row.YEAR);
		row.TEAMS = +row.TEAMS;
		row.MATCHES = +row.MATCHES;
		row.GOALS = +row.GOALS;
		row.AVERAGE_GOALS = +row.AVERAGE_GOALS;
		row.AVERAGE_ATTENDANCE = +row.AVERAGE_ATTENDANCE;
		return row
	}).then(csv => {

		// Store csv data in global variable
		data = csv;
		currData = csv;

		// Draw the visualization for the first time
		updateVisualization();
	});
}

// Scales
let x = d3.scalePoint()
	.rangeRound([0, width]);

let y = d3.scaleLinear()
	.range([height, 0]);

// Axes
let xAxis = d3.axisBottom()
	.scale(x);

let yAxis = d3.axisLeft()
	.scale(y);

yHeight = height - margin.bottom;
svg.append("g")
	.attr("class", "axis x-axis")
	.attr("transform", "translate(0," + (height) + ")")
	.call(xAxis);

svg.append("g")
	.attr("class", "axis y-axis")
	.attr("transform", "translate(0, 0)")
	.call(yAxis);

// Slider
var slider = document.getElementById('slider');

noUiSlider.create(slider, {
	start: [1930, 2014],
	connect: true,
	range: {
		'min': 1930,
		'max': 2014
	},
	tooltips: true,
	step: 4,
	behaviour: 'tap-drag',
	format: {
		from: function(value) {
			return parseInt(value);
		},
		to: function(value) {
			return parseInt(value);
		}
	}
});

slider.noUiSlider.on("slide", function(values, handle) {
	// Update current dataset
	currData = data.filter(function(d) {
		return (parseDate(values[0]) <= d.YEAR && d.YEAR <= parseDate(values[1]));
	});

	updateVisualization();
});


// Render visualization
function updateVisualization() {
	console.log(currData);
	currData.sort((a,b)=> a.YEAR - b.YEAR)

	let val = d3.select("#select-box").property("value");
	console.log(val)

	let column = "GOALS"
	if (val === "goals") {
		column = "GOALS";
	} else if (val === "avg-goals") {
		column = "AVERAGE_GOALS";
	} else if (val === "matches") {
		column = "MATCHES";
	} else if (val === "teams") {
		column = "TEAMS";
	} else if (val === "avg-attendance") {
		column = "AVERAGE_ATTENDANCE";
	}

	// Update x axis
	let years = currData.map(d => formatDate(d.YEAR))
	x.domain(years);
	xAxis.scale(x);
	if (years.length > 10) {
		xAxis.tickValues(years.filter((d, i) => (i % 2 === 1)));
	} else {
		xAxis.tickValues(years);
	}
	svg.select(".x-axis")
		.call(xAxis);

	// Update y axis
	y.domain([
		d3.min(currData, function(d) { return d[column] }),
		d3.max(currData, function(d) { return d[column] })
	])
	yAxis.scale(y);
	svg.select(".y-axis")
		.transition()
		.duration(800)
		.call(yAxis);

	// Create line chart
	const line = d3.line()
		.x(function (d) { return x(formatDate(d.YEAR)) })
		.y(function (d) { return y(d[column]) })
		.curve(d3.curveLinear);

	var lineChart = svg.selectAll(".line")
		.data([currData])
		.attr("class", "line");

	lineChart.exit().remove();

	lineChart.enter()
		.append("path")
		.merge(lineChart)
		.transition()
		.duration(800)
		.attr("class", "line")
		.attr("d", line(currData))
		.attr("fill", "none")
		.attr("stroke", "green")

	// Create data point circles
	var circles = svg.selectAll(".circles")
		.data(currData)
		.attr("class", "circles");

	circles.exit().remove();

	circles.enter()
		.append("circle")
		.merge(circles)
		.on("click", (e,d) => showEdition(d))
		.transition()
		.duration(800)
		.attr("class", "circles")
		.attr("cx", d=>x(formatDate(d.YEAR)))
		.attr("cy", d=>y(d[column]))
		.attr("r", 5)
		.attr("stroke", "black")
		.attr("fill", "green");
}


// Show details for a specific FIFA World Cup
function showEdition(d){
	infoBox
		.style("background-color", "white")
		.style("width", "350px")
		.style("padding", "20px")
		.style("border-radius", "10px");
	infoBox.html("");
	infoBox.append("h2").text(d.EDITION)

	let infoTable = infoBox.append("table").attr("class", "table")
	for (const property in d) {
		if (property !== "EDITION" && property !== "LOCATION") {
			let row = infoTable.append("tr")
			propertyFormatted = property.toLowerCase().split("_")
			for (let i = 0; i < propertyFormatted.length; i++) {
				propertyFormatted[i] = propertyFormatted[i][0].toUpperCase() + propertyFormatted[i].substr(1);
			}
			row.append("th").text(propertyFormatted.join(" ")).attr("scope", "row")
			if (property === "YEAR") {
				row.append("td").text(formatDate(d[property]))
			} else {
				row.append("td").text(d[property])
			}

		}
	}
}
