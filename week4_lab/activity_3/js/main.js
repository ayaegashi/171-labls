
d3.csv("data/cities.csv", (d) => {
    if (d.eu == "true") {
        d.population = +d.population;
        d.x = +d.x;
        d.y = +d.y;
        return d
    }
}).then((data) => {
    console.log(data);
    d3.select("body")
        .append("div")
        .text("Number of cities: " + data.length)
        .attr("class", "label");
    let svg = d3.select("body")
        .append("svg")
        .attr("width", 700)
        .attr("height", 550);
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cy", d => d.y)
        .attr("cx", d => d.x)
        .attr("r", d => {
            if (d.population < 1000000) {
                return 4;
            } else {
                return 8
            }
        })
        .attr("class", "city-circle");
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "city-label")
        .text(d => d.city)
        .attr("y", d => d.y - 15)
        .attr("x", d => d.x)
        .attr("opacity", d => {
            if (d.population < 1000000) {
                return 0
            }
        });
})
