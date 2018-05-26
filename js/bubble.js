
var margin = {top: 0, right: 0, bottom: 0, left: 0},
    width = 600 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var padding = 3;

var nodes = [{"x":348.5214972690332,"y":291.1632019800558,"name":"Meteor","type":"Web development","value":15},{"x":361.6078685512107,"y":298.50318144595235,"name":"Gulp","type":"Web development","value":15},{"x":200.62080968798668,"y":229.28764412729905,"name":"Cytoscape.js","type":"Data visualization","value":20},{"x":363.09080729085736,"y":330.1267748625138,"name":"Ant Design","type":"Styles and components","value":15},{"x":323.49317629507465,"y":230.54458293696092,"name":"Git","type":"Web development","value":20},{"x":387.3125745484179,"y":350.3137618998769,"name":"Font Awesome","type":"Styles and components","value":20},{"x":339.7018646237255,"y":205.30207698029446,"name":"Bower","type":"Web development","value":20},{"x":325.97500957489206,"y":290.0998083999643,"name":"ReactJS","type":"Web development","value":20},{"x":312.5727387582634,"y":325.8710282457755,"name":"Three.js","type":"Data visualization","value":20},{"x":380.46313238692727,"y":249.49808532360908,"name":"AngularJS","type":"Web development","value":40},{"x":389.3719467115909,"y":309.8675840624667,"name":"JQuery","type":"Web development","value":25},{"x":343.9665555429288,"y":362.4009009424367,"name":"Bootstrap","type":"Styles and components","value":30},{"x":344.500549903701,"y":317.40922720604055,"name":"colorBrewer","type":"Styles and components","value":20},{"x":305.3051025337013,"y":350.3134394138136,"name":"Google Maps","type":"Web map service","value":15},{"x":292.8127053293757,"y":342.00031249687464,"name":"OpenLayers","type":"Web map service","value":15},{"x":230.5048082085252,"y":206.63349501853577,"name":"Gephi","type":"Data visualization","value":25},{"x":283.16724184889136,"y":204.51121314291208,"name":"DataV","type":"Data visualization","value":30},{"x":344.19720938361206,"y":432.9005236279928,"name":"Leaflet","type":"Web map service","value":35},{"x":135.5457884439174,"y":283.4404069442683,"name":"eCharts.js","type":"Data visualization","value":45},{"x":182.1445721332103,"y":369.1924116830808,"name":"D3.js","type":"Data visualization","value":40},{"x":248.01140880951993,"y":287.41793842297704,"name":"Sigma.js","type":"Data visualization","value":50},{"x":272.11568980877433,"y":392.73382167079836,"name":"Mapbox-gl","type":"Web map service","value":40},{"x":321.33014357929983,"y":260.46465437627194,"name":"Npm","type":"Web development","value":20}];

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
    "Web development": "#006287"
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
        return d.radius - 3;
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
    .attr("stroke-width", 3)
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
