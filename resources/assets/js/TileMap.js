import Config from './Config'
import Geometry from './Geometry'
import Point from './Point'
import State from './State'
import Style from './Style'

export default class TileMap {
    constructor() {
        this.map = L.map('map', {
            zoomControl:false,
            renderer: L.svg({
                padding: 0.5
            })
        }).setView(Config.startPoint, Config.startZoom);

        this.state = new State(this.map);
        this.addBaseMap()
        this.addEvents()
        this.load()   
        this.state.diagram = this.generateDiagram();

        this.tilesMap = {};
        
        this.tilesGeoJsonLayerGroup = L.geoJson(null,{
            onEachFeature: function (feature, layer) {
                this.tilesMap[feature.properties.id] = layer;
                layer.on('click', function() {
                    feature.properties.owner = "taken"
                    this.updateTile(feature);
                }.bind(this, feature));                
            }.bind(this),
            style: function(feature) {
                if(feature.geometry.properties.owner == "taken") {
                    return Style.ownTile()
                } else {
                    return Style.gridOnly()
                }
            }            
        }).addTo(this.map);        
    }

    newTile(newGeoJsonTile) {
        this.tilesGeoJsonLayerGroup.addData(newGeoJsonTile);
    }
    
    updateTile(updatedGeoJsonTile) {
        this.deleteTile(updatedGeoJsonTile);
        this.newTile(updatedGeoJsonTile);
    }
    
    deleteTile(tileToDelete) {
        var deletedTile = this.tilesMap[tileToDelete.properties.id];
        this.tilesGeoJsonLayerGroup.removeLayer(deletedTile);
    }

    addBaseMap() {
        L.tileLayer(Config.tileLayer, {
            maxZoom: Config.maxZoom,
            minZoom: Config.minZoom,
            attribution: 'i',
            id: 'examples.map-i875mjb7',
        }).addTo(this.map);
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
                 if(this.map.getZoom() > Config.drawDiagramUntilZoom) {  
                     this.state.setViewPort();                     
                     this.state.diagram = this.generateDiagram();
                     this.load();
                 } else {
                     // ZOOM IN TO DRAW!
                 }
             }
         }.bind(this));
    }

    load() {
        // Load tile data from server here
        $("body").trigger(this.loadedEvent);
        return;
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
        return voronoi.compute(this.state.sites, bbox);
    }

    drawDiagram() {    
        setTimeout(function() {
            var geojsonObjects = [];
            $.each(this.state.diagram.cells, function(indexCells, cell) {
                if(cell.site.r > this.state.minY +3 && cell.site.r < this.state.maxY -3 && cell.site.c > this.state.minX +3 && cell.site.c < this.state.maxX -3) {
                    var point = this.state.points[indexCells];
                    var polygon_points = [];
                    
                    if(cell.halfedges.length > 0) {
                        if(this.tilesMap[cell.site.id] === undefined) {
                            this.newTile(this.cellToGeoJSON(cell.site.voronoiId));
                        }
                    } else {
                        L.marker([cell.site.lat, cell.site.lng]).addTo(this.map);
                    }
                }
            }.bind(this));
            return;

            this.gjLayer = L.geoJson(geojsonObjects, {
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
                    //layer.bindPopup("Owner: " + feature.properties.owner + "<br> Land: 52 acres" + "<br> Strength: Weak" );
                    layer.on('click', function() {
                        alert("Clicked! Using custom callback!");
                    });
                }
            }) //.addTo(this.map);
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
                fillColor: "red",
                weight: 0.5,
                fill: "red",
                opacity: 1.0,
                fillOpacity: 0.20,
                smoothFactor: 0
            });
            
            polygon.on('click', function(feature, layer) {
                alert("Im clicked!");
            });
            
            polygon.addTo(this.map);
            
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
        var pps = []; // polygon points
        for(var i=0; i<c.halfedges.length; i++) {
            pps.push([polygon_points[i].lng,polygon_points[i].lat]);
        }
        pps.push([polygon_points[0].lng,polygon_points[0].lat]);
        var polygon = {
            "type": "Polygon",
            "properties": {
                id: c.site.id,
                owner: -1
            },
            "coordinates": [pps]
        };
    
        return polygon;
    
    }
}