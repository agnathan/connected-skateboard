// app.js - Defines the client program

// One data set for each dimension - X, Y and Z
var accDataSets = [new TimeSeries(), new TimeSeries(), new TimeSeries()];

function onLoad() {
    initHost();
//    initHost({mode: "random"});

}

var seriesOptions = [
    { strokeStyle: 'rgba(255, 0, 0, 1)', fillStyle: 'rgba(255, 0, 0, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(0, 255, 0, 1)', fillStyle: 'rgba(0, 255, 0, 0.1)', lineWidth: 3 },
    { strokeStyle: 'rgba(0, 128, 255, 1)', fillStyle: 'rgba(0, 0, 255, 0.1)', lineWidth: 3 }
];

function initHost(config) {

    // If mode == "random" then this demo will place random acceleration data
    // on the chart. Otherwise a websocket is opened and an accelerometer is read
    if ( typeof config !== 'undefined' && config.mode == "random") {
        var now = new Date().getTime();
        for (var t = now - 1000 * 50; t <= now; t += 1000) {
            addRandomValueToDataSets(t);
        }
        // Every second, simulate a new set of readings being taken from each CPU.
        setInterval(function() {
            addRandomValueToDataSets(new Date().getTime());
        }, 1000);
    } else {
        var socket = io();
        socket.on('update', function (data) {
            console.log(data);
            addValues(new Date().getTime(), data);
        });
    }

    // Initialize the Smoothie Chart and Build the timeline
    var timeline = new SmoothieChart({ millisPerPixel: 20, grid: { strokeStyle: '#555555', lineWidth: 1, millisPerLine: 1000, verticalSections: 4 }});
    for (var i = 0; i < accDataSets.length; i++) {
        timeline.addTimeSeries(accDataSets[i], seriesOptions[i]);
    }
    timeline.streamTo(document.getElementById('chart'), 500);
}

function addRandomValueToDataSets(time, values) {
    for (var i = 0; i < accDataSets.length; i++) {
        accDataSets[i].append(time, Math.random());
    }
}

function addValues(time, values) {
    accDataSets[0].append(time, values.X);
    accDataSets[1].append(time, values.Y);
    accDataSets[2].append(time, values.Z);
}
