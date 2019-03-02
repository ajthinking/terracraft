import Config from './Config'

export default class Geometry {
    
    static latLngToXY(p) {
        var x = p.lng/(this.Config.d*Geometry.dLng(p.lat));
        var y = p.lat/(this.Config.d*Geometry.dLat());
        return [x,y];
    }

    static cos(a) {
        return Math.cos(a*Math.PI / 180);
    }

    static latLngToXY(p) {
        var x = p.lng/(Config.d*Geometry.dLng(p.lat));
        var y = p.lat/(Config.d*Geometry.dLat());
        return [x,y];
    }

    static dLngFromY(y) {
        var lat = y*Geometry.dLat()*Config.d;
        return 1/(111111*Geometry.cos(lat));
    }
    
    static XYtoLatLng(x,y) {
        var lat = y*(Config.d*Geometry.dLat());
        var lng = x*Config.d*Geometry.dLng(lat);
        return L.latLng(lat,lng);
    }

    static dLat() {
        return 1/(111111);
    }

    static dLng(lat) {
        return 1/(111111*Geometry.cos(lat));
    }

    static cellToGeoJSON(cell, origo, owner) {
        var c = cell;
        var point = cell.site.point;
        var polygon_points = [];
    
        var p0 = new Object();
    
        var equalVa = c.halfedges[0].edge.va.x == c.halfedges[1].edge.va.x && c.halfedges[0].edge.va.y == c.halfedges[1].edge.va.y;
        var equalVb = c.halfedges[0].edge.va.x == c.halfedges[1].edge.vb.x && c.halfedges[0].edge.va.y == c.halfedges[1].edge.vb.y;
        if(equalVa || equalVb) {
            p0.x = c.halfedges[0].edge.va.x;
            p0.y = c.halfedges[0].edge.va.y;
            p0.lat = c.halfedges[0].edge.va.y*point.dLat+origo.vLat;
            p0.lng = c.halfedges[0].edge.va.x*point.dLng+origo.vLng;
        } else {
            p0.x = c.halfedges[0].edge.vb.x;
            p0.y = c.halfedges[0].edge.vb.y;
            p0.lat = c.halfedges[0].edge.vb.y*point.dLat+origo.vLat;
            p0.lng = c.halfedges[0].edge.vb.x*point.dLng+origo.vLng;
        }
            polygon_points.push(p0);
    
        for(var i=1; i<c.halfedges.length; i++) {
            if(c.halfedges[i].edge.va.x != polygon_points[i-1].x || c.halfedges[i].edge.va.y != polygon_points[i-1].y) {
                var p = new Object();
                p.x = c.halfedges[i].edge.va.x;
                p.y = c.halfedges[i].edge.va.y;
                p.lat = c.halfedges[i].edge.va.y*point.dLat+origo.vLat;
                p.lng = c.halfedges[i].edge.va.x*point.dLng+origo.vLng;
                polygon_points.push(p);
            } else {
                var p = new Object();
                p.x = c.halfedges[i].edge.vb.x;
                p.y = c.halfedges[i].edge.vb.y;
                p.lat = c.halfedges[i].edge.vb.y*point.dLat+origo.vLat;
                p.lng = c.halfedges[i].edge.vb.x*point.dLng+origo.vLng;
                polygon_points.push(p);
            }
    
        }
        return {
            "type": "Polygon",
            "properties": {
                id: c.site.id,
                owner: owner
            },
            "coordinates": [
                [
                    ...c.halfedges.map((v, index) => {
                        return [polygon_points[index].lng,polygon_points[index].lat]
                    }),
                    [polygon_points[0].lng,polygon_points[0].lat]
                ]
            ]
        };
    }   

}