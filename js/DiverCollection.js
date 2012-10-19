function DiverCollection(container) {
    this.diverIndex = 0;
    this.container = container;
    this.divers = [];
}
DiverCollection.prototype.add = function() {
    this.divers.push(new Diver(this.container, ++this.diverIndex));
};
DiverCollection.prototype.remove = function(diver) {
    this.divers = Utils.removeFromArray(this.divers, diver);
    diver.destroy();
};
DiverCollection.prototype.listFreeDivers = function() {
    return this.divers.filter(function(diver) {
        return (diver.stars.length + diver.plannedStars.length < 2) && typeof diver.balloonEl === "undefined";
    });
};
DiverCollection.prototype.inVisibleRange = function(x, star) {
    return Math.abs(x - star.getXCoordinate()) < this.container.offsetWidth/3;
};
DiverCollection.prototype.checkVisibilityRange = function(star) {
    var maxRange = Number.POSITIVE_INFINITY;
    this.divers.forEach(function(diver) {
        maxRange = Math.min(maxRange, diver.getXCoordinate());
    });
    return this.inVisibleRange(maxRange, star);
};
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