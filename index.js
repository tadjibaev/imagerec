const helperTrainer = require('helper/trainer');
const helperDownloader = require('helper/downloader');
const helperArchiver = require('helper/archiver');

var express = require('express');
var bodyParser = require('body-parser')

var serveIndex = require('serve-index');
var _ = require('underscore');
var photosPath = 'train_photos';

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post('/archive', urlencodedParser, req,res => {
	helperDownloader.downloadPhotos(req.body, photosPath, _ => {
		helperArchiver.archivePhotos( _ => {
			helperTrainer.clearServer();
		});
	});
});
app.use('/photos', express.static(photosPath), serveIndex(photosPath, { 'icons': true }))
app.use('/archives', express.static('archives'), serveIndex('archives', { 'icons': true }))

app.listen(80, function () {
	console.log('Server started!');
});