var fs = require('fs');
var http = require('http');
var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211');
var lifetime = 86400; //24hrs

var express = require('express');
var app = express();
var engines = require('consolidate');
app.engine('html', engines.hogan);

app.get('/getcache', function(req, res){
    memcached.get(req.query.name, function( err, result ){
        if( err ) throw (err);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(''+result);
        res.end();
    });
});

app.get('/setcache', function(req, res){
    memcached.set(req.query.name, req.query.value, lifetime, function( err, result ){
        if( err ) throw (err);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write(''+result);
        res.end();
    });
});

app.get('/', function(req, res){
    res.render(__dirname+'/memcache.html');
});

http.createServer(app).listen(8000);
console.log('Started in http://127.0.0.1:8000');
