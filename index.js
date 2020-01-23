//REQUIRES
var express = require('express');
var bodyParser = require('body-parser')
var serveIndex = require('serve-index');

//HELPERS
const helperTrainer = require('./helper/trainer');
const helperDownloader = require('./helper/downloader');
const helperArchiver = require('./helper/archiver');

//VARIABLES
var photosPath = 'train_photos';
var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//ROUTES
app.post('/archive', urlencodedParser, (req,res) => {
	helperDownloader.downloadPhotos(req.body, photosPath, () => {
		helperArchiver.archivePhotos(() => {
			helperTrainer.clearServer();
		},photosPath);
	});
});
app.use('/photos', express.static(photosPath), serveIndex(photosPath, { 'icons': true }))
app.use('/archives', express.static('archives'), serveIndex('archives', { 'icons': true }))
app.listen(80, function () {
	console.log('Server started!');
});