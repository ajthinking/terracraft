export default class Style {

    static gridOnly() {
        return {
            color: "black",
            fillColor: "black",
            weight: 1.5,
            fill: true,
            opacity: 0.3,
            fillOpacity: 0.01,
            smoothFactor: 0
        }        
    }

    static ownTile() {
        return {
            color: "darkgreen",
            fillColor: "green",
            weight: 1.5,
            fill: true,
            opacity: 1.0,
            fillOpacity: 0.75,
            smoothFactor: 0
        }        
    }    
}