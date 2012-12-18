
/**
 * Module dependencies.
 */

var mongo = require('mongoose'),
    request = require("request"),
	sys = require('sys'),
	cheerio	= require("cheerio");
var db = mongo.connect('mongodb://moe:moemoe\@ds045147.mongolab.com:45147/moe');

var express = require('express')
	, routes = require('./routes')
	, http = require('http')
	, path = require('path')
	, keywords = require('./models/keyword_list')
	, inquiry = require('./models/inquiry_list')
	, status = require('./models/status_list');
var ans = {};
ans.answer="";
ans.glasses="";
ans.face="";

var PassageID;
var app = express();

app.configure(function(){
//	app.set('port', process.env.PORT || 8080);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
app.configure('development', function(){
	app.use(express.errorHandler());
});

// ホーム
app.get('/', function(req, res) {
	status.findOne({}, function(err, stat) {
		if(err) throw err;
		res.render('index', {pretty:true, glasses:stat.glasses});
	});
	//PassageID = setTimeout(function(){console.log('しりとりしますか？');},180000);

});
 
// メイン処理
app.post('/talk', function(req, res) {
		clearInterval(PassageID);
		//inquiry
    status.findOne({}, function(err, stat) {
        ans.glasses=stat.glasses;
		var input = req.body.input || '';
		keywords.find({},function(err,keywords){
//			var ans = new Object();
			if(err) throw err;
			matchMain(keywords, input);
			if(ans.answer===null||ans.answer===undefined) {//var ans = new Object;
			unableAnswer(input);}
            console.log(JSON.stringify(ans));
            res.send(JSON.stringify(ans));
		});
    });
});

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

// マッチングメインフロー
function matchMain(keywords, input){
	for(var i = 0; i < keywords.length; i++){
		if(keywords[i].analys_type == 'K'){
			if(keywords[i].reply_type == 'C'){
				if(checkKeyWord(input,keywords[i].keyword1) 
				&& checkKeyWord(input,keywords[i].keyword2)){
					ans.answer = replaceTemplate(keywords[i]);
					ans.face=keywords[i].face;
				} 
			} else {
				if(checkKeyWord(input,keywords[i].keyword1) 
				&& checkKeyWord(input,keywords[i].keyword2) 
				&& checkKeyWord(input,keywords[i].keyword3) ){
					ans.answer = keywords[i].answer;
					ans.face=keywords[i].face;
				}
			}
		}
	}
    return;

}


// 質問文内キーワードサーチ
function checkKeyWord(inquiry, keyword){
	var res = false;
	var re = new RegExp(keyword);
	if(inquiry.match(re)) {res = true;}
	return res;
};

// 回答文テンプレートの置換処理
function replaceTemplate(keywords){
	var res = keywords.answer.replace("keyword1",keywords.keyword1);
	res = res.replace("keyword2",keywords.keyword2);
	res = res.replace("keyword3",keywords.keyword3);
	return res;
};

// 回答不可能時処理
function unableAnswer(input){
	ans.face='2';
	switch(Math.round(Math.random() * 4) + 1){
		case 1:
			ans.answer = '申し訳ありません、お答えすることが出来ません。。';
			break;
		case 2:
			ans.answer = '私にはまだ回答ができません、ごめんなさい';
			break;
		case 3:
			ans.answer = 'ごめんなさい！わからないので調べておきます';
			break;
		case 4:
			ans.answer = '申し訳ありません、こちらで調べて頂けますでしょうか（リンク　https://www.valuecommerce.ne.jp/support/ptn/faq/?clm=right&ref=ptn_top）';
			break;
		case 5:
			ans.answer = '私にはお答えできないので、こちらまでお問い合わせください　（リンク　https://www.valuecommerce.ne.jp/support/ptn/?clm=right&ref=ptn_top）';
			break;
	}
	stockInquiry(input);
	return ans;	
}
// 回答不能時のロギング
function stockInquiry(input){
	morpAna(input);
}


function morpAna(input){
	var url = "http://jlp.yahooapis.jp/MAService/V1/parse?appid=BEJ8XTSxg67a4E4wkrh9Fk1MN5GwEm9d5DplSAeUZ6tepQjcAeTWDDRFW2GkF6qWdg--&results=ma,uniq&uniq_filter=9|10&sentence="+encodeURI(input);
	var data=new Array();

	//	回答不能の質問文のみを形態素解析
	request({uri:url}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
				var $ = cheerio.load(body);
				$('ma_result').find('word_list').find('word').each(function(){
					var dat= {};
					dat.surface = $(this).children('surface').text().toString();
					dat.reading = $(this).children('reading').text().toString();
					dat.pos = $(this).children('pos').text().toString();
					data.push(dat);
				});
				loggingInquiry(input, data);
		}
	});
}




function loggingInquiry(input, data){
	var inq = new inquiry();
	// Mongoへの書き込みをする
	inq.timestamp = new Date();;
	inq.inquiry = input;
	inq.inquirydata = JSON.stringify(data);
	inq.save(function(err){
		if (err) { console.log(err); }
	});
}
