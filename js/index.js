Water = function() {

    var me = this,
        waterEl = this.waterEl = document.getElementById('water'),
        addDiverBtn = document.getElementById('addDiver'),
        deleteDiverBtn = document.getElementById('deleteDiver'),
        boatEl = this.boatEl = document.getElementById('boat');
        this.stars = []; this.divers = [];
    waterEl.addEventListener('click', function(event) {
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
        if(!(minDist < Math.abs(dist)) && typeof item.diver === 'undefined') {
            minDist = dist;
            star = item;
        }
    });
    if(typeof star !== 'undefined' && this.checkVisibilityRange(star)) {
        return star;
    }
};
Water.prototype.checkVisibilityRange = function(star) {
    var maxRange = 0;
    this.divers.forEach(function(diver) {
        maxRange = Math.max(maxRange, diver.getXCoordinate());
    });
    return (maxRange - star.getXCoordinate()) < this.waterEl.offsetWidth/3;

};
Water.prototype.loadToBoat = function(star) {
    this.boatEl.className = 'loaded';
    this.stars = this.stars.filter(function(item) {return item !== star});
    star.starEl.parentNode.removeChild(star.starEl);
};
Water.BOAT_X = 620;
Water.BOAT_Y = 0;

window.addEventListener('load', function() {this.water = new Water();}, false);