function Star(container, top, left) {
    this.container = container;
    var starEl = this.starEl = document.createElement('div');
    starEl.className = 'star star'+Math.floor(Math.random()*10+1);
    starEl.style.top = top+'px';
    starEl.style.left = left+'px';
    container.appendChild(starEl);
    this.fall();
};
Star.prototype.fallSpeed = 80/1000;
Star.prototype.fall = function() {
    var me = this,
        fallAnimation = window.setInterval(function() {
        var top = parseFloat(me.starEl.style.top)+me.fallSpeed*10;
        me.starEl.style.top = top+'px';
        if(top > me.container.offsetHeight-me.starEl.offsetHeight/2) {
            window.clearInterval(fallAnimation);
            this.falling = false;
        }
    }, 10);
    this.falling = true;
};
Star.prototype.moveTo = function(x, y) {
    this.starEl.style.left = x+'px';
    this.starEl.style.top = y+'px';
}
Star.prototype.getXCoordinate = function() {
    return parseFloat(this.starEl.style.left);
};
Star.prototype.getYCoordinate = function() {
    return parseFloat(this.starEl.style.top);
};