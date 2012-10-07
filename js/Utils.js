Utils = {
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

    isIE: /(msie)/.test(window.navigator.userAgent.toLowerCase())

};