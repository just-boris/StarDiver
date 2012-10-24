/*Utility script to preload images*/
(function(){
    "use strict";
    var preLoads = [
        'back.jpg',
        'add-diver-hover.png',
        'add-diver.png',
        'delete-diver-hover.png',
        'delete-diver.png',
        'fishes.png',
        'ship-load.png',
        'thought.png',
        'Diver-go-harvest.png',
        'Diver-go-home.png',
        'Diver-tros.png'
    ];
    for (var i = 1; i <= 10; i++){
        preLoads.push('tf-star' + i + '.png');
    }
    for (i = 0; i < preLoads.length; i++){
        var img = new Image();
        img.src = 'images/' + preLoads[i];
    }
})();