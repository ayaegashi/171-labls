
// SVG Size
let width = 700,
	height = 500;

let svg = d3.select("#chart-area")
	.append("svg")
	.attr("width", width)
	.attr("height", height)

// Load CSV file
d3.csv("data/wealth-health-2014.csv", d => {
	d.Income = +d.Income;
	d.LifeExpectancy = +d.LifeExpectancy;
	d.Population = +d.Population;
	// TODO: convert values where necessary in this callback (d3.csv reads the csv line by line. In the callback,
	//  you have access to each line (or row) represented as a js object with key value pairs. (i.e. a dictionary).
	return d;
}).then( data => {
	// Analyze the dataset in the web console
	console.log(data);
	console.log("Countries: " + data.length)

	let padding = 40;

	let incomeScale = d3.scaleLog()
		.domain([
			d3.min(data, function(d) { return d.Income - 100 }),
			d3.max(data, function(d) { return d.Income })
		])
		.range([padding, width - padding])
	let lifeExpectancyScale = d3.scaleLinear()
		.domain([
			d3.min(data, function(d) { return d.LifeExpectancy }) - 2,
			d3.max(data, function(d) { return d.LifeExpectancy }) + 2
		])
		.range([height - padding, padding])

	console.log(incomeScale(5000))
	console.log(lifeExpectancyScale(68))

	let populationScale = d3.scaleLinear()
		.domain([
			d3.min(data, function(d) { return d.Population }),
			d3.max(data, function(d) { return d.Population })
		])
		.range([4, 30])

	let colorPalette = d3.scaleOrdinal(d3.schemeCategory10)
		.domain([data.Region]);

	// TODO: sort the data
	data.sort(function(a,b) {
		return d3.descending(+a.Population, +b.Population);
	})
	svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d){ return incomeScale(d.Income + 1) })
		.attr("cy", function(d){ return lifeExpectancyScale(d.LifeExpectancy) })
		.attr("r", function(d){ return populationScale(d.Population) })
		.attr("fill", colorPalette)
		.attr("stroke", "black")
		.attr("stroke-width", ".5px");

	let xAxis = d3.axisBottom()
		.scale(incomeScale)
		.tickValues([1000,2000,10000,100000]);
	let yAxis = d3.axisLeft()
		.scale(lifeExpectancyScale);

	svg.append("g")
		.attr("class", "axis x-axis")
		.attr("transform", "translate(0," + (height - padding) + ")")
		.call(xAxis)
		.append("text")
		.text("Income")
		.attr("x", width / 2)
		.attr("y", padding * (3/4))
		.attr("fill", "currentColor");
	svg.append("g")
		.attr("class", "axis y-axis")
		.attr("transform", "translate(" + padding + ", 0)")
		.call(yAxis)
		.append("text")
		.text("Life Expectancy")
		.attr("x", -height / 2)
		.attr("y", -1 * padding + 12)
		.attr("transform", "rotate(-90)")
		.attr("fill", "currentColor");

});

