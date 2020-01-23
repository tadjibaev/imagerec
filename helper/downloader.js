function downloadLinks(links) {
    return _.values(links).map((url) => new Promise((resolve, reject) => {
        const file = fs.createWriteStream('train_photos/'+url.split('/').pop());
        const request = http.get(url, function(response) {
            response.pipe(file);
            resolve("done");
        });
    }));
}