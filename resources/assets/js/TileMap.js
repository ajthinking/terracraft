import Geometry from './Geometry'
import Point from './Point'
import Config from './Config'

export default class TileMap {
    constructor() {
        this.points = [];
        this.map = L.map('map',{zoomControl:false}).setView(Config.startPoint, Config.startZoom);
        this.state = this.getState()
        this.addTileLayer()
        this.addEvents()
        this.load()   
        this.state.diagram = this.generateDiagram();
    }

    addEvents() {
        this.loadedEvent = jQuery.Event("loaded");
        $("body").bind("loaded", this.drawDiagram.bind(this));

        this.map.on('zoom', function () {
            this.lastZoom = this.map.getZoom();
         
         }.bind(this));
         
         this.map.on('moveend', function() {
             var center = this.map.getCenter();
             var xyCenter = Geometry.latLngToXY(center);
             var xCenter = xyCenter[0];
             var yCenter = xyCenter[1];
             if(Math.abs(xCenter-this.xLastCenter) > Config.padding/2 || Math.abs(yCenter-this.yLastCenter) > Config.padding/2 || this.lastZoom != this.map.getZoom()) {
                 if(this.map.getZoom() > 15) {  
                     this.state = this.getState();                     
                     this.state.diagram = this.generateDiagram();
                     this.load();
                 } else {
                     // ZOOM IN TO DRAW!
                     this.map.removeLayer(gjLayer);
                 }
             }
         }.bind(this));
    }

    addTileLayer() {
        L.tileLayer(Config.tileLayer, {
            maxZoom: 20,
            minZoom:5,
            attribution: 'i',
            id: 'examples.map-i875mjb7',
        }).addTo(this.map);
    }

    generateDiagram() {
        var center = this.map.getCenter();
        var xyCenter = Geometry.latLngToXY(center);
        this.xLastCenter = xyCenter[0];
        this.yLastCenter = xyCenter[1];
       for(var x=this.state.minX; x<this.state.maxX; x++) {
            for(var y=this.state.minY; y<this.state.maxY; y++) {
                var p = new Point(x,y); // candidate point
                var dMx = (p.vLng - this.state.origo.vLng)/p.dLng;
                var dMy = (p.vLat - this.state.origo.vLat)/p.dLat;
                this.state.points.push(p);
                this.state.sites.push({x: dMx, y: dMy, r: y, c: x, lat: p.vLat, lng: p.vLng, id: p.id});
            }
        }
        var bbox = {xl: -1000, xr: 10000, yt: -1000, yb: 10000};
        var voronoi = new Voronoi();
        var diagram = voronoi.compute(this.state.sites, bbox);
        return diagram;
    }
    
    getState() {
        var state = {}
        var minMaxXY = this.getMinMaxXY();
        state.minX = Math.round(minMaxXY[0]-Config.padding);
        state.maxX = Math.round(minMaxXY[1]+Config.padding);
        state.minY = Math.round(minMaxXY[2]-Config.padding);
        state.maxY = Math.round(minMaxXY[3]+Config.padding);
        var bounds = this.map.getBounds();
        state.minLat = bounds.getSouth();
        state.minLng = bounds.getWest();
        state.maxLat = bounds.getNorth();
        state.maxLng = bounds.getEast();
        state.origo = new Point(state.minX,state.minY);
        state.sites = [];
        state.points = [];
        state.dbPoints = new Object();    
        state.drawnEdges = [];

        return state;
    }

    getMinMaxXY() {
        var bounds = this.map.getBounds();
        var minScreen = L.latLng(bounds.getSouth(), bounds.getWest());
        var maxScreen = L.latLng(bounds.getNorth(), bounds.getEast());
        var minY = Math.floor(Geometry.latLngToXY(minScreen)[1]);
        var maxY = Math.ceil(Geometry.latLngToXY(maxScreen)[1]);
        var minX = Number.POSITIVE_INFINITY;
        var maxX = Number.NEGATIVE_INFINITY;
        for(var y = minY; y<maxY; y++) {
            //get points with x inside screen.
            var minXcandidate = bounds.getWest()/(Config.d*Geometry.dLngFromY(y));
            var maxXcandidate = bounds.getEast()/(Config.d*Geometry.dLngFromY(y));
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
    
    load() {
        $("body").trigger(this.loadedEvent);
        return;
    }

    drawDiagram() {    
        setTimeout(function() {
            //console.time('calculate');
            //console.time('draw');
            if(this.gjLayer) {
                this.map.removeLayer(this.gjLayer);
            } else {
            }
            var geojsonObjects = [];
            $.each(this.state.diagram.cells, function(indexCells, cell) {
                if(cell.site.r >  this.state.minY +3 && cell.site.r <  this.state.maxY -3 && cell.site.c >  this.state.minX +3 && cell.site.c <  this.state.maxX -3) {
                    var point = this.state.points[indexCells];
                    var polygon_points = [];
                    
                    if(cell.halfedges.length > 0) {
                        geojsonObjects.push(this.cellToGeoJSON(cell.site.voronoiId));
                        if(cell.halfedges.length == 11) {
                            this.drawPolygon(cell.site.voronoiId);
                        }
                    } else {
                        L.marker([cell.site.lat, cell.site.lng]).addTo(this.map);
                    }
                }
            }.bind(this));
            //console.timeEnd('calculate');
    
            this.gjLayer = L.geoJson(geojsonObjects, {
                //feature.geometry.properties.id
                style: function(feature) {
    
                    var fill = false;
                    var owner = feature.geometry.properties.owner;
                    if(owner == "player.id") {
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
            }).addTo(this.map);
            //console.timeEnd('draw');
        }.bind(this), 1);        
    }

    drawPolygon(id) {  
            var c = this.state.diagram.cells[id];
            var point = this.state.points[id];
            var polygon_points = [];
        
            var p0 = new Object();
            var equalVa = c.halfedges[0].edge.va.x == c.halfedges[1].edge.va.x && c.halfedges[0].edge.va.y == c.halfedges[1].edge.va.y;
            var equalVb = c.halfedges[0].edge.va.x == c.halfedges[1].edge.vb.x && c.halfedges[0].edge.va.y == c.halfedges[1].edge.vb.y;
            if(equalVa || equalVb) {
                p0.x = c.halfedges[0].edge.va.x;
                p0.y = c.halfedges[0].edge.va.y;
                p0.lat = c.halfedges[0].edge.va.y*point.dLat+this.state.origo.vLat;
                p0.lng = c.halfedges[0].edge.va.x*point.dLng+this.state.origo.vLng;
            } else {
                p0.x = c.halfedges[0].edge.vb.x;
                p0.y = c.halfedges[0].edge.vb.y;
                p0.lat = c.halfedges[0].edge.vb.y*point.dLat+this.state.origo.vLat;
                p0.lng = c.halfedges[0].edge.vb.x*point.dLng+this.state.origo.vLng;
            }
                polygon_points.push(p0);
        
            for(var i=1; i<c.halfedges.length; i++) {
                if(c.halfedges[i].edge.va.x != polygon_points[i-1].x || c.halfedges[i].edge.va.y != polygon_points[i-1].y) {
                    var p = new Object();
                    p.x = c.halfedges[i].edge.va.x;
                    p.y = c.halfedges[i].edge.va.y;
                    p.lat = c.halfedges[i].edge.va.y*point.dLat+this.state.origo.vLat;
                    p.lng = c.halfedges[i].edge.va.x*point.dLng+this.state.origo.vLng;
                    polygon_points.push(p);
                } else {
                    var p = new Object();
                    p.x = c.halfedges[i].edge.vb.x;
                    p.y = c.halfedges[i].edge.vb.y;
                    p.lat = c.halfedges[i].edge.vb.y*point.dLat+this.state.origo.vLat;
                    p.lng = c.halfedges[i].edge.vb.x*point.dLng+this.state.origo.vLng;
                    polygon_points.push(p);
                }
        
            }
            var pps = [];
            for(var i=0; i<c.halfedges.length; i++) {
                pps.push([polygon_points[i].lat,polygon_points[i].lng]);
            }
            pps.push([polygon_points[0].lat,polygon_points[0].lng]);
            
            var polygon = L.polygon(pps,{
                                color: "red",
                                fillColor: "red", //this.getRandomColor(),
                                weight: 0.5,
                                fill: "red",
                                opacity: 1.0,
                                fillOpacity: 0.20,
                                smoothFactor: 0
                            }).addTo(this.map).bindPopup("" + id);
            
    }

    cellToGeoJSON(id) {
        var c = this.state.diagram.cells[id];
        var point = this.state.points[id];
        var polygon_points = [];
    
        var p0 = new Object();
    
        var equalVa = c.halfedges[0].edge.va.x == c.halfedges[1].edge.va.x && c.halfedges[0].edge.va.y == c.halfedges[1].edge.va.y;
        var equalVb = c.halfedges[0].edge.va.x == c.halfedges[1].edge.vb.x && c.halfedges[0].edge.va.y == c.halfedges[1].edge.vb.y;
        if(equalVa || equalVb) {
            p0.x = c.halfedges[0].edge.va.x;
            p0.y = c.halfedges[0].edge.va.y;
            p0.lat = c.halfedges[0].edge.va.y*point.dLat+this.state.origo.vLat;
            p0.lng = c.halfedges[0].edge.va.x*point.dLng+this.state.origo.vLng;
        } else {
            p0.x = c.halfedges[0].edge.vb.x;
            p0.y = c.halfedges[0].edge.vb.y;
            p0.lat = c.halfedges[0].edge.vb.y*point.dLat+this.state.origo.vLat;
            p0.lng = c.halfedges[0].edge.vb.x*point.dLng+this.state.origo.vLng;
        }
            polygon_points.push(p0);
    
        for(var i=1; i<c.halfedges.length; i++) {
            if(c.halfedges[i].edge.va.x != polygon_points[i-1].x || c.halfedges[i].edge.va.y != polygon_points[i-1].y) {
                var p = new Object();
                p.x = c.halfedges[i].edge.va.x;
                p.y = c.halfedges[i].edge.va.y;
                p.lat = c.halfedges[i].edge.va.y*point.dLat+this.state.origo.vLat;
                p.lng = c.halfedges[i].edge.va.x*point.dLng+this.state.origo.vLng;
                polygon_points.push(p);
            } else {
                var p = new Object();
                p.x = c.halfedges[i].edge.vb.x;
                p.y = c.halfedges[i].edge.vb.y;
                p.lat = c.halfedges[i].edge.vb.y*point.dLat+this.state.origo.vLat;
                p.lng = c.halfedges[i].edge.vb.x*point.dLng+this.state.origo.vLng;
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
    
    getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}