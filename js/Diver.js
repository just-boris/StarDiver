function Diver(container) {
    this.container = container;
    var diverEl = this.diverEl = document.createElement('div');
    diverEl.style.top = Water.BOAT_Y+'px';
    diverEl.style.left = Water.BOAT_X+'px';
    this.stars = [];
    this.dive();
    container.appendChild(diverEl);
}
Diver.prototype.setState = function(state) {
    var suffix;
    this.state = state;
    switch (this.state){
        case 'float':
        case 'dive':
            suffix = 'Tros';
        break;
        case 'goHarvest':
            suffix = 'GoHarvest';
        break;
        case 'goHome':
            suffix = 'GoHome';
        break;
    }
    this.diverEl.className = 'diver diver'+suffix;
}
Diver.prototype.getXCoordinate = function() {
    return parseFloat(this.diverEl.style.left);
};
Diver.prototype.getYCoordinate = function() {
    return parseFloat(this.diverEl.style.top);
};
Diver.prototype.diveSpeed = 20/1000;
Diver.prototype.dive = function() {
    var me = this,
        diveAnimation = window.setInterval(function() {
            var top = parseFloat(me.diverEl.style.top)+me.diveSpeed*50;
            me.diverEl.style.top = top.toFixed(4)+'px';
            if(top > me.container.offsetHeight-me.diverEl.offsetHeight) {
                window.clearInterval(diveAnimation);
                me.goHarvest();
            }
        }, 50);
    this.setState('dive');
}
Diver.prototype.float = function() {
    var me = this,
        floatAnimation = window.setInterval(function() {
            var top = parseFloat(me.diverEl.style.top)-me.diveSpeed*50;
            me.diverEl.style.top = top+'px';
            if(top < Water.BOAT_Y) {
                window.clearInterval(floatAnimation);
                alert('dive complete!');
            }
        }, 50);
    this.setState('float');
}
Diver.prototype.goHarvest = function() {
    var star = water.getNearestStar(this.getXCoordinate(), this.getYCoordinate()),
        me = this;
    if(typeof star !== 'undefined') {
        var goAnimation = window.setInterval(function() {
            var left = parseFloat(me.diverEl.style.left)-me.diveSpeed*50;
            me.diverEl.style.left = left+'px';
            if(left < star.getXCoordinate()) {
                window.clearInterval(goAnimation);
                me.goHome();
            }
        }, 50);
        this.stars.push(star);
        star.diver = this;
    }
    this.setState('goHarvest');
}
Diver.prototype.goHome = function() {
    var me = this,
        goAnimation = window.setInterval(function() {
        var left = parseFloat(me.diverEl.style.left)+me.diveSpeed*50;
        me.diverEl.style.left = left+'px';
        if(left > Water.BOAT_X) {
            window.clearInterval(goAnimation);
            me.float();
        }
    }, 50);
    this.setState('goHome');
}
