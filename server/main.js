var accelrCompassSensor = require('jsupm_lsm303');

// Instantiate LSM303 compass on I2C
var myAccelrCompass = new accelrCompassSensor.LSM303(1);

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static("../client")); //  "public" off of current is root

server.listen(3000);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    setInterval(function() {
        // Get the acceleration
	myAccelrCompass.getAcceleration();
	var accel = myAccelrCompass.getRawAccelData();


        var accX = myAccelrCompass.getAccelX();
        var accY = myAccelrCompass.getAccelY();
        var accZ = myAccelrCompass.getAccelZ();

        socket.emit('update', { X: accX, Y: accY, Z: accZ });
    }, 200);

    socket.on('my other event', function (data) {
        console.log(data);
    });
});
