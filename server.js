var path    = require('path');
var express = require('express');
var request = require('request');

var app     = express();

// var r = request.defaults({ 'proxy': "http://username:password@proxyaddress:8080" }); 
var r = request;

var port = 5000;
var host = "http://localhost";

(function () {
    process.argv.slice(2).forEach(function(item) {
        var key = item.split("=")[0].toLowerCase();
        switch (key) {
            case "host":
                host = item.split("=")[1];
                console.log("HOST =", host);
                break;

            case "port":
                port = parseInt(item.split("=")[1]);
                console.log("PORT =", port);
                break;
        }
    });
})();

app.post('/on', function(req, res) {
  r.post(host + '/on', function (error, response, body) {
    if (response)
      res.statusCode = response.statusCode;
    else 
      res.statusCode = 404;
    res.send(body);
    res.end();
  })
});

app.post('/off', function(req, res) {
  r.post(host + '/off', function (error, response, body) {
    if (response)
      res.statusCode = response.statusCode;
    else 
      res.statusCode = 404;
    res.send(body);
    res.end();
  })
});

app.get('/state', function(req, res) {
  r.get(host + '/state', function (error, response, body) {
    if (response)
      res.statusCode = response.statusCode;
    else 
      res.statusCode = 404;
    res.send(body);
    res.end();
  })
})

app.use(express.static(path.join(__dirname, 'static')));

app.listen(port);
console.log("App started, listening port ", port);