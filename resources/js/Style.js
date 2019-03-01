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
            fillColor: "#94A73A",
            weight: 1.5,
            fill: true,
            opacity: 1.0,
            fillOpacity: 0.75,
            smoothFactor: 0
        }        
    }

    static enemyTile() {
        return {
            color: "darkred",
            fillColor: "#990000",
            weight: 1.5,
            fill: true,
            opacity: 1.0,
            fillOpacity: 0.75,
            smoothFactor: 0
        }        
    }    
}