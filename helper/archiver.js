function archivePhotos(onfinish) {
    var output = fs.createWriteStream(`data/${getDateString()}.zip`);
    var archive = archiver('zip', {
        zlib: { level: 9 }
    });
    output.on('close', onfinish);
    archive.pipe(output);
    const directoryPath = path.join(__dirname, 'train_photos');
    fs.readdir(directoryPath, function (err, files) {
        files.forEach(function (file) {
            archive.append(fs.createReadStream(directoryPath + '/' + file), { name: file });
        });
        archive.finalize();
    });
}

function getDateString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}${month}${day}`
}