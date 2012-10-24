/* Global class to combining all components together
 * It creates and deletes divers and stars,
 * tells about new stars, fills scuba
 * and includes some global constants
 */
/*global StarCollection: true, DiverCollection: true, Utils: true*/
(function() {"use strict";
var Water = window.Water = function() {
    var me = this,
        waterEl = this.waterEl = document.getElementById('water'),
        addDiverBtn = document.getElementById('addDiver'),
        deleteDiverBtn = document.getElementById('deleteDiver'),
        boatEl = this.boatEl = document.getElementById('boat');
    this.diverCollection = new DiverCollection(waterEl);
    this.starCollection = new StarCollection(waterEl);
    this.starQueue = []; this.rechargeQueue = [];
    waterEl.addEventListener('click', function(event) {
        var offset = Utils.getElementOffset(waterEl);
        if((event.pageY - offset[0]) < Water.BOTTOM_Y+22) {
            me.starCollection.add(event.pageY - offset[0], event.pageX - offset[1]);
        }
    }, false);
    addDiverBtn.addEventListener('click', function(event) {
        me.diverCollection.add();
    }, false);
    deleteDiverBtn.addEventListener('click', function(event) {
        var queueObj;
        if(me.rechargeQueue.length > 1) {
            queueObj = me.rechargeQueue[1];
            me.rechargeQueue = Utils.removeFromArray(me.rechargeQueue, queueObj);
            me.diverCollection.remove(queueObj.diver);
        }
        else if(me.rechargeQueue.length === 1 ) {
            window.clearTimeout(me.rechargeTimeout);
            queueObj = me.rechargeQueue.shift();
            me.diverCollection.remove(queueObj.diver);
        }
    }, false);
};
Water.prototype.getExplorerFlag = function(diver) {
    if(typeof this.diverExplorer === 'undefined') {
        this.diverExplorer = diver;
        return true;
    }
    else {
        return false;
    }
};
Water.prototype.dropExplorerFlag = function(diver) {
    if(this.diverExplorer === diver) {
        delete this.diverExplorer;
    }
};
Water.prototype.getNearStars  = function(x, count) {
    var me = this,
        stars = this.starQueue;
    if(stars.length === 0) {
        stars = this.starCollection.getFreeStars().filter(function(star) {
            return me.diverCollection.checkVisibilityRange(star);
        });
    }
    stars = stars.filter(function(star) {
        return !star.falling || me.diverCollection.reachAfterFalling(x, Water.BOTTOM_Y, star);
    });
    stars.forEach(function(star) {me.starQueue = Utils.removeFromArray(me.starQueue, star);});
    StarCollection.orderByDist(stars, x);
    return stars.splice(0, count);
};
Water.prototype.exploreNewStars = function(x, y) {
    var me = this,
        newStars = this.starCollection.getFreeStars().filter(function(star) {
            return me.starQueue.indexOf(star) === -1 &&
                me.diverCollection.inVisibleRange(x, y, star);
        });
    newStars.forEach(function(star) {me.onFoundNewStar(star);});
};
Water.prototype.onFoundNewStar = function(star) {
    var me = this,
        freeDivers = this.diverCollection.listFreeDivers().filter(function(diver) {
            return me.diverCollection.reachAfterFalling(diver.getXCoordinate(), diver.getYCoordinate(), star);
        });
    if(freeDivers.length > 0) {
        freeDivers = DiverCollection.orderByDist(freeDivers, star.getXCoordinate());
        freeDivers[0].planStars([star]);
    }
    else if(!star.falling){
        if(me.starQueue.indexOf(star) === -1) {
            me.starQueue.push(star);
        }
    }
};
Water.prototype.loadToBoat = function(star) {
    this.boatEl.className = 'loaded';
    this.starCollection.remove(star);
};
Water.prototype.rechargeAir = function(diver, callback) {
    this.rechargeQueue.push({diver: diver, callback: callback});
    this.rechargeCycle();
};
Water.prototype.rechargeCycle = function() {
    var me = this,
        doRecharge = function() {
            me.rechargeTimeout = window.setTimeout(function() {
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
Water.WIDTH = 720;
Water.SEE_RANGE = Water.WIDTH/3;

Water.prototype.version = "0.4.3";
window.addEventListener('load', function() {this.water = new Water();}, false);
})();