var express = require('express');
var http = require('http');
var app = express();
var fs = require('fs');
var NodeCache = require("node-cache");
var matrixCache = new NodeCache({stdTTL: 3601});
var start = process.hrtime();

// static files
app.use("/static", express.static(__dirname + '/static'));



// request main
app.get('/', function(req, res){
    fs.readFile(__dirname+'/express.html',function (err, data){
		if (!err) {
        res.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
        res.write(data);
        res.end();
		} else {
			console.log('error open file');
		}
			
    });
});

// request /generate?size=10
app.get('/generate', function(req, res){
    elapsed_time("received request", true);
	var size = parseInt(req.query.size);
	var matrix = generateMatrix(size, size);
	writeMatrix(JSON.stringify(matrix));	
	res.write('Generated matrix ' +size +'x'+size);
	res.end();
	elapsed_time("end writeMatrix");
});


// request /multiply
app.get('/multiply', function(req, res){
	elapsed_time("received request", true);
	  var viewMatrix = function() {
		var matrix = matrixCache.get('matrix').matrix;
		var vector = generateMatrix(1, matrix.length)[0];
		var result = multMatrix(matrix, vector);
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.write(''+result);
		res.end();
		elapsed_time("end viewMatrix");
	  }

	if (!matrixCache.get('matrix').matrix) {
		matrixCache.on( "expired", function( key, value ){
			if (key == 'matrix')  {
				console.log('expired');
				readMatrix();
			}
		});
		matrixCache.on( "set", function( key, value ){
			if (key == 'matrix')  {
				viewMatrix();
			}
		});
		readMatrix();
	} else
		viewMatrix();
});

http.createServer(app).listen(1325);


function readMatrix() {
	fs.readFile(__dirname+'/matrix2.txt', 'utf8', function(err, data) {
		if (!err) {
			matrixCache.set('matrix', JSON.parse(data));
		} else {
			console.log('error open file');
		}
	});
}

// multiply vector on matrix
function multMatrix(matrix, vector) {
	var result = [];
	for(var i=0; i<matrix.length; i++) {
		var row = matrix[i];
		var resultRow = 0;
		for(var j=0; j<row.length; j++)
			resultRow += row[j] * parseInt(vector[i]);
		result.push(resultRow);
	}
	
	var resultSum = 0;
	for(var i=0; i<result.length; i++) {
		resultSum += result[i];
	}
	return resultSum;
}

function generateMatrix(size1, size2) {
	var result = [];
	for(var i=0; i<size1; i++) {
		var row = [];
		for(var j=0; j<size2; j++) {
			row[j] = randomInt(1, 100);
		}
		result[i] = row;
	}
	return result;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function writeMatrix(data) {
	fs.writeFile(__dirname+'/matrix2.txt', data, function(err, data) {
		if (err) throw err;		
	});
}

function elapsed_time(note, hide){
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    if (!hide)
		console.log(process.hrtime(start)[0] + "s " + elapsed.toFixed(precision) + "ms " + note); // print message + time
    start = process.hrtime(); // reset the timer
}


console.log('Server running at http://127.0.0.1:1325/');
