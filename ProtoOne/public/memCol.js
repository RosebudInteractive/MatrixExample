if (typeof define !== 'function') {
    var define = require('amdefine')(module);
    var Class = require('class.extend');
}

define(
	[],
	function() {
		var MemCol = Class.extend({
		
			log: [],
		
			init: function(name){
				this.name = name;
			}

		});
		return MemCol;
	}
);