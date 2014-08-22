var fs = require('fs');
var http = require('http');
var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211');
var lifetime = 86400; //24hrs

http.createServer(function(req, res) {
    var query = require('url').parse(req.url).query;
    var queryParse = require('querystring').parse(query);

    console.log(queryParse);
    if (queryParse.act && queryParse.act == 'getcache') {
        memcached.get(queryParse.name, function( err, result ){
            if( err ) throw (err);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(''+result);
            res.end();
        });
    } else if (queryParse.act && queryParse.act == 'setcache') {
        memcached.set(queryParse.name, queryParse.value, lifetime, function( err, result ){
            if( err ) throw (err);
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(''+result);
            res.end();
        });
    } else {
        fs.readFile(__dirname+'/memcache.html',function (err, data) {
            if (err) throw (err);
            res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': data.length});
            res.write(data);
            res.end();
        });
    }
}).listen(8000);
console.log('Started in http://127.0.0.1:8000');
