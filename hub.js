var Hub  = require('cluster-hub');
var cluster = require('cluster');
var hub = new Hub(cluster);
var fs = require('fs');
var http = require('http');
var numCPUs = require('os').cpus().length;

function calc(imax, jmax){
    var res = 0;
    for(var i=0;i<imax;i++)
        for(var j=0;j<jmax;j++)
            res += i*j;
    return res;
}

if (cluster.isMaster) {
    // in master process
    hub.on('calc', function (data, sender, callback) {
        console.log('in master calc');
        callback(null, calc(data.i, data.j));
    });

    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });

} else {


    //in worker process
    http.createServer(function(req, res) {
        if (req.url == '/calc') {
            hub.requestMaster('calc', {i: 100000, j:100000}, function (err, result) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.write(''+result);
                res.end();
            });
        } else {
            fs.readFile(__dirname+'/button2.html',function (err, data) {
                if (!err) {
                    res.writeHead(200, {'Content-Type': 'text/html', 'Content-Length': data.length});
                    res.write(data);
                    res.end();
                } else {
                    console.log('error open file');
                }
            });
        }
    }).listen(8000);
}