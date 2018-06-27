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
        
        this.map.locate({
            setView: false,
            watch: true
        });
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
            id: 'examples.map-i875mjb7',
        }).addTo(this.map);
    }

    addEvents() {
        this.loadedEvent = jQuery.Event("loaded");
        $("body").bind("loaded", this.drawDiagram.bind(this));
        
        this.map.on('locationfound', function(e) {                        
            if(!this.userPos) {
                this.userPos = true;
                this.marker = L.marker(e.latlng).addTo(this.map);
                this.map.setView(e.latlng)
            }            
            this.marker.setLatLng(e.latlng);
        }.bind(this));
        
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
                this.state.sites.push({point: p, x: dMx, y: dMy, r: y, c: x, lat: p.vLat, lng: p.vLng, id: p.id});
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
                    var point = cell.point;
                    var polygon_points = [];
                    
                    if(cell.halfedges.length > 0) {
                        if(this.tilesMap[cell.site.id] === undefined) {
                            this.newTile(Geometry.cellToGeoJSON(cell, this.state.origo));
                        }
                    } else {
                        // Mark spot of faulty cells
                        L.marker([cell.site.lat, cell.site.lng]).addTo(this.map);
                    }
                }
            }.bind(this));
        }.bind(this), 1);        
    }
}