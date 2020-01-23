var http = require('https');
const rimraf = require('rimraf');
const path = require('path');
var fs = require('fs');
var _ = require('underscore');

function downloadPhotos(links,path,done) {
    rimraf(path+'/*', function () {
        const downloadTasks = _.values(links).map((url) => new Promise((resolve, reject) => {
            const file = fs.createWriteStream(path+'/'+url.split('/').pop());
            const request = http.get(url, function(response) {
                response.pipe(file);
                resolve("downloadPhotosDone");
            });
        }));
        Promise.all(downloadTasks).then(done);
    });
}