var express = require('express');

var app     = express();

var failall = false;
var state = false;
var port  = 5000;
var latency = 1000;

(function () {
    process.argv.slice(2).forEach(function(item) {
        var key = item.split("=")[0].toLowerCase();
        switch (key) {
            case "failall":
                failall = (item.split("=")[1] === "true");
                console.log("failall =", failall)
                break;

            case "port":
                port = parseInt(item.split("=")[1]);
                console.log("PORT =", port)
                break;
        }
    });
})();

app.post('/on', function(req, res) {
    console.log("Switching ON");
    setTimeout(function() {
        if (!failall) {
            res.statusCode = 200;
            state = true;
            console.log("...OK");
        } else {
            res.statusCode = 500;
            console.log("...FAIL");
        }
        res.end();
    }, latency);
});

app.post('/off', function(req, res) {
    console.log("Switching OFF");
    setTimeout(function() {
        if (!failall) {
            res.statusCode = 200;
            state = false;
            console.log("...OK");
        } else {
            res.statusCode = 500;
            console.log("...FAIL");
        }
        res.end();
    }, latency);
});

app.get('/state', function(req, res) {
    console.log("State request");
    setTimeout(function() {
        //if (!failall) {
            res.statusCode = 200;
            var body = JSON.stringify({
                "state" : state 
            });
            res.send(body);
        //} else {
        //    res.statusCode = 500;
        //}
        res.end();
    }, latency);
})

app.listen(port);
console.log("App started, listening port ", port);