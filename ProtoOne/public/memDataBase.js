if (typeof define !== 'function') {
    var define = require('amdefine')(module);
    var Class = require('class.extend');
}

define(
	["./memCol"],
	function(MemCollection) {
		var MemDataBase = Class.extend({
		
			log: [],
		
			init: function(name){
				this.name = name;
			},
			
			// Новая коллекция
			newCol: function() {
				return new MemCollection("POPO");
			},
			
			// Удалить коллекцию
			delCol: function() {
			}

		});
		return MemDataBase;
	}
);