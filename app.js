var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('assets/data.json', 'utf8'));
var port = Number(process.env.PORT || 1989);

var app = express();
app.engine('.html', require('jade').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/build/html');
app.use(express.static(__dirname + '/build'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
	res.render('index');
});

app.get('/data', function(req, res) {
	res.send(obj);
})

var server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});
