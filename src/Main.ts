import * as PIXI from 'pixi.js/dist/pixi.min.js'
import * as d3 from 'd3/dist/d3.min.js'
import * as graph from './miserables.json'

export class Main {
    constructor () {
        let width = 960, height = 600;

        let stage = new PIXI.Container();
        let renderer = PIXI.autoDetectRenderer(width, height,
            {antialias: !0, transparent: !0, resolution: 1});

        document.body.appendChild(renderer.view);

        let colour = (function() {
            console.log(d3.schemeCategory20)
            let scale = d3.scaleOrdinal(d3.schemeSet3);
            return (num) => parseInt(scale(num).slice(1), 16);
        })()

        let simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id((d) => d.id))
            .force('charge', d3.forceManyBody())
            .force('center', d3.forceCenter(width / 2, height / 2));

        let links = new PIXI.Graphics()
        stage.addChild(links)

        graph.nodes.forEach((node) => {
            node.gfx = new PIXI.Graphics()
            node.gfx.lineStyle(1.5, 0xFFFFFF)
            node.gfx.beginFill(colour(node.group))
            node.gfx.drawCircle(0, 0, 5)
            stage.addChild(node.gfx)
        })

        d3.select(renderer.view)
            .call(d3.drag()
                .container(renderer.view)
                .subject(() => simulation.find(d3.event.x, d3.event.y))
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended))

        simulation
            .nodes(graph.nodes)
            .on('tick', ticked)

        simulation.force('link')
              .links(graph.links)

        function ticked() {
            console.log("Main#ticked")
            graph.nodes.forEach((node) => {
                let { x, y, gfx } = node;
                gfx.position = new PIXI.Point(x, y)
            })

            links.clear();
            links.alpha = 0.6;

            graph.links.forEach((link) => {
                let { source, target } = link;
                links.lineStyle(Math.sqrt(link.value), 0x999999);
                links.moveTo(source.x, source.y)
                links.lineTo(target.x, target.y)
            })

            links.endFill()

            renderer.render(stage)
        }

        function dragstarted() {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d3.event.subject.fx = d3.event.subject.x;
            d3.event.subject.fy = d3.event.subject.y;
        }

        function dragged() {
            d3.event.subject.fx = d3.event.x;
            d3.event.subject.fy = d3.event.y;
        }

        function dragended() {
            if (!d3.event.active) simulation.alphaTarget(0);
            d3.event.subject.fx = null;
            d3.event.subject.fy = null;
        }
    }
}
