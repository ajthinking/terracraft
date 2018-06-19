import Config from './Config'

export default class Geometry {
    
    static latLngToXY(p) {
        var dLat = 1/111111;
        var dLng = 1/(111111*Geometry.cos(p.lat));
        var x = p.lng/(this.Config.d*dLng);
        var y = p.lat/(this.Config.d*dLat);
        return [x,y];
    }

    static cos(a) {
        return Math.cos(a*Math.PI / 180);
    }

    static latLngToXY(p) {
        var dLat = 1/111111;
        var dLng = 1/(111111*Geometry.cos(p.lat));
        var x = p.lng/(Config.d*dLng);
        var y = p.lat/(Config.d*dLat);
        return [x,y];
    }

    static dLngFromY(y) {
        var dLat = 1/111111;
        var lat = y*dLat*Config.d;
        return 1/(111111*Geometry.cos(lat));
    }
    
    static XYtoLatLng(x,y) {
        var dLat = 1/111111;
        var lat = y*(Config.d*dLat);
        var dLng  = 1/(111111*Geometry.cos(lat));
        var lng = x*Config.d*dLng;
        return L.latLng(lat,lng);
    }
}