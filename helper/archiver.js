var archiver = require('archiver');
var fs = require('fs');
const path = require('path');

exports.archivePhotos = function(onfinish,photosPath) {
    var output = fs.createWriteStream(`archives/${getDateString()}.zip`);
    var archive = archiver('zip', {
        zlib: { level: 9 }
    });
    output.on('close', onfinish);
    archive.pipe(output);
    const directoryPath = path.join(__dirname+'/../', photosPath);
    console.log(directoryPath);
    fs.readdir(directoryPath, function (err, files) {
        if(files) {
            files.forEach(function (file) {
                archive.append(fs.createReadStream(directoryPath + '/' + file), { name: file });
            });
            archive.finalize();
        }
    });
}

function getDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}${month}${day}`
}