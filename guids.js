
var N = 1000000;

var setka = [1000, 10000, 50000, 100000];
for (var s=0; s<setka.length; s++){

    var ObjectHolder = {};
    var GuidsArr = [];
    var Arr2 = [];
    var Arr3 = [];
    var M = setka[s];

    // генерируем массив объектов и сохраняем гуиды
    for (var i=0; i<M; i++) {
        var g = guid();
        ObjectHolder[g] = {Counter:0};
        GuidsArr.push(g);
    }

    // формируем массив с N гиудами
    for (var i=0; i<N; i++)
        Arr2.push(GuidsArr[rand(0, GuidsArr.length-1)]);

    // замеряем 
    console.time('time1 M='+ M);
    for (var i=0; i<N; i++)
        ObjectHolder[Arr2[i]].Counter++;
    console.timeEnd('time1 M='+ M);

    // формируем массив с N объектами
    for (var i=0; i<N; i++)
        Arr3.push(ObjectHolder[GuidsArr[rand(0, GuidsArr.length-1)]]);

    console.time('time2 M='+ M);
    for (var i=0; i<N; i++)
        Arr3[i].Counter++;
    console.timeEnd('time2 M='+ M);
}






function guid() {

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    return s4() + s4() +'-'+ s4()  +'-'+ s4() +'-'+
        s4() +'-'+ s4() + s4() + s4();
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}