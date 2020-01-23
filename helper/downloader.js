var http = require('https');
const rimraf = require('rimraf');
const path = require('path');
var fs = require('fs');
var _ = require('underscore');

exports.downloadPhotos = function (links, path, done) {
    console.log('../' + path + '/*');
    rimraf('../' + path + '/*', function () {
        const downloadTasks = _.values(links).map((url) => new Promise((resolve, reject) => {
            const file = fs.createWriteStream(path + '/' + url.split('/').pop());
            const request = http.get(url, function (response) {
                response.pipe(file);
            });
        }));
        Promise.all(downloadTasks).then(done);
    });
}