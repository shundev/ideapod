import * as PIXI from 'pixi.js/dist/pixi.min.js'
import * as d3 from 'd3/dist/d3.min.js'
import * as _ from 'underscore/underscore-min.js'
import * as graph from './miserables.json'

export class Main {
    constructor () {
        const visualization = document.getElementById("visualization")

        const padding = 100
        const width = visualization.clientWidth
        const height = width

        const g = d3.select("#visualization").append("svg:svg")
            .attr('width', width)
            .attr('height', height)

        const xScale = d3.scaleLinear().domain([10, -10]).range([width - padding, padding])
        const yScale = d3.scaleLinear().domain([-10, 10]).range([height - padding, padding])

        const xAxis = d3.axisTop(xScale).tickValues(_.range(10, -11).filter(d => d%2===0))
        const yAxis = d3.axisLeft(yScale).tickValues(_.range(-10, 11).filter(d => d%2===0))

        // --
        const xAxisPlot = g.append('g')
            .attr("class", "axis axis--x")
            .attr('transform', `translate(0, ${height/2})`)
            .call(xAxis)

        // |
        const yAxisPlot = g.append('g')
            .attr("class", "axis axis--y")
            .attr('transform', `translate(${width/2}, 0)`)
            .call(yAxis)

        xAxisPlot.selectAll(".tick line")
    		.attr("y1", (width - (2*padding))/2 * -1)
    		.attr("y2", (width - (2*padding))/2 * 1);

    	yAxisPlot.selectAll(".tick line")
    		.attr("x1", (width - (2*padding))/2 * -1)
    		.attr("x2", (width - (2*padding))/2 * 1);
    }
}
