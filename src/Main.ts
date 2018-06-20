import * as PIXI from 'pixi.js/dist/pixi.min.js'
import * as d3 from 'd3/dist/d3.min.js'
import * as _ from 'underscore/underscore-min.js'
import * as graph from './miserables.json'

export class Main {
    svg = null
    readonly padding = 100
    width = 0
    height = 0
    readonly domainX = [500, -500]
    readonly domainY = [-50, 50]

    constructor () {
        this.initSvg()
        this.drawCoordinates()
    }

    initSvg () {
        const visualization = document.getElementById("visualization")

        this.width = visualization.clientWidth
        this.height = this.width

        this.svg = d3.select("#visualization").append("svg:svg")
            .attr('width', this.width)
            .attr('height', this.height)
    }

    drawCoordinates() {
        const xScale = d3.scaleLinear().domain(this.domainX).range([this.width - this.padding, this.padding])
        const yScale = d3.scaleLinear().domain(this.domainY).range([this.height - this.padding, this.padding])

        const stepX = Math.abs(this.domainX[0] - this.domainX[1]) / 10
        const stepY = Math.abs(this.domainY[0] - this.domainY[1]) / 10
        const xAxis = d3.axisTop(xScale).tickValues(_.range(this.domainX[0], (this.domainX[1] < this.domainX[0]) ? this.domainX[1]-1 : this.domainX[1]+1).filter(d => d%stepX===0))
        const yAxis = d3.axisLeft(yScale).tickValues(_.range(this.domainY[0], (this.domainY[1] < this.domainY[0]) ? this.domainY[1]-1 : this.domainY[1]+1).filter(d => d%stepY===0))

        // --
        const xAxisPlot = this.svg.append('g')
            .attr("class", "axis axis--x")
            .attr('transform', `translate(0, ${this.height/2})`)
            .call(xAxis)

        // |
        const yAxisPlot = this.svg.append('g')
            .attr("class", "axis axis--y")
            .attr('transform', `translate(${this.width/2}, 0)`)
            .call(yAxis)

        xAxisPlot.selectAll(".tick line")
            .attr("y1", (this.width - (2*this.padding))/2 * -1)
            .attr("y2", (this.width - (2*this.padding))/2 * 1);

        yAxisPlot.selectAll(".tick line")
            .attr("x1", (this.width - (2*this.padding))/2 * -1)
            .attr("x2", (this.width - (2*this.padding))/2 * 1);
    }

    drawCircle() {

    }
}
