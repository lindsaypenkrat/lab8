let data  = d3.csv('driving.csv', d3.autoType).then(data=>{

const margin = ({top: 35, right: 140, bottom: 70, left: 140});
const width = 1200 - margin.left - margin.right;
const height = 625 - margin.top - margin.bottom;

const svg = d3.select('.chart').append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.miles)).nice()
    .range([0, width]);


let yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.gas)).nice()
    .range([height,0]);

const xAxis = d3.axisBottom()
    .scale(xScale);


const yAxis = d3.axisLeft()
    .tickFormat(d3.format("$.2f"))
    .scale(yScale);



let xAxisGroup = svg.append("g")
    .call(xAxis)
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0,${height})`);


let yAxisGroup = svg.append("g")
    .attr("class", "axis y-axis");



let line = d3.line()
    .curve(d3.curveCatmullRom)
    .x(d => xScale(d.miles))
    
    .y(d => yScale(d.gas));


svg.append("g").call(xAxis)
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(g=> g.select(".domain").remove())
    .selectAll(".tick line")
    .clone()
    .attr("y2", -height)
    .attr("stroke-opacity", 0.1);


svg.append("g").call(yAxis)
    .attr("class", "axis y-axis")
    .call(g=> g.select(".domain").remove())
    .selectAll(".tick line")
    .clone()
    .attr("x2", width)
    .attr("stroke-opacity", 0.1);


svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#ff0000")
    .attr("stroke-width", 2.5)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("stroke-dasharray", `0,${length(line(data))}`)
    .attr("d", line)
  .transition()
    .duration(5000)
    .ease(d3.easeLinear)
    .attr("stroke-dasharray", `${length(line(data))},${length(line(data))}`);

let circles = svg.append('g')
    .selectAll('circle')
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.miles))
    .attr("cy", d => yScale(d.gas))
    .attr("r", 3)
    .call(halo);


const label = svg.selectAll('.textLabels')
    .data(data)
    .enter()
    .append("text")
    .attr('x', d => xScale(d.miles))
    .attr('y', d => yScale(d.gas))
    .attr("font-size", 10)
    .attr("opacity", 1)
    .text(d => d.year)
    .each(position)
    .call(halo);
   
svg.append("text")
    .attr('x', width/2 - 80)
    .attr('y', height+40)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .text("Miles per person per year");

svg.append("text")
    .attr('x', -70)
    .attr('y', -20)
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .text("Cost per Gallon");

})

function length(path) {
    return d3.create("svg:path").attr("d", path).node().getTotalLength();
  }  


function position(d) {
    const t = d3.select(this);
    switch (d.side) {
      case "top":
        t.attr("text-anchor", "middle").attr("dy", "-0.7em");
        break;
      case "right":
        t.attr("dx", "0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "start");
        break;
      case "bottom":
        t.attr("text-anchor", "middle").attr("dy", "1.4em");
        break;
      case "left":
        t.attr("dx", "-0.5em")
          .attr("dy", "0.32em")
          .attr("text-anchor", "end");
        break;
    }
}

function halo(text) {
  text
    .select(function() {
      return this.parentNode.insertBefore(this.cloneNode(true), this);
    })
    .attr("fill", "none")
    .attr("stroke", "white")
    .attr("stroke-width", 4)
    .attr("stroke-linejoin", "round");
}
