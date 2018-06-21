import * as PIXI from 'pixi.js/dist/pixi.min.js'
import * as d3 from 'd3/dist/d3.min.js'
import * as _ from 'underscore/underscore-min.js'
import * as graph from './miserables.json'

export class Main {
    svg = null
    readonly padding = 100
    width = 0
    height = 0

    constructor () {
        this.initSvg()
        this.drawGraph()
    }

    initSvg () {
        const visualization = document.getElementById("visualization")

        this.width = visualization.clientWidth
        this.height = this.width

        this.svg = d3.select("#visualization").append("svg:svg")
            .attr('width', this.width)
            .attr('height', this.height)
    }

    drawGraph() {
        const colour = (function() {
            let scale = d3.scaleOrdinal(d3.schemeSet3);
            return (num) => parseInt(scale(num).slice(1), 16);
        })()

        graph = {
          "nodes": [
            {"group": 1, "name": "Hannah Arendt", "x": 100, "y": 100, "img": "https://upload.wikimedia.org/wikipedia/commons/6/62/Hannah_arendt-150x150.jpg"},
            {"group": 2, "name": "Michel Foucault", "x": 500, "y": 100, "img": "https://upload.wikimedia.org/wikipedia/en/5/52/Foucault5.jpg"},
            {"group": 3, "name": "Alfred North Whitehead", "x": 300, "y": 500, "img": "https://upload.wikimedia.org/wikipedia/en/4/4e/Alfred_North_Whitehead.jpg"},
          ],
          "links": [
            {"source": 0, "target": 1, "value": 1},
            {"source": 1, "target": 2, "value": 2},
            {"source": 2, "target": 0, "value": 3},
          ]
        }


        const links = this.svg.append("g").attr("class", "links").selectAll("links")
        graph.links.forEach(l => {
            let src = graph.nodes[l.source]
            let tgt = graph.nodes[l.target]
            links.data([l])
                .enter()
                .append("line")
                .attr("class", "link")
                .attr("x1", src.x)
                .attr("y1", src.y)
                .attr("x2", tgt.x)
                .attr("y2", tgt.y)
                .style("stroke", "black")
        })

        const nodes = this.svg.append("g").attr("class", "nodes").selectAll("nodes")
            .data(graph.nodes)
            .enter()
            .append("g")
            .attr("class", "node")
        nodes
            .append("circle")
            .attr("class", "node")
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 60)
            .attr("fill", "white")
            .style("stroke", "black")

        nodes
            .append("text")
            .attr("x", d => d.x)
            .attr("y", d => d.y - 70)
            .attr("stroke", "black")
            .attr("text-anchor", "middle")
            .text(d => d.name)

        nodes.append("clipPath")
            .attr("id", (d, i) => `clipCircle${i}`)
            .append("circle")
            .attr("r", 50)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)

        nodes
            .append("svg:image")
            .attr("x", d => d.x - 50)
            .attr("y", d => d.y - 50)
            .attr("width", d => 120)
            .attr("height", d => 120)
            .attr("xlink:href", d => d.img)
            .attr("clip-path", (d, i) => `url(#clipCircle${i})`)
    }
}
