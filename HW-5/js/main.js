

d3.csv("data/zaatari-refugee-camp-population.csv", d => {
    d.population = +d.population;
    d.date = d3.isoParse(d.date);
    return d;
}).then(data => {
    let height = 400;
    let width = 550;
    let margin = 50;
    let svg = d3.select("#col-left")
        .append("svg")
        .attr("height", height + 2*margin)
        .attr("width", width + 2*margin);

    svg.append("text")
        .text("Camp Population")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 + margin)
        .attr("y", 20)
        .attr("class", "title");

    let timeScale = d3.scaleTime()
        .domain([
            d3.min(data, function(d) { return d.date }),
            d3.max(data, function(d) { return d.date })
        ])
        .range([margin, width + margin]);

    let popScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, function(d) { return d.population })
        ])
        .range([height + margin, margin])

    let xAxis = d3.axisBottom()
        .scale(timeScale)
        .tickFormat(d3.timeFormat("%b %Y"));

    let yAxis = d3.axisLeft()
        .scale(popScale);

    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (height + margin) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + margin + ", 0)")
        .call(yAxis);

    let area = d3.area()
        .x(function(d) { return timeScale(d.date) })
        .y0(height + margin)
        .y1(function(d) {return popScale(d.population) });

    svg.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", area);

    function mousemove(event) {
        let x = d3.pointer(event)[0];
        let date = timeScale.invert(x);
        let bisectDate = d3.bisector(d => d.date).left;
        let dataEntry = data[bisectDate(data, date)];

        let formatDate = d3.timeFormat("%Y-%m-%d");
        let formatPop = d3.format(",");
        tooltip.attr("transform", "translate(" + x + ",0)");
        tooltip.select("#pop-text").text(formatPop(dataEntry.population));
        tooltip.select("#date-text").text(formatDate(dataEntry.date));
    }

    let tooltip = svg.append("g")
        .attr("display", "none")
        .attr("class", "tool-tip");

    tooltip.append("line")
        .attr("stroke", "saddlebrown")
        .attr("x1", 0)
        .attr("y1", margin)
        .attr("x2", 0)
        .attr("y2", height + margin);

    tooltip.append("text")
        .attr("x", 10)
        .attr("y", margin + 10)
        .attr("id", "pop-text")
        .attr("class", "tooltip-text");

    tooltip.append("text")
        .attr("x", 10)
        .attr("y", margin + 30)
        .attr("id", "date-text")
        .attr("class", "tooltip-text");

    svg.append("rect")
        .attr("x", margin)
        .attr("y", margin)
        .attr("height", height)
        .attr("width", width)
        .attr("opacity", 0)
        .on("mouseover", function() {
            tooltip.attr("display", "null")
        })
        .on("mouseout", function() {
            tooltip.attr("display", "none")
        })
        .on("mousemove", (e) => mousemove(e));

}).then(() => {
    let shelterTypes = [
        {
            "type": "Caravan",
            "percentage": 79.68
        },
        {
            "type": "Combination*",
            "percentage": 10.81
        },
        {
            "type": "Tent",
            "percentage": 9.51
        }
    ]

    let height = 400
    let width = 450
    let margin = 50

    let svgRight = d3.select("#col-right")
        .append("svg")
        .attr("height", height + 2*margin)
        .attr("width", width + 2*margin);

    svgRight.append("text")
        .text("Type of Shelter")
        .attr("text-anchor", "middle")
        .attr("x", width / 2 + margin)
        .attr("y", 20)
        .attr("class", "title");

    let x = d3.scaleBand()
        .domain(["Caravan", "Combination*", "Tent"])
        .rangeRound([margin, width + margin])
        .paddingInner(0.10);

    let y = d3.scaleLinear()
        .domain([0, 100])
        .range([margin + height, margin])

    let xAxis = d3.axisBottom()
        .scale(x);

    let yAxis = d3.axisLeft()
        .scale(y)
        .tickFormat(d => d + "%");

    svgRight.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (height + margin) + ")")
        .call(xAxis);

    svgRight.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + margin + ", 0)")
        .call(yAxis);

    svgRight.selectAll("rect")
        .data(shelterTypes)
        .enter()
        .append("rect")
        .attr("x", d => x(d.type) + 15)
        .attr("y", d => y(d.percentage))
        .attr("width", x.bandwidth() - 30)
        .attr("height", d => y(100-d.percentage) - margin);

    svgRight.selectAll("textPercentages")
        .data(shelterTypes)
        .enter()
        .append("text")
        .attr("class", "textPercentages")
        .text(d => d.percentage + "%")
        .attr("text-anchor", "middle")
        .attr("x", d => x(d.type) + x.bandwidth() / 2)
        .attr("y", d => y(d.percentage) - 5)
        .attr("fill", "black");

}).then(() => {
    d3.select("#col-left")
        .append("div")
        .text("Hover over the area chart to see individual values.");
    d3.select("#col-right")
        .append("div")
        .text("* Households with recorded tent and caravan combinations.");
})
