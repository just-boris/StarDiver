var Utils = (function() {
    "use strict";
    return {
        getScrollTop: function() {
            if(typeof window.pageYOffset !== 'undefined'){
                //most browsers
                return window.pageYOffset;
            }
            else {
                /*Internet Explorer dniwe ebanoe*/
                var B= document.body; //IE 'quirks'
                var D= document.documentElement; //IE with doctype
                D= (D.clientHeight)? D: B;
                return D.scrollTop;
            }
        },

        getScrollLeft: function() {
            if(typeof window.pageXOffset !== 'undefined'){
                //most browsers
                return window.pageXOffset;
            }
            else {
                /*Internet Explorer dniwe ebanoe*/
                var B= document.body; //IE 'quirks'
                var D= document.documentElement; //IE with doctype
                D= (D.clientHeight)? D: B;
                return D.scrollLeft;
            }
        },

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