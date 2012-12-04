
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , keyword = require('./models/keyword_list')
  , inquiry = require('./models/inquiry_list')
  , status = require('./models/status_list');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// ホーム
app.get('/', function(req, res) {
   res.redirect('/keyword/list');
});
 
// 一覧表示
app.get('/keyword/list', function(req, res) {
    var m_stat='1';
    status.findOne({}, function(err, status) {
        if(err) throw err;
        m_stat=status.glasses;
    });
    keyword.find({}, function(err, keywords) {
        if(err) throw err;
        res.render('list', {title:'Address Book', keywords:keywords, m_stat:m_stat,pretty:true});
    });
});
 
// 詳細表示
app.get('/keyword/show/:id', function(req, res) {
    keyword.findOne({_id:req.param('id')}, function(err, keyword) {
        if(err) throw err;
        res.render('show', {title:'keyword', keyword:keyword, pretty:true});
    });
});
 
// 編集表示
app.get('/keyword/edit/:id', function(req, res) {
    keyword.findOne({_id:req.param('id')}, function(err, keyword) {
        if(err) throw err;
        res.render('edit', {title:'keyword(Edit)', keyword:keyword, pretty:true});
    });
});
 
// 新規作成表示
app.get('/keyword/new',  express.bodyParser(), function(req, res) {
    inquiry.find({},function(err, inquiry) {
        if(err) throw err;
        res.render('new', {title:'keyword(New)',inquiries:inquiry, pretty:true});
    });
});
 
// 更新アクション
app.post('/keyword/update/:id', function(req, res) {
    keyword.findById(req.param('id'), function(err, keyword) {
        if(!keyword)
            throw err;
        else {
            keyword.keyword1 = req.param('keyword1');
            keyword.keyword2 = req.param('keyword2');
            keyword.keyword3 = req.param('keyword3');
            keyword.answer = req.param('answer');
            keyword.face = req.param('face');
            keyword.save(function(err) {
                if(err)
                    throw err;
                else
                    res.redirect('/keyword/show/' + keyword._id);
            });
        }
    });
});
 
// 追加アクション
app.post('/keyword/insert', function(req, res) {
    var con = new keyword();
    con.analys_type='K';
    if(req.param('keyword2')!==''){
        con.reply_type='C';
    } else {
        con.reply_type='S';
    }
    con.keyword1 = req.param('keyword1');
    con.keyword2 = req.param('keyword2');
    con.keyword3 = req.param('keyword3');
    con.answer = req.param('answer');
    con.face = req.param('face');
    con.save(function(err) {
        if(err) throw err;
        res.redirect('/keyword/list');
    });
});
 
// 削除アクション(キーワード)
app.get('/keyword/delete/:id', function(req, res) {
    keyword.remove({_id:req.param('id')}, function(err) {
        if(err) throw err;
        res.redirect('/keyword/list');
    });
});

// 削除アクション(回答不能文)
app.get('/inquiry/delete/:id', function(req, res) {
    inquiry.remove({_id:req.param('id')}, function(err) {
        if(err) throw err;
        res.redirect('/keyword/new');
    });
});

// 更新アクション(メガネ)
app.get('/status/update/', function(req, res) {
    status.findOne({}, function(err, status) {
        if(!status)
            throw err;
        else {
            if(status.glasses=='0'){
                status.glasses = '1';
            } else {
                status.glasses= '0';
            }
            status.save(function(err) {
                if(err)
                    throw err;
                else
                    res.redirect('/');
            });
        }
    });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
