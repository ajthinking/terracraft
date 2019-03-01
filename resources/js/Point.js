import Config from './Config'
import Geometry from './Geometry'

export default class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.id = Point.XYtoId(x,y);
        var latLng = Geometry.XYtoLatLng(x,y);
        this.lat = latLng.lat;
        this.lng = latLng.lng;
        Math.seedrandom(this.id);
        this.xRandNbr = Math.random();
        this.yRandNbr = Math.random();
        this.vX = this.x + this.xRandNbr * Config.offset;
        this.vY = this.y + this.yRandNbr * Config.offset;
        var vLatLng = Geometry.XYtoLatLng(this.vX,this.vY);
        this.vLat = vLatLng.lat;
        this.vLng = vLatLng.lng;
        this.dLat = Geometry.dLat();
        this.dLng = Geometry.dLng(this.vLat);
        return this;
    }

    static XYtoId(x,y) {
        return y + x*10000000;
    }
}