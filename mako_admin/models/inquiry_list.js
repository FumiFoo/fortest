var mongo = require('mongoose');
var Schema = mongo.Schema;

var inquiry_list = mongo.model('inquiry_list',
new Schema({
     timestamp         : { type: Date}
    ,inquiry           : { type: String }
    ,inquirydata            : { type: String }
}));


module.exports = inquiry_list;

