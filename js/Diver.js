function Diver(container) {
    this.container = container;
    var diverEl = this.diverEl = document.createElement('div');
    diverEl.style.top = Water.BOAT_Y+'px';
    diverEl.style.left = Water.BOAT_X+'px';
    this.stars = []; this.plannedStars = [];
    container.appendChild(diverEl);
    this.setStateClass('dive')
    this.dive();
}
Diver.prototype.setStateClass = function(state) {
    var suffix;
    switch (state){
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
};
Diver.prototype.getXCoordinate = function() {
    return parseFloat(this.diverEl.style.left);
};
Diver.prototype.getYCoordinate = function() {
    return parseFloat(this.diverEl.style.top);
};
Diver.prototype.diveSpeed = 100/1000;
Diver.prototype.dive = function() {
    var me = this;
    me.moveY(me.container.offsetHeight-me.diverEl.offsetHeight, function() {
        me.setStateClass('goHarvest');
        //NOTE gotten stars will be removed from queue
        me.planStars(water.getNearStars(
            me.getXCoordinate(),
            2 - (me.plannedStars.length + me.stars.length)
        ));
        me.goHarvest();
    });
};
Diver.prototype.float = function() {
    var me = this;
    me.moveY(Water.BOAT_Y, function() {
        me.stars.forEach(function(star) {water.loadToBoat(star)});
        me.stars = [];
        me.dive();
    });
};
Diver.prototype.goHarvest = function() {
    var me = this;
    if(this.plannedStars.length > 1) {
        //sort by distance of this diver
        this.plannedStars.sort(Star.getDistanceComparator(this.getXCoordinate())).reverse();
    }
    if(this.plannedStars.length > 0) {
        me.moveX(this.plannedStars[0].getXCoordinate(), function() {
            me.grabStar(me.plannedStars[0]);
            if(me.stars.length < 2) {
                me.goHarvest();
            }
            else {
                me.goHome();
            }
        });
    }
    else {
        if(me.stars.length > 0) {
            me.goHome();
        }
        else {
            me.wait();
        }
    }
};
Diver.prototype.goHome = function() {
    var me = this;
    me.moveX(Water.BOAT_X, function() {
        me.float();
    });
};
Diver.prototype.wait = function() {
    var me = this,
        waiting = window.setInterval(function() {
        if(me.plannedStars.length > 0) {
            window.clearInterval(waiting);
            me.goHarvest();
        }
    }, 50);
};
Diver.prototype.planStars = function(stars) {
    var count = 0;
    while (count < stars.length) {
        stars[count].diver = this;
        this.plannedStars.push(stars[count]);
        count++;
    }
    return count;
};
Diver.prototype.grabStar = function(star) {
    var newStar = this.plannedStars.shift();
    if(star !== newStar) throw new Error('stars mismatch');
    this.stars.push(newStar);
    star.starEl.style.zIndex = (this.diverEl.style.zIndex || 0) + 1;
};
Diver.prototype.exploreNewStar = function() {
    var newStars = water.getNewStars(this.getXCoordinate());
    if(newStars.length > 0) {
        water.onFoundNewStars(newStars);
    }
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
            me.exploreNewStar();
            me.diverEl.style.left = left+'px';
            me.stars.forEach(function(star) {star.moveTo(left+direction*30, me.getYCoordinate()+10)});
            if(direction*(left - dest) > 0) {
                window.clearInterval(goAnimation);
                if(typeof callback === 'function') {
                    callback();
                }
            }
        }, FRAME_INTERVAL);
    me.setStateClass(direction === -1 ? 'goHarvest' : 'goHome');
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
    me.setStateClass('float');
};
