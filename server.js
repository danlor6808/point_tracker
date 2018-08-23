var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/dist'));

app.get('/', function(req, res) {
    res.sendFile('dist/index.html', { root: __dirname });
});

app.listen(port, function() {
    console.log("listening on port : " + port);
    console.log(__dirname + '/dist');
});