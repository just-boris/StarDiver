Water = function() {

    var me = this,
        waterEl = this.waterEl = document.getElementById('water'),
        addDiverBtn = document.getElementById('addDiver'),
        deleteDiverBtn = document.getElementById('deleteDiver'),
        boatEl = this.boatEl = document.getElementById('boat');
        this.stars = []; this.divers = []; this.starQueue = [];
    waterEl.addEventListener('click', function(event) {
        //ignore multi-clicks
        if (event.detail !== 1) return;
        var offset = Utils.getElementOffset(event.target);
        me.stars.push(new Star(
            waterEl,
            event.clientY - offset[0],
            event.clientX - offset[1]
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
Water.prototype.getNearStars = function(x, count) {
    var me = this,
    visibleStars = this.stars.filter(function(star) {
        return typeof star.diver === "undefined" &&
            star.falling === false &&
            me.checkVisibilityRange(star);
    });
    /*if(visibleStars.length === 0) {
        visibleStars = this.starQueue;
    }*/
    visibleStars.sort(function(star1, star2) {
        return Math.abs(x - star1.getXCoordinate()) - Math.abs(x - star2.getXCoordinate());
    });
    return visibleStars.slice(0, count);
};
Water.prototype.getNewStars = function(x, count) {

};
Water.prototype.checkVisibilityRange = function(star) {
    var maxRange = Number.POSITIVE_INFINITY;
    this.divers.forEach(function(diver) {
        maxRange = Math.min(maxRange, diver.getXCoordinate());
    });
    return (maxRange - star.getXCoordinate()) < this.waterEl.offsetWidth/3;
};
Water.prototype.onFoundNewStar = function(star) {
    if(!this.checkVisibilityRange(star)) return;
    var x = star.getXCoordinate(),
        freeDivers = this.divers.filter(function(diver) {
        return diver.stars.length + diver.plannedStars.length < 2;
    });
    if(freeDivers.length > 0) {
        freeDivers.sort(function(diver1, diver2) {
            return Math.abs(x - diver1.getXCoordinate()) - Math.abs(x - diver2.getXCoordinate());
        });
        freeDivers[0].planStars([star]);
    }
    /*else {
        if(this.starQueue.indexOf(star) === -1) {
            this.starQueue.push(star);
        }
    }*/
};
Water.prototype.loadToBoat = function(star) {
    this.boatEl.className = 'loaded';
    this.stars = this.stars.filter(function(item) {return item !== star});
    star.starEl.parentNode.removeChild(star.starEl);
};
Water.BOAT_X = 620;
Water.BOAT_Y = 0;

window.addEventListener('load', function() {this.water = new Water();}, false);