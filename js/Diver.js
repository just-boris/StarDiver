function Diver(container) {
    this.container = container;
    var diverEl = this.diverEl = document.createElement('div');
    diverEl.style.top = Water.BOAT_Y+'px';
    diverEl.style.left = Water.BOAT_X+'px';
    this._intervals = [];
    this.stars = []; this.plannedStars = [];
    this.airSupply = 20000; this.weight = 0;
    container.appendChild(diverEl);
    this.setStateClass('dive');
    this.dive();
}
Diver.prototype.destroy = function() {
    this._intervals.forEach(function(i) {window.clearInterval(i);});
    this.stars.forEach(function(star) {delete star.diver});
    this.plannedStars.forEach(function(star) {delete star.diver});
    this.diverEl.parentNode.removeChild(this.diverEl);
};
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
//TODO in production speed must be 20
Diver.prototype.diveSpeed = 20/1000;
Diver.prototype.baseAirConsume = 50/1000;
Diver.prototype.consumeAir = function(time) {
    this.airSupply -= (this.baseAirConsume + this.weight/1000)*time;
    if(this.airSupply < 0) {
        alert('я утонул!');
        water.removeDiver(this);
    }
};
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
        me.weight = 0;
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
            me.waitUnderwater();
        }
    }
};
Diver.prototype.goHome = function() {
    var me = this;
    me.moveX(Water.BOAT_X, function() {
        me.float();
    });
};
Diver.prototype.waitUnderwater = function() {
    var me = this,
        waiting = window.setInterval(function() {
            me.consumeAir(Diver.FRAME_INTERVAL);
            if(me.plannedStars.length > 0) {
                me._intervals = Utils.removeFromArray(me._intervals, waiting);
                window.clearInterval(waiting);
                me.goHarvest();
            }
    }, 50);
    this._intervals.push(waiting);
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
    this.weight += star.getWeight();
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
        direction = dest < this.getXCoordinate() ? -1 : 1,
        goAnimation = window.setInterval(function() {
            var left = me.getXCoordinate()+direction*me.diveSpeed*Diver.FRAME_INTERVAL;
            me.exploreNewStar();
            me.consumeAir(Diver.FRAME_INTERVAL);
            me.diverEl.style.left = left+'px';
            me.stars.forEach(function(star) {star.moveTo(left+direction*30, me.getYCoordinate()+10)});
            if(direction*(left - dest) > 0) {
                me._intervals = Utils.removeFromArray(me._intervals, goAnimation);
                window.clearInterval(goAnimation);
                if(typeof callback === 'function') {
                    callback();
                }
            }
        }, Diver.FRAME_INTERVAL);
    this._intervals.push(goAnimation);
    me.setStateClass(direction === -1 ? 'goHarvest' : 'goHome');
};
Diver.prototype.moveY = function(dest, callback) {
    if(dest === this.getYCoordinate()) {
        return;
    }
    var me = this,
        direction = dest < this.getYCoordinate() ? -1 : 1,
        goAnimation = window.setInterval(function() {
            var top = me.getYCoordinate()+direction*me.diveSpeed*Diver.FRAME_INTERVAL;
            me.consumeAir(Diver.FRAME_INTERVAL);
            me.diverEl.style.top = top+'px';
            me.stars.forEach(function(star) {star.moveTo(me.getXCoordinate()+5, top-15)});
            if(direction*(top - dest) > 0) {
                me._intervals = Utils.removeFromArray(me._intervals, goAnimation);
                window.clearInterval(goAnimation);
                if(typeof callback === 'function') {
                    callback();
                }
            }
        }, Diver.FRAME_INTERVAL);
        this._intervals.push(goAnimation);
    me.setStateClass('float');
};
Diver.FRAME_INTERVAL = 50;