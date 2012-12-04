var mongo = require('mongoose');
var db = mongo.connect('mongodb://localhost/moe');
var Schema = mongo.Schema

var keyword_list = mongo.model('keyword_list',
new Schema({
     analys_type       : { type: String }
    ,reply_type        : { type: String }
    ,part_og_speech1   : { type: String }
    ,particle1         : { type: String }
    ,keyword1          : { type: String }
    ,part_og_speech2   : { type: String }
    ,particle2         : { type: String }
    ,keyword2          : { type: String }
    ,part_og_speech3   : { type: String }
    ,particle3         : { type: String }
    ,keyword3          : { type: String }
    ,answer            : { type: String }
    ,face              : { type: String }
}));


module.exports = keyword_list;

