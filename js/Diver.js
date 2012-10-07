function Diver(container) {
    this.container = container;
    var diverEl = this.diverEl = document.createElement('div');
    diverEl.style.top = Water.BOAT_Y+'px';
    diverEl.style.left = Water.BOAT_X+'px';
    this.stars = [];
    container.appendChild(diverEl);
    this.dive();
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
Diver.prototype.diveSpeed = 100/1000;
Diver.prototype.dive = function() {
    var me = this;
    this.setState('dive');
    me.moveY(me.container.offsetHeight-me.diverEl.offsetHeight, function() {
        me.goHarvest();
    });
};
Diver.prototype.float = function() {
    var me = this;
    this.setState('float');
    me.moveY(Water.BOAT_Y, function() {
        me.stars.forEach(function(star) {water.loadToBoat(star)});
        me.stars = [];
        me.dive();
    });
};
Diver.prototype.goHarvest = function() {
    var star = water.getNearestStar(this.getXCoordinate(), this.getYCoordinate()),
        me = this;
    this.setState('goHarvest');
    if(typeof star !== 'undefined') {
        me.moveX(star.getXCoordinate(), function() {
            me.grabStar(star);
            me.goHome();
        });
        star.diver = this;
    }
    else {
        alert('no stars!')
    }
};
Diver.prototype.goHome = function() {
    var me = this;
    this.setState('goHome');
    me.moveX(Water.BOAT_X, function() {
        me.float();
    });
};
Diver.prototype.grabStar = function(star) {
    this.stars.push(star);
    star.starEl.style.zIndex = (this.diverEl.style.zIndex || 0) + 1;
};
Diver.prototype.moveX = function(dest, callback) {
    if(dest === this.getXCoordinate()) {
        return;
    }
    var me = this,
        FRAME_INTERVAL = 50,
        direction = dest < this.getXCoordinate() ? -1 : 1,
        goAnimation = window.setInterval(function() {
            var left = me.getXCoordinate()+direction*me.diveSpeed*FRAME_INTERVAL;
            me.diverEl.style.left = left+'px';
            me.stars.forEach(function(star) {star.moveTo(left+direction*30, me.getYCoordinate()+10)});
            if(direction*(left - dest) > 0) {
                window.clearInterval(goAnimation);
                if(typeof callback === 'function') {
                    callback();
                }
            }
        }, FRAME_INTERVAL);
};
Diver.prototype.moveY = function(dest, callback) {
    if(dest === this.getYCoordinate()) {
        return;
    }
    var me = this,
        FRAME_INTERVAL = 50,
        direction = dest < this.getYCoordinate() ? -1 : 1,
        goAnimation = window.setInterval(function() {
            var top = me.getYCoordinate()+direction*me.diveSpeed*FRAME_INTERVAL;
            me.diverEl.style.top = top+'px';
            me.stars.forEach(function(star) {star.moveTo(me.getXCoordinate()+5, top-15)});
            if(direction*(top - dest) > 0) {
                window.clearInterval(goAnimation);
                if(typeof callback === 'function') {
                    callback();
                }
            }
        }, FRAME_INTERVAL);
};
