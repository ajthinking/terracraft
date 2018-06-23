import Config from './Config'
import Geometry from './Geometry'
import Point from './Point'

export default class State {
    constructor(map) {
        this.map = map
        this.setViewPort()
        this.sites = [];
        this.points = [];
    }

    setViewPort() {
        var minMaxXY = this.getMinMaxXY();
        this.minX = Math.round(minMaxXY[0]-Config.padding);
        this.maxX = Math.round(minMaxXY[1]+Config.padding);
        this.minY = Math.round(minMaxXY[2]-Config.padding);
        this.maxY = Math.round(minMaxXY[3]+Config.padding);
        
        var bounds = this.map.getBounds();
        this.minLat = bounds.getSouth();
        this.minLng = bounds.getWest();
        this.maxLat = bounds.getNorth();
        this.maxLng = bounds.getEast();
        this.origo = new Point(this.minX,this.minY);

        // These two are to be removed?
        this.sites = []; // basis for voronoi algorithm
        this.points = []; // 
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
}