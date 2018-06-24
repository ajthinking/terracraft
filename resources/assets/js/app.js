require('./bootstrap');
import TileMap from './TileMap';
import Config from './Config';

import fontawesome from '@fortawesome/fontawesome'
import regular from '@fortawesome/fontawesome-free-regular'
import solid from '@fortawesome/fontawesome-free-solid'
import brands from '@fortawesome/fontawesome-free-brands'

fontawesome.library.add(regular)
fontawesome.library.add(solid)
fontawesome.library.add(brands)

$(document).ready(function(){
    var t = new TileMap();
});


