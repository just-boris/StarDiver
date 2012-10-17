Water = function() {
    var me = this,
        diverIndex = 0,
        waterEl = this.waterEl = document.getElementById('water'),
        addDiverBtn = document.getElementById('addDiver'),
        deleteDiverBtn = document.getElementById('deleteDiver'),
        boatEl = this.boatEl = document.getElementById('boat');
        this.stars = []; this.divers = []; this.starQueue = []; this.rechargeQueue = [];
    waterEl.addEventListener('click', function(event) {
        var offset = Utils.getElementOffset(waterEl);
        if((event.pageY - offset[0]) < Water.BOTTOM_Y+22) {
            me.stars.push(new Star(
                waterEl,
                event.pageY - offset[0],
                event.pageX - offset[1]
            ));
        }
    }, false);
    addDiverBtn.addEventListener('click', function(event) {
        me.divers.push(new Diver(waterEl, ++diverIndex));
    }, false);
    deleteDiverBtn.addEventListener('click', function(event) {
        if(me.rechargeQueue.length > 1) {
            var queueObj = me.rechargeQueue[1];
            me.rechargeQueue = Utils.removeFromArray(me.rechargeQueue, queueObj);
            me.removeDiver(queueObj.diver);
        }

        /*else {
            var divers = me.listFreeDivers()
                .filter(function(diver) {
                    return diver.getYCoordinate() === Water.BOAT_Y;
                });
            if(divers.length > 0) {
                me.removeDiver(divers[0]);
            }
        }*/
    }, false);
};
Water.prototype.removeDiver = function(diver) {
    this.divers = Utils.removeFromArray(this.divers, diver);
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
        freeDivers = me.listFreeDivers();
    if(freeDivers.length > 0) {
        freeDivers.sort(function(diver1, diver2) {
            var dx1 = Math.abs(x - diver1.getXCoordinate()),
                dx2 = Math.abs(x - diver2.getXCoordinate()),
                result = dx1 - dx2;
            if(result === 0) {
                result = diver2.getYCoordinate() - diver1.getYCoordinate();
            }
            return result
        });
        freeDivers[0].planStars([star]);
    }
    else {
        if(me.starQueue.indexOf(star) === -1) {
            me.starQueue.push(star);
        }
    }
};
Water.prototype.listFreeDivers = function() {
    return this.divers.filter(function(diver) {
        return (diver.stars.length + diver.plannedStars.length < 2) && typeof diver.balloonEl !== "undefined";
    });
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
    var me = this,
        doRecharge = function() {
            window.setTimeout(function() {
                var cycle = me.rechargeQueue.shift();
                cycle.diver.airSupply = 20000;
                if(typeof cycle.callback === 'function') {
                    cycle.callback.apply(cycle.diver);
                }
                if(me.rechargeQueue.length > 0) {
                    doRecharge();
                }
            }, Water.rechargeDuration);
        };
    if(this.rechargeQueue.length === 1) {
        doRecharge();
    }
};
Water.rechargeDuration = 20/3*1000;
Water.BOAT_X = 620;
Water.BOAT_Y = 0;
Water.BOTTOM_X = 620;
Water.BOTTOM_Y = 427;

Water.prototype.version = "0.3.2";
window.addEventListener('load', function() {this.water = new Water();}, false);