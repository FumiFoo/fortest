var mongo = require('mongoose');
var Schema = mongo.Schema;

var inquiry_list = mongo.model('status_list',
new Schema({
     glasses         : { type: String}
}));


module.exports = inquiry_list;

