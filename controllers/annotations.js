exports.getAnnotations = function(supplier_id,next) {
    console.log('http://keysale.se/admin/recognition/dashboard/train?suplier_id='+supplier_id+'&data_type=annotations');
	axios.post('http://keysale.se/admin/recognition/dashboard/train?suplier_id='+supplier_id+'&data_type=annotations').then(response => {
        var annotations = response.data;
        next(annotations);
    });

}