var http = require('http');
var express = require('express');
var app = express();
var Module1 = require('./public/module1');
var module1 = new Module1();

// обработчик файлов html будет шаблонизатор ejs
app.engine('html', require('ejs').renderFile);

app.get('/', function(req, res){
    res.end(module1.getRandomInt(0, 1000).toString());
});
app.get('/client', function(req, res){
    res.render('index.html');
});
app.use("/public", express.static(__dirname + '/public'));

http.createServer(app).listen(1325);
console.log('Server running at http://127.0.0.1:1325/');