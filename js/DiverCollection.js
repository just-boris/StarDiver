/*Object for diver management: counting, getting divers with different filters, checking diver's visible range*/
/*global Diver: true, Water: true, Star: true, Utils: true*/
(function() {"use strict";
var DiverCollection = window.DiverCollection = function(container) {
    this.diverIndex = 0;
    this.container = container;
    this.divers = [];
};
DiverCollection.prototype.add = function() {
    this.divers.push(new Diver(this.container, ++this.diverIndex));
};
DiverCollection.prototype.remove = function(diver) {
    this.divers = Utils.removeFromArray(this.divers, diver);
    diver.destroy();
};
DiverCollection.prototype.listFreeDivers = function() {
    return this.divers.filter(function(diver) {
        return diver.isFree();
    });
};
DiverCollection.prototype.inVisibleRange = function(x, y, star) {
    return Math.sqrt(Math.pow(x - star.getXCoordinate(), 2)+Math.pow(y - star.getYCoordinate(), 2)) < Water.SEE_RANGE;
};
DiverCollection.prototype.reachAfterFalling = function(x, y, star) {
    return (star.endPoint - star.getYCoordinate()) < Star.prototype.fallSpeed/Diver.prototype.diveSpeed*(x-star.getXCoordinate());
};
DiverCollection.prototype.checkVisibilityRange = function(star) {
    var me = this;
    return this.divers.some(function(diver) {
        return me.inVisibleRange(diver.getXCoordinate(), diver.getYCoordinate(),  star);
    });
};
//static sorter for divers
DiverCollection.orderByDist = function(array, x) {
    return array.sort(function(diver1, diver2) {
        var dx1 = Math.abs(x - diver1.getXCoordinate()),
            dx2 = Math.abs(x - diver2.getXCoordinate()),
            result = dx1 - dx2;
        if(result === 0) {
            result = diver2.getYCoordinate() - diver1.getYCoordinate();
        }
        return result;
    });
};
})();