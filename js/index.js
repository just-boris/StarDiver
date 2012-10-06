Water = function() {

    var me = this,
        waterEl = document.getElementById('water'),
        addDiverBtn = document.getElementById('addDiver'),
        deleteDiverBtn = document.getElementById('deleteDiver');
        this.stars = []; this.divers = [];
    waterEl.addEventListener('click', function(event) {
        console.log([event.offsetY, event.offsetX])
        if (event.detail !== 1) return;
        me.stars.push(new Star(
            waterEl,
            event.offsetY,
            event.offsetX
        ));
    }, false);
    addDiverBtn.addEventListener('click', function(event) {
        if (event.detail !== 1) {
            console.log('something went wrong');
            return;
        }
        me.divers.push(new Diver(waterEl));
    }, false);
};
Water.prototype.getNearestStar = function(x, y) {
    var minDist, star;
    this.stars.forEach(function(item, index, items) {
        var dist = Math.abs(x - item.getXCoordinate());
        if(!(minDist < Math.abs(dist))) {
            minDist = dist;
            star = item;
        }
    });
    return star;
};
Water.BOAT_X = 620;
Water.BOAT_Y = 0;

window.addEventListener('load', function() {this.water = new Water();}, false);