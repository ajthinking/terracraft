
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

//Vue.component('example-component', require('./components/ExampleComponent.vue'));
//const app = new Vue({
//    el: '#app'
//});

var s;
var d = 50;
var offset = 0.85;
var points = [];
var origo;
var padding = 10;
var xLastCenter;
var yLastCenter;
var lastZoom;
var map = L.map('map',{zoomControl:false}).setView([59.3294,18.0686], 16);
var gjLayer;
var gps = true;
var player = new Object();
var firstZoomTo = true;

L.tileLayer('https://api.mapbox.com/v4/mapbox.pencil/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoianVyaXNvbyIsImEiOiIzOTlkMDYxZTI1MGVmNGMxMTQ4OTVjNDE3N2I4ZWFmYiJ9.IRWCUNP1235EmbzVBhpCqw', {
	maxZoom: 20,
	minZoom:5,
	attribution: 'i',
	id: 'examples.map-i875mjb7',
}).addTo(map);


$(document).ready(function(){
	player.id = $("#user_id").html();
    s = new State();
    load();    
    s.diagram = generateDiagram();
    player.marker = L.userMarker(map.getCenter(), {pulsing:true, accuracy:3, smallIcon:true}).addTo(map);    
});

// EVENTS *************************************************************************************

map.on('zoom', function () {
   lastZoom = map.getZoom();

});

map.on('moveend', function() {
    var center = map.getCenter();
    var xyCenter = latLngToXY(center);
    var xCenter = xyCenter[0];
    var yCenter = xyCenter[1];
    if(Math.abs(xCenter-xLastCenter) > padding/2 || Math.abs(yCenter-yLastCenter) > padding/2 || lastZoom != map.getZoom()) {
        if(map.getZoom() > 15) {
            s = new State();
            load();
            s.diagram = generateDiagram();
        } else {
            // ZOOM IN TO DRAW!
            map.removeLayer(gjLayer);
        }
    }
});

$("body").bind("loaded", drawDiagram);
var loadedEvent = jQuery.Event("loaded");

$( "#claim" ).click(function() {
    console.log("Claim!");
    if(gjLayer) {
        var result = leafletPip.pointInLayer(player.marker.getLatLng(), gjLayer,true);
        var id = result[0].feature.geometry.properties.id;
        settle(player.id,id);
    }
});

// FUNCTIONS ************************************************************************************

function drawPolygon(id) {

    //id = 401;
    var c = s.diagram.cells[id];
    var point = s.points[id];
    var polygon_points = [];

    var p0 = new Object();
    var equalVa = c.halfedges[0].edge.va.x == c.halfedges[1].edge.va.x && c.halfedges[0].edge.va.y == c.halfedges[1].edge.va.y;
    var equalVb = c.halfedges[0].edge.va.x == c.halfedges[1].edge.vb.x && c.halfedges[0].edge.va.y == c.halfedges[1].edge.vb.y;
    if(equalVa || equalVb) {
        p0.x = c.halfedges[0].edge.va.x;
        p0.y = c.halfedges[0].edge.va.y;
        p0.lat = c.halfedges[0].edge.va.y*point.dLat+s.origo.vLat;
        p0.lng = c.halfedges[0].edge.va.x*point.dLng+s.origo.vLng;
    } else {
        p0.x = c.halfedges[0].edge.vb.x;
        p0.y = c.halfedges[0].edge.vb.y;
        p0.lat = c.halfedges[0].edge.vb.y*point.dLat+s.origo.vLat;
        p0.lng = c.halfedges[0].edge.vb.x*point.dLng+s.origo.vLng;
    }
        polygon_points.push(p0);

    for(var i=1; i<c.halfedges.length; i++) {
        if(c.halfedges[i].edge.va.x != polygon_points[i-1].x || c.halfedges[i].edge.va.y != polygon_points[i-1].y) {
            var p = new Object();
            p.x = c.halfedges[i].edge.va.x;
            p.y = c.halfedges[i].edge.va.y;
            p.lat = c.halfedges[i].edge.va.y*point.dLat+s.origo.vLat;
            p.lng = c.halfedges[i].edge.va.x*point.dLng+s.origo.vLng;
            polygon_points.push(p);
        } else {
            var p = new Object();
            p.x = c.halfedges[i].edge.vb.x;
            p.y = c.halfedges[i].edge.vb.y;
            p.lat = c.halfedges[i].edge.vb.y*point.dLat+s.origo.vLat;
            p.lng = c.halfedges[i].edge.vb.x*point.dLng+s.origo.vLng;
            polygon_points.push(p);
        }

    }
    var pps = [];
    for(var i=0; i<c.halfedges.length; i++) {
        pps.push([polygon_points[i].lat,polygon_points[i].lng]);
    }
    pps.push([polygon_points[0].lat,polygon_points[0].lng]);
    if(Math.random()<0.05) {
    polygon = L.polygon(pps,{
                        color: "red",
                        fillColor: getRandomColor(),
                        weight: 0.5,
                        fill: "red",
                        opacity: 1.0,
                        fillOpacity: 0.20,
                        smoothFactor: 0
                    }).addTo(map).bindPopup("" + id);
    }
}

function cellToGeoJSON(id) {
    var c = s.diagram.cells[id];
    var point = s.points[id];
    var polygon_points = [];

    var p0 = new Object();

    var equalVa = c.halfedges[0].edge.va.x == c.halfedges[1].edge.va.x && c.halfedges[0].edge.va.y == c.halfedges[1].edge.va.y;
    var equalVb = c.halfedges[0].edge.va.x == c.halfedges[1].edge.vb.x && c.halfedges[0].edge.va.y == c.halfedges[1].edge.vb.y;
    if(equalVa || equalVb) {
        p0.x = c.halfedges[0].edge.va.x;
        p0.y = c.halfedges[0].edge.va.y;
        p0.lat = c.halfedges[0].edge.va.y*point.dLat+s.origo.vLat;
        p0.lng = c.halfedges[0].edge.va.x*point.dLng+s.origo.vLng;
    } else {
        p0.x = c.halfedges[0].edge.vb.x;
        p0.y = c.halfedges[0].edge.vb.y;
        p0.lat = c.halfedges[0].edge.vb.y*point.dLat+s.origo.vLat;
        p0.lng = c.halfedges[0].edge.vb.x*point.dLng+s.origo.vLng;
    }
        polygon_points.push(p0);

    for(var i=1; i<c.halfedges.length; i++) {
        if(c.halfedges[i].edge.va.x != polygon_points[i-1].x || c.halfedges[i].edge.va.y != polygon_points[i-1].y) {
            var p = new Object();
            p.x = c.halfedges[i].edge.va.x;
            p.y = c.halfedges[i].edge.va.y;
            p.lat = c.halfedges[i].edge.va.y*point.dLat+s.origo.vLat;
            p.lng = c.halfedges[i].edge.va.x*point.dLng+s.origo.vLng;
            polygon_points.push(p);
        } else {
            var p = new Object();
            p.x = c.halfedges[i].edge.vb.x;
            p.y = c.halfedges[i].edge.vb.y;
            p.lat = c.halfedges[i].edge.vb.y*point.dLat+s.origo.vLat;
            p.lng = c.halfedges[i].edge.vb.x*point.dLng+s.origo.vLng;
            polygon_points.push(p);
        }

    }
    var pps = [];
    for(var i=0; i<c.halfedges.length; i++) {
        pps.push([polygon_points[i].lng,polygon_points[i].lat]);
    }
    pps.push([polygon_points[0].lng,polygon_points[0].lat]);

    var polygon = {
        "type": "Polygon",
        "properties": {id: c.site.id, owner: -1},
        "coordinates": [pps]
    };

    return polygon;

}

function State() {
   var minMaxXY = getMinMaxXY();
   this.minX = Math.round(minMaxXY[0]-padding);
   this.maxX = Math.round(minMaxXY[1]+padding);
   this.minY = Math.round(minMaxXY[2]-padding);
   this.maxY = Math.round(minMaxXY[3]+padding);
   var bounds = map.getBounds();
   this.minLat = bounds.getSouth();
   this.minLng = bounds.getWest();
   this.maxLat = bounds.getNorth();
   this.maxLng = bounds.getEast();
   this.origo = new Point(this.minX,this.minY);
   this.sites = [];
   this.points = [];
   this.dbPoints = new Object();

   this.drawnEdges = [];
   return this;
}


function generateDiagram() {
    var center = map.getCenter();
    var xyCenter = latLngToXY(center);
    xLastCenter = xyCenter[0];
    yLastCenter = xyCenter[1];

   for(var x=s.minX; x<s.maxX; x++) {
        for(var y=s.minY; y<s.maxY; y++) {
            var p = new Point(x,y); // candidate point
            var dMx = (p.vLng - s.origo.vLng)/p.dLng;
            var dMy = (p.vLat - s.origo.vLat)/p.dLat;
            s.points.push(p);
            s.sites.push({x: dMx, y: dMy, r: y, c: x, lat: p.vLat, lng: p.vLng, id: p.id});
        }
    }
    var bbox = {xl: -1000, xr: 10000, yt: -1000, yb: 10000};
    var voronoi = new Voronoi();
    var diagram = voronoi.compute(s.sites, bbox);
    return diagram;
}

function drawDiagram() {    
    setTimeout(function() {
        console.time('calculate');
        console.time('draw');
        if(gjLayer) {
            map.removeLayer(gjLayer);
        } else {
        }
        var geojsonObjects = [];
        //console.log("Cells: " + s.diagram.cells.length);
        $.each(s.diagram.cells, function(indexCells, cell) {
            if(cell.site.r >  s.minY +3 && cell.site.r <  s.maxY -3 && cell.site.c >  s.minX +3 && cell.site.c <  s.maxX -3) {
                var point = s.points[indexCells];
                var polygon_points = [];
                drawPolygon(cell.site.voronoiId);
                if(cell.halfedges.length > 0) {
                    geojsonObjects.push(cellToGeoJSON(cell.site.voronoiId));

                } else {
                    L.marker([cell.site.lat, cell.site.lng]).addTo(map);
                }
            }
        });
        console.timeEnd('calculate');

        gjLayer = L.geoJson(geojsonObjects, {
            //feature.geometry.properties.id
            style: function(feature) {

                var fill = false;
                var owner = feature.geometry.properties.owner;
                if(owner == player.id) {
                    var fill = true;
                    var fillColor = "green";
                } else if(owner != -1) {
                    var fill = true;
                    var fillColor = "black";
                } else {
                    var fill = false;
                    var fillColor = "black";
                }

                var myStyle = {
                            color: "darkgreen",
                            fillColor: fillColor,
                            weight: 1.5,
                            fill: fill,
                            opacity: 1.0,
                            fillOpacity: 0.25,
                            smoothFactor: 0
                };
                return myStyle;
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup("Owner: " + feature.properties.owner + "<br> Land: 52 acres" + "<br> Strength: Weak" );
            }
        }).addTo(map);
        console.timeEnd('draw');
    }, 1);
    
}

function Point(x,y) {
    this.x = x;
    this.y = y;
    this.id = XYtoID(x,y);
    var latLng = XYtoLatLng(x,y);
    this.lat = latLng.lat;
    this.lng = latLng.lng;
    Math.seedrandom(this.id);
    this.xRandNbr = Math.random();
    this.yRandNbr = Math.random();
    this.vX = this.x + this.xRandNbr * offset;
    this.vY = this.y + this.yRandNbr * offset;
    var vLatLng = XYtoLatLng(this.vX,this.vY);
    this.vLat = vLatLng.lat;
    this.vLng = vLatLng.lng;
    this.dLat = 1/(111111);
    this.dLng = 1/(111111*cos(this.vLat));
    return this;
}

function pointInViewPort(x,y) {
    var bounds = map.getBounds();
    var minScreen = L.latLng(bounds.getSouth(), bounds.getWest());
    var maxScreen = L.latLng(bounds.getNorth(), bounds.getEast());
    var minY = Math.floor(latLngToXY(minScreen)[1]);
    var maxY = Math.ceil(latLngToXY(maxScreen)[1]);
    var minX = bounds.getWest()/(d*dLngFromY(y));
    var maxX = bounds.getEast()/(d*dLngFromY(y));

    if(minY < y && y < maxY && minX < x && x < maxX) {
        return true;
    }
    return false;
}

function getMinMaxXY() {
    var bounds = map.getBounds();
    var minScreen = L.latLng(bounds.getSouth(), bounds.getWest());
    var maxScreen = L.latLng(bounds.getNorth(), bounds.getEast());
    var minY = Math.floor(latLngToXY(minScreen)[1]);
    var maxY = Math.ceil(latLngToXY(maxScreen)[1]);
    var minX = Number.POSITIVE_INFINITY;
    var maxX = Number.NEGATIVE_INFINITY;
    for(var y = minY; y<maxY; y++) {
        //get points with x inside screen.
        var minXcandidate = bounds.getWest()/(d*dLngFromY(y));
        var maxXcandidate = bounds.getEast()/(d*dLngFromY(y));
        if(minXcandidate < minX) {
            minX = minXcandidate;
        }
        if(maxXcandidate > maxX) {
            maxX = maxXcandidate;
        }
    }
    minX = Math.floor(minX);
    maxX = Math.ceil(maxX);
    return [minX,maxX,minY,maxY];
}



function dLngFromY(y) {
    var dLat = 1/111111;
    var lat = y*dLat*d;
    return 1/(111111*cos(lat));
}


function idToXY(id) {
    reversedX = Math.round(id/10000000);
	reversedY = id - reversedX*10000000;
    return [reversedX, reversedY];
}

function XYtoID(x,y) {
    return y + x*10000000;
}

function drawLine(p0,p1,color) {
    var pointList = [p0, p1];
    var border = new L.polyline(pointList, {
        color: color,
        weight: 3,
        opacity: 1,
        smoothFactor: 1
    });
    border.addTo(map).bindPopup('Hello');
}

// finds x,y from lon/lat
function latLngToXY(p) {
    var dLat = 1/111111;
    var dLng = 1/(111111*cos(p.lat));
    var x = p.lng/(d*dLng);
    var y = p.lat/(d*dLat);
    //var rX = Math.round(x);
    //var rY = Math.round(y);
    return [x,y];
}

function XYtoLatLng(x,y) {
    var dLat = 1/111111;
    var lat = y*(d*dLat);
    var dLng  = 1/(111111*cos(lat));
    var lng = x*d*dLng;
    return L.latLng(lat,lng);
}

function cos(a) {
    return Math.cos(a*Math.PI / 180);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function load() {
    $("body").trigger(loadedEvent);
    return;
    $.get(
        "tiles",
        {
	        minLat:s.minLat,
            minLng:s.minLng,
            maxLat:s.maxLat,
            maxLng:s.maxLng
        },
        function(data, status){
            if(status == 200){
                // console.log("no points in this area!");
            } else {
                // update cache
                // render
            }
	        $("body").trigger(loadedEvent);
    });
}

function settle(user,pointId) {
    var xy = idToXY(pointId);
    var x = xy[0];
    var y = xy[1];
    var p = new Point(x,y);

    $.post("tiles", {
        user_id:player.id,
        lat: p.vLat,
        lng: p.vLng,
        id: pointId},
        function(data, status){
            // do something
    });

}
