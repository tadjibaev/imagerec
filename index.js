//REQUIRES
var express = require('express');
var bodyParser = require('body-parser')
var serveIndex = require('serve-index');

//HELPERS
const helperTrainer = require('./helper/trainer');
const helperDownloader = require('./helper/downloader');
const helperArchiver = require('./helper/archiver');
const helperAnnotations = require('./controllers/annotations');
//VARIABLES
var photosPath = 'train_photos';
var annotationsPath = 'train_annotations';

var app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var supplier_id = null;
var potos = [];
//ROUTES
app.post('/archive', urlencodedParser, (req, res) => {
	photos = req.body.photos;
	supplier_id = req.body.supplier_id;
	helperDownloader.downloadFiles(photos, photosPath, () => {
		console.log('DOWNLOAD PHOTOS FINISHED');
		helperArchiver.archiveFiles(photosPath, 'photos.zip', () => {
			console.log('ARCHIVE PHOTOS FINISHED');
			helperTrainer.clearServer(() => {
				helperAnnotations.getAnnotations(supplier_id, (annotations) => {
					helperDownloader.downloadFiles(annotations, annotationsPath, function () {
						console.log('DOWNLOAD ANNOTATIONS FINISHED');
						helperArchiver.archiveFiles(annotationsPath, 'annotations.zip', function () {
							res.send('done');
							
						});
					});
				});
			});
		});
	});
});
app.use('/photos', express.static(photosPath), serveIndex(photosPath, { 'icons': true }))
app.use('/archives', express.static('archives'), serveIndex('archives', { 'icons': true }))
app.listen(80, function () {
	console.log('Server started!');
});