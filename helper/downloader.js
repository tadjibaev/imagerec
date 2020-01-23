var http = require('https');
const rimraf = require('rimraf');
const path = require('path');
var fs = require('fs');
var _ = require('underscore');

exports.downloadPhotos = function (links, path, done) {
    rimraf('../' + path + '/*', function () {
        console.log('OLD FILES DELETED');
        const downloadTasks = _.values(links).map((url) => new Promise((resolve, reject) => {
            const file = fs.createWriteStream(path + '/' + url.split('/').pop());
            http.get(url, function (response) {
                response.pipe(file);
                // console.log('DOWNLOAD: ' + url);
            });
        }));
        Promise.all(downloadTasks).then(done);
    });
}