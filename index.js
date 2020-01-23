const helperTrainer = require('helper/trainer');
const helperDownloader = require('helper/downloader');
const helperArchiver = require('helper/archiver');



const path = require('path');
var express = require('express');
var http = require('https');
var bodyParser = require('body-parser')
var fs = require('fs');
var archiver = require('archiver');
const rimraf = require('rimraf');
var serveIndex = require('serve-index');
var _ = require('underscore');
const axios = require('axios');

var app = express();
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var host = '52.213.135.19';
app.post('/archive', urlencodedParser, function (req, res) {
  	 rimraf('train_photos/*', function () {
		const downloadTasks = downloadLinks(req.body);

		Promise.all(downloadTasks).then(function () {
			helperArchiver.archivePhotos(function () {
				helperTrainer.clearServer();
			});			
		});
		
		res.send('done');
	});
	//rimraf('train_photos/*', function () { console.log('done'); });
});
app.use('/photos/train', express.static('train_photos'), serveIndex('train_photos', {'icons': true}))
app.use('/data', express.static('data'), serveIndex('data', {'icons': true}))

app.listen(80, function () {
  console.log('Example app listening on port 3000!');
});
