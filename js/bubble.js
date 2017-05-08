
var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var padding = 3;

var nodes = [{"x":212.19030118407105,"y":184.66589528919113,"name":"Three.js","type":"Data visualization","value":20},{"x":347.6951310600879,"y":288.1484953700093,"name":"colorBrewer","type":"Styles and components","value":20},{"x":327.97107419933434,"y":246.3625975158003,"name":"Bootstrap","type":"Styles and components","value":30},{"x":372.57760835226577,"y":282.59556248024853,"name":"Meteor","type":"Development and build","value":34},{"x":180.5641850490925,"y":244.29887537394993,"name":"D3.js","type":"Data visualization","value":45},{"x":398.48404633214574,"y":237.88946034785346,"name":"Gulp","type":"Development and build","value":35},{"x":267.7178738367295,"y":197.53028889181462,"name":"Mapbox GL JS","type":"Data visualization","value":38},{"x":264.2990671354416,"y":341.08638949487505,"name":"Google Maps","type":"Web map service","value":15},{"x":168.9780497780857,"y":336.1808457184044,"name":"Linkurious.js","type":"Data visualization","value":40},{"x":245.27015320998203,"y":329.08458542086004,"name":"OpenLayers","type":"Web map service","value":20},{"x":301.557148265481,"y":336.88286671486236,"name":"Mapbox","type":"Web map service","value":30},{"x":218.2783674860041,"y":301.9859422236308,"name":"Cytoscape.js","type":"Data visualization","value":20},{"x":264.42490430232266,"y":276.9572259524219,"name":"Gephi","type":"Data visualization","value":35},{"x":317.9132753857093,"y":291.7595638600156,"name":"Font Awesome","type":"Styles and components","value":20},{"x":358.63471088838713,"y":268.4921147217533,"name":"Semantic UI","type":"Styles and components","value":15},{"x":346.89323832383593,"y":321.1363339465128,"name":"Bower","type":"Development and build","value":20},{"x":312.27197589074757,"y":380.58702613700314,"name":"OpenStreetMap","type":"Web map service","value":20},{"x":247.35662878796995,"y":399.0837180795155,"name":"Leaflet","type":"Web map service","value":45},{"x":363.8361247634851,"y":401.1147768912909,"name":"Jquery","type":"Development and build","value":35},{"x":347.39559802213734,"y":351.13265887245706,"name":"Npm","type":"Development and build","value":20},{"x":414.1790054754308,"y":326.5099303978058,"name":"Angular.js","type":"Development and build","value":45}];

var rScale = d3.scale.linear()
    .domain([10, 50])
    .range([0, 60]);


nodes.forEach(function(node){
    node.radius = rScale(node.value)
});

var color = {
    "Web map service": "#03B9FF",
    "Data visualization": "#0099d5",
    "Styles and components": "#0075A1",
    "Development and build": "#006287"
};

d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};
d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};


var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(0.01)
    .charge(0)
    .on("tick", tick)
    .start();

var svg = d3.select("#skill-visualization").append("svg")
    .attr("width", width + margin.left + margin.right)
    //.attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", "80, 140, 440, 360")
    .attr("class", "skill-bubble")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var g = svg.selectAll("group")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", function(d){
        return d.type.split(" ").join("_")
    })
    .classed("individual_bubble", true);

var circle = g.append("circle")
    .attr("r", function(d) { return d.radius; })
    .style("fill", function(d) { return color[d.type]; })
    .style("fill-opacity", 0.9)
    .call(force.drag);


g.append("circle")
    .attr("pointer-events", "none")
    .attr("class", "hover")
    .attr("r", function (d) {
        return d.radius - 4;
    })
    .style("fill", "#fff")
    .attr("display", "none");



circle.on("mouseover", function(d){
    d3.select(this.parentElement)
        .select("text")
        .attr("display", null);


    d3.select(this.parentElement)
        .select(".hover")
        .attr("display", null);

    d3.select(this.parentElement).moveToFront();
});

circle.on("mouseout", function(d){
    if (!d.displayLabel){
        d3.select(this.parentElement)
            .select("text")
            .attr("display", "none");
    }

    d3.select(this.parentElement)
        .select(".hover")
        .attr("display", "none");
});

var text = g.append("text")
    .attr("dx", 0)
    .each(function(d){
        var font = d.radius / Math.sqrt(d.name.length) - 2;
        d.displayLabel = d.radius > 30;
        d.font = d.displayLabel ? font: 8;
    })
    .attr("display", function(d){
        return d.displayLabel ? null: "none"
    })
    .attr("font-size", function(d){
        return d.font
    })
    .attr("pointer-events", "none")
    .attr("paint-order", "stroke")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .attr("fill", "#fff")
    .attr("stroke", function(d) { return color[d.type]; })
    .attr("stroke-width", 4)
    .text(function(d) { return d.name });

function tick(e) {
    g.each(cluster(10 * e.alpha * e.alpha))
        .each(collide(.5))
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

// Move d to be adjacent to the cluster node.
function cluster(alpha) {
    var max = {};

    // Find the largest node for each cluster.
    nodes.forEach(function(d) {
        if (!(d.type in max) || (d.radius > max[d.type].radius)) {
            max[d.type] = d;
        }
    });

    return function(d) {
        var node = max[d.type],
            l,
            r,
            x,
            y,
            i = -1;

        if (node == d) return;

        x = d.x - node.x;
        y = d.y - node.y;
        l = Math.sqrt(x * x + y * y);
        r = d.radius + node.radius;
        if (l != r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            node.x += x;
            node.y += y;
        }
    };
}

// Resolves collisions between d and all other circles.
function collide(alpha) {
    var quadtree = d3.geom.quadtree(nodes);
    return function(d) {
        var r = d.radius + 1 + padding,
            nx1 = d.x - r,
            nx2 = d.x + r,
            ny1 = d.y - r,
            ny2 = d.y + r;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== d)) {
                var x = d.x - quad.point.x,
                    y = d.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = d.radius + quad.point.radius + (d.type !== quad.point.type) * padding;
                if (l < r) {
                    l = (l - r) / l * alpha;
                    d.x -= x *= l;
                    d.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2
                || x2 < nx1
                || y1 > ny2
                || y2 < ny1;
        });
    };
}


// legend

var legendSvg = d3.select("#skill-visualization")
    .append("svg")
    //.attr("width", 190)
    //.attr("height", 300)
    .attr("class", "skill-legend");

var legendSvgG = legendSvg.append("g")
    .attr("transform", "translate(0, 0)");

var legendSize = legendSvgG.append("g")
    .attr("class", "legendSize")
    .style("font-size","8px")
    .append("g")
    .attr("class", "cell");


legendSize.append("circle")
    .attr("r", 40)
    .attr("cy", 20);

legendSize.append("circle")
    .attr("r", 10)
    .attr("cy", 50);

legendSize.append("text")
    .attr("transform", "translate(0, -30)")
    .text("Very often")
    .attr("font-size", 11)
    .attr("text-anchor", "middle");

legendSize.append("text")
    .attr("transform", "translate(0, 30)")
    .text("Occasional")
    .attr("font-size", 11)
    .attr("text-anchor", "middle");

legendSize.selectAll("circle")
    .attr("stroke", "#bbb")
    .attr("stroke-dasharray", "4,2")
    .attr("fill", "none");


var ordinal = d3.scale.ordinal()
    .domain(Object.keys(color))
    .range(Object.keys(color).map(function(key){
        return color[key];
    }));

var legendQuant = legendSvgG.append("g")
    .attr("class", "legendQuant")
    .style("font-size","10px");

var legend = d3.legend.color()
    .labelFormat(d3.format(".2f"))
    .scale(ordinal);

legendQuant.call(legend);

legendSvg.selectAll(".label")
    .attr("fill", "#bbb")
    .style("font-weight", "normal")
    .style("font-size", "13px");


legendQuant.selectAll(".cell").on("mouseover", function(type, idx) {
    var g = d3.selectAll("." + type.split(" ").join("_"));

    d3.select(this).select("text").attr("fill", "#000");
    g.each(function (d) {
        d3.select(this)
            .select("text")
            .attr("display", null);

        d3.select(this)
            .select(".hover")
            .attr("display", null);

        d3.select(this).moveToFront();

    });
});

legendQuant.selectAll(".cell").on("mouseout", function(type, idx){
    var g = d3.selectAll("."+ type.split(" ").join("_"));
    d3.select(this).select("text").attr("fill", "#bbb");

    g.each(function(d){

        if (!d.displayLabel) {
            d3.select(this)
                .select("text")
                .attr("display", "none");
        }

        d3.select(this)
            .select(".hover")
            .attr("display", "none");

        d3.select(this).moveToFront();

    });
});
