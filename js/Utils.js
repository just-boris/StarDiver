/*Object with some useful methods*/
var Utils = (function() {
    "use strict";
    return {
        getElementOffset: function(element) {
            var top = element.offsetTop, left = element.offsetLeft;
            while(element.offsetParent !== null) {
                element = element.offsetParent;
                top += element.offsetTop;
                left += element.offsetLeft;
            }
            return [top, left];
        },

        isIE: /(msie)/.test(window.navigator.userAgent.toLowerCase()),

        removeFromArray : function(array, item) {
            return array.filter(function(i) {return i !== item;});
        }

    };
})();