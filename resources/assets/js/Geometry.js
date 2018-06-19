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
    
}