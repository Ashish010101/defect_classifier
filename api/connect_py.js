var express = require('express');
var bodyParser = require('body-parser');
var spawn = require("child_process").spawn;
var fs = require('fs')
var app = express();
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
var port = process.env.PORT || 9090;
var router = express.Router();
router.get('/', function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	var process = spawn('python', ["python/bridge_point.py", req.query.function_choice]);
		process.stdout.once('data', function(data) {
			console.log(req.query)
			res.json({
				"response": data.toString('utf8')
			})
			fs.appendFileSync("logs/py_log.log", data)
		});
		process.stderr.once('data', function(err) {
			res.json({
				"error": err.toString('utf8')
			});
			fs.appendFileSync("logs/py_log.log", err)
		})
})
app.use('/api', router);
app.listen(port);
console.log('Running Python backbone API on port: ' + port);