let sandwiches = [
    { name: "Thesis", price: 7.95, size: "large" },
    { name: "Dissertation", price: 8.95, size: "large" },
    { name: "Highlander", price: 6.50, size: "small" },
    { name: "Just Tuna", price: 6.50, size: "small" },
    { name: "So-La", price: 7.95, size: "large" },
    { name: "Special", price: 12.50, size: "small" }
];

d3.select("svg").selectAll("circle")
    .data(sandwiches)
    .enter()
    .append("circle")
    .attr("cy", 100)
    .attr("cx", (d, i) => (i + 1) * 70)
    .attr("r", d => {
        if (d.size == "large")
            return 30
        else
            return 15
    })
    .attr("fill", d => {
        if (d.price < 7.00)
            return "blue"
        else
            return "yellow"
    })
    .attr("stroke", "black")


