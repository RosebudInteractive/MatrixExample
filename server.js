var cluster = require('cluster');
var http = require('http');
var fs = require('fs');
var numCPUs = require('os').cpus().length;

function calc(){
    var res = 0;
    for(var i=0;i<1000000;i++)
    for(var j=0;j<100000;j++)
        res += i*j;
    return res;
}

if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', function(worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });

} else {
    // Workers can share any TCP connection
    // In this case its a HTTP server
    http.createServer(function(req, res) {
        console.log(req.url + ' worker ' + cluster.worker.id + ' answer');
        if (req.url == '/calc') {
            var result = calc();
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write(''+result);
            res.end();
        } else {
            fs.readFile(__dirname+'/button.html',function (err, data) {
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