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

function getDateString() {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day =`${date.getDate()}`.padStart(2, '0');
  return `${year}${month}${day}`
}
var host = '52.213.135.19';
app.post('/archive', urlencodedParser, function (req, res) {
  	 rimraf('train_photos/*', function () {
		const downloadTasks = _.values(req.body).map((url) => new Promise((resolve, reject) => {
			const file = fs.createWriteStream('train_photos/'+url.split('/').pop());
            const request = http.get(url, function(response) {
                response.pipe(file);
				resolve("done");
            });
		}));

		Promise.all(downloadTasks).then(values => {
			var output = fs.createWriteStream(`data/${getDateString()}.zip`);
			var archive = archiver('zip', {
  				zlib: { level: 9 } // Sets the compression level.
			});
			// 'close' event is fired only when a file descriptor is involved
			output.on('close', function() {
				axios.post('http://'+host+':9003/configuration/clear').then(response => {
					var status = response.data.status;
					if(status == 1) {
						console.log('cleared');
					}
				}).catch(function(error){
					console.log(error);
				});
			});

			// This event is fired when the data source is drained no matter what was the data source.
			// It is not part of this library but rather from the NodeJS Stream API.
			// @see: https://nodejs.org/api/stream.html#stream_event_end
			output.on('end', function() {
  				console.log('Data has been drained');
			});

			// good practice to catch warnings (ie stat failures and other non-blocking errors)
			archive.on('warning', function(err) {
  				if (err.code === 'ENOENT') {
    				// log warning
  				} else {
    				// throw error
    					throw err;
  				}
			});

			// good practice to catch this error explicitly
			archive.on('error', function(err) {
  				throw err;
			});

			// pipe archive data to the file
			archive.pipe(output);
			const directoryPath = path.join(__dirname,'train_photos');
			//passsing directoryPath and callback function
			fs.readdir(directoryPath, function (err, files) {
				files.forEach(function (file) {
					archive.append(fs.createReadStream(directoryPath+'/'+file), {name:file});
				});
				archive.finalize();
			});
			console.log(`data/${getDateString()}.zip SAVED`);
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
