const axios = require('axios');

function clearServer() {
    axios.post('http://' + host + ':9003/configuration/clear').then(response => {
        var status = response.data.status;
        if (status == 1) {
            console.log('cleared');
        }
    }).catch(function (error) {
        console.log(error);
    });
}