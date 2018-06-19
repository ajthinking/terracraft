import Config from './Config'

const d = Config.d;

export default class Geometry {
    
    static latLngToXY(p) {
        var dLat = 1/111111;
        var dLng = 1/(111111*Geometry.cos(p.lat));
        var x = p.lng/(this.d*dLng);
        var y = p.lat/(this.d*dLat);
        return [x,y];
    }

    static cos(a) {
        return Math.cos(a*Math.PI / 180);
    }

    static latLngToXY(p) {
        var dLat = 1/111111;
        var dLng = 1/(111111*Geometry.cos(p.lat));
        var x = p.lng/(d*dLng);
        var y = p.lat/(d*dLat);
        return [x,y];
    }

    static dLngFromY(y) {
        var dLat = 1/111111;
        var lat = y*dLat*d;
        return 1/(111111*Geometry.cos(lat));
    }
    
    static XYtoLatLng(x,y) {
        var dLat = 1/111111;
        var lat = y*(d*dLat);
        var dLng  = 1/(111111*Geometry.cos(lat));
        var lng = x*d*dLng;
        return L.latLng(lat,lng);
    }
}