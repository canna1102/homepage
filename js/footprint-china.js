var width = $('#map').width(), height = width/5*4;
var svg = d3.select("#map").append("svg")

var proj = d3.geo.mercator().center([105, 38]).scale(width/1.1).translate([width/2, height/2]);
var path = d3.geo.path().projection(proj);

svg.attr("width", width).attr("height", height);

var bj_text = '<p>I was born and spent my first 18 years growing up in Beijing. Through the eyes of a child, living in this city of distinct seasons has a lot of happiness: catching fluffy flying catkin in the spring, swimming in the very hot summer, visiting the Fragrant Hills park for red leaves in the autumn and making snowmen and having snowball fights with friends in the winter.</p><p> A fortune in my life is that I was admitted by the Beijing No.4 High School(BHSF), which is well-known for its good reputation on academics in China. Moreover, I believed she is a unique high school who emphasizes on our sense of social responsibility cultivation, individual specialities development, physical education in addition to the academic performance. At that time, I did best at subjects of Chemistry and Biologic, and loved the self-organized student rock band.</p>';	
var nj_text = 'Nanjing is the city where my university NJU is located. I studied and lived here between the year of 2009 and 2013. At NJU, I majored in EE. At there, I spent a lot of happy time.';
var hk_text = 'HKUST is the university that I am currenly at as an Mphil student. My supervisor here is professor Huamin, Qu from CSE department. Our lab majors in Data visualization. At there, I spent a lot of happy time.';

var roiData = [{name:"beijing", cp:[116.45511, 40.2539], text: bj_text},
				{name:"nanjing", cp:[118.8062, 31.9208], text: nj_text},
				{name:"xianggang", cp:[114.2784, 22.3057], text: hk_text}];

// first layer is the map
var mapPath = svg.append("g").attr("class", "mapPath");
d3.json("data/china_provinces.json", function(states){
	mapPath.selectAll(".state")
		.data(states.features)
		.enter()
		.append("path")
		.attr("class", "state")
		.attr("d", path);	
});

// second layer is the trace
/*				
var valueline = d3.svg.line().interpolate("linear")
				.x(function(d) { return proj(d.cp)[0] })
				.y(function(d) { return proj(d.cp)[1] });
var roiLink = svg.append("path")
					.attr("d", valueline(roiData))
					.attr("class", "roiLink")
					.attr("stroke", "blue")
					.attr("stroke-width", 2)
					.attr("fill", "none");
*/
					
// third layer is the arcs
var ring_radius = 20;
var ring = d3.select("#map")
				.selectAll(".ring_container")
				.data(roiData)
				.enter()
				.append("div")
				.attr("class", "ring_container")
				.style({"position": "absolute",
						"top": function(d) { return proj(d.cp)[1] - ring_radius +"px" },
						"left": function(d) { return proj(d.cp)[0] +15 - ring_radius +"px" }
						});
ring.append("div")
	.attr("class", "ring_effect normal")
	.style({"height": ring_radius*2 +"px",
			"width": ring_radius*2 + "px",
			});
				
ring.append("div")
	.attr("class", "ring_effect delay")
	.style({"height": ring_radius*2 +"px",
			"width": ring_radius*2 + "px",
			"animation-delay": "0.8s"
			});				
	
d3.select(window).on('resize', resize);	
		
function resize(){
	if ($("#resume").hasClass("full full-height")){	
		width = $('#map').width();
		height = width/5*4;
		proj.scale(width/1.1).translate([width/2, height/2]);
		svg.attr("width", width)
			.attr("height", height);
		
		path = d3.geo.path().projection(proj);
		mapPath.selectAll("path").attr("d", path);
		
		/*
		valueline.x(function(d) { return proj(d.cp)[0] })
					.y(function(d) { return proj(d.cp)[1] });

		roiLink.attr("d", valueline(roiData));
		*/
		
		ring.style({"position": "absolute",
					"top": function(d) { return proj(d.cp)[1] - ring_radius +"px" },
					"left": function(d) { return proj(d.cp)[0] +15 - ring_radius +"px" }
							});
	}else{return false};
}

ring.on("click", function(){
	var text = d3.select(this).data()[0].text;
	d3.select("#edu-exp").html(text);
});