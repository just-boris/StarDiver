Water = function() {
    var me = this,
        waterEl = this.waterEl = document.getElementById('water'),
        addDiverBtn = document.getElementById('addDiver'),
        deleteDiverBtn = document.getElementById('deleteDiver'),
        boatEl = this.boatEl = document.getElementById('boat');
        this.stars = []; this.divers = []; this.starQueue = []; this.rechargeQueue = [];
    waterEl.addEventListener('click', function(event) {
        //ignore multi-clicks
        if (event.detail !== 1) return;
        var offset = Utils.getElementOffset(event.target);
        if((event.pageY - offset[0]) < Water.BOTTOM_Y+22) {
            me.stars.push(new Star(
                waterEl,
                event.pageY - offset[0],
                event.pageX - offset[1]
            ));
        }
    }, false);
    addDiverBtn.addEventListener('click', function(event) {
        if (event.detail !== 1) {
            return;
        }
        me.divers.push(new Diver(waterEl));
    }, false);
};
Water.prototype.removeDiver = function(diver) {
    Utils.removeFromArray(this.divers, diver);
    diver.destroy();
};
Water.prototype.getNearStars = function(x, count) {
    var me = this, visibleStars;
    if(this.starQueue.length > 0) {
        visibleStars = this.starQueue;
    }
    else {
        visibleStars = this.stars.filter(function(star) {
            return typeof star.diver === "undefined" &&
                star.falling === false &&
                me.checkVisibilityRange(star);
        });
    }
    visibleStars.sort(Star.getDistanceComparator(x));
    return visibleStars.splice(0, count);
};
Water.prototype.exploreNewStars = function(x) {
    var me = this,
        newStars = this.stars.filter(function(star) {
        return me.starQueue.indexOf(star) === -1 &&
            typeof star.diver === "undefined" &&
            star.falling === false &&
            me.inVisibleRange(x, star);
    });
    newStars.forEach(function(star) {me.onFoundNewStar(star)});
};
Water.prototype.inVisibleRange = function(x, star) {
    return Math.abs(x - star.getXCoordinate()) < this.waterEl.offsetWidth/3;
};
Water.prototype.checkVisibilityRange = function(star) {
    var maxRange = Number.POSITIVE_INFINITY;
    this.divers.forEach(function(diver) {
        maxRange = Math.min(maxRange, diver.getXCoordinate());
    });
    return this.inVisibleRange(maxRange, star);
};
Water.prototype.onFoundNewStar = function(star) {
    var me = this;
    if(!me.checkVisibilityRange(star)) return;
    var x = star.getXCoordinate(),
        freeDivers = me.divers.filter(function(diver) {
            return diver.stars.length + diver.plannedStars.length < 2;
        });
    if(freeDivers.length > 0) {
        freeDivers.sort(function(diver1, diver2) {
            return Math.abs(x - diver1.getXCoordinate()) - Math.abs(x - diver2.getXCoordinate());
        });
        freeDivers[0].planStars([star]);
    }
    else {
        if(me.starQueue.indexOf(star) === -1) {
            me.starQueue.push(star);
        }
    }
};
Water.prototype.loadToBoat = function(star) {
    this.boatEl.className = 'loaded';
    this.stars = this.stars.filter(function(item) {return item !== star});
    star.starEl.parentNode.removeChild(star.starEl);
};
Water.prototype.rechargeAir = function(diver, callback) {
    this.rechargeQueue.push({diver: diver, callback: callback});
    this.rechargeCycle();
};
Water.prototype.rechargeCycle = function() {
    var me = this;
    if(this.rechargeQueue.length === 1) {
        window.setTimeout(function() {
            var cycle = me.rechargeQueue.shift();
            cycle.diver.airSupply = 20000;
            if(typeof cycle.callback === 'function') {
                cycle.callback.apply(cycle.diver);
            }
            if(me.rechargeQueue.length > 0) {
                me.rechargeCycle();
            }
        }, Water.rechargeDuration);
    }
};
Water.rechargeDuration = 20/3*1000;
Water.BOAT_X = 620;
Water.BOAT_Y = 0;
Water.BOTTOM_X = 620;
Water.BOTTOM_Y = 427;

Water.prototype.version = "0.3.1";
window.addEventListener('load', function() {this.water = new Water();}, false);