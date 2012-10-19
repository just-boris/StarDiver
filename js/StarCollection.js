function StarCollection(container) {
    this.container = container;
    this.starQueue = [];
    this.stars = [];
}
StarCollection.prototype.add = function(y, x) {
    this.stars.push(new Star(this.container, y, x))
};
StarCollection.prototype.remove = function(star) {
    Utils.removeFromArray(this.stars, star);
    star.starEl.parentNode.removeChild(star.starEl);
};
StarCollection.prototype.getFreeStars = function() {
    return this.stars.filter(function(star) {
        return typeof star.diver === "undefined"
    });
};
StarCollection.orderByDist = function(array, x) {
    return array.sort(StarCollection.getDistanceComparator(x));
};
StarCollection.getDistanceComparator = function(x) {
    return function(star1, star2) {
        return Math.abs(x - star1.getXCoordinate()) - Math.abs(x - star2.getXCoordinate());
    }
};