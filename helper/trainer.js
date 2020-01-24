const axios = require('axios');
const host = '52.213.135.19';
exports.clearServer = function(next) {
    axios.post('http://' + host + ':9003/configuration/clear').then(response => {
        var status = response.data.status;
        if (status == 1) {
            console.log('next');
            next();
        }
    }).catch(function (error) {
        console.log(error);
    });
}