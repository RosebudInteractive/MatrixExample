if (typeof define !== 'function') {
    var define = require('amdefine')(module);
    var Class = require('class.extend');
}

define(function() {
    var MemObj = Class.extend({
	
		log: [],
	
        init: function(name){
            this.name = name;
        }

    });
    return MemObj;
});