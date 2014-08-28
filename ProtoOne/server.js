var http = require('http');
var express = require('express');
var app = express();

var Module1 = require('./public/module1');
var module1 = new Module1();

// инициализация memcached
var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211');
var lifetime = 86400; //24hrs

// обработчик файлов html будет шаблонизатор ejs
app.engine('html', require('ejs').renderFile);

// обработка главной, возвращает случайное число
app.get('/', function(req, res){
    res.end(module1.getRandomInt(0, 1000).toString());
});

// отображаем index.html
app.get('/client', function(req, res){
    res.render('index.html');
});

// запросить значение переменной из кеша
app.get('/getcache', function(req, res){
    memcached.get(req.query.name, function( err, result ){
        if( err ) throw (err);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(''+result);
        res.end();
    });
});

// установить значение переменной в кеше
app.get('/setcache', function(req, res){
    memcached.set(req.query.name, req.query.value, lifetime, function( err, result ){
        if( err ) throw (err);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(''+result);
        res.end();
    });
});

// статические данные и модули для подгрузки на клиент
app.use("/public", express.static(__dirname + '/public'));

// запускаем http сервер
http.createServer(app).listen(1325);
console.log('Server running at http://127.0.0.1:1325/');