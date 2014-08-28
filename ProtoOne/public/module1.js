if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(['./module2'], function(Module2) {

    function Module1(){
    }

    Module1.prototype.getRandomInt = function(low, high){
        var module2 = new Module2();
        var randFloat = module2.getRandomFloat(low, high);
        return Math.floor(randFloat);
    }

    return Module1;
});