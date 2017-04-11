require('events').EventEmitter.prototype._maxListeners = 100;
var Koa = require('koa');
var app = new Koa();
var Router = require('koa-router');
var router = new Router();
var logger = require('./lib/log');
var db = require('./lib/db');

var formidable = require('koa2-formidable')
app.use(formidable({
    encoding: 'utf-8',
    uploadDir: 'public/tmp',
    maxFieldsSize: 3145728,
    multiples: true
}));
app.on('error', function(err, ctx) {
    logger.error(err.message);
    logger.error(err);
});
app.context.db = db;
app.context.logger = logger;
var cors = require('./router/cors');
var err = require("./router/err");

router.prefix('/api');
router.post('/login',require("./router/login"),err);
router.post('/address',require("./router/address"),err);
router.get('/newslist',require("./router/news/list"),err);
router.get('/newsDetail',require("./router/news/detail"),err);

//传统urp
router.post('/curri',require("./router/urpData/curri"),err);
router.post('/infoPlus',require("./router/urpData/infoPlus"),err);
router.post('/newAchi',require("./router/urpData/newAchi"),err);
router.post('/oldAchi',require("./router/urpData/oldAchi"),err);
router.post('/examDate',require("./router/urpData/examDate"),err);

//小程序用的
router.post('/wxapp/thirdSession',require('./router/wxapp/thirdSession'),err);
router.get('/wxapp/checkBindUrp',require('./router/wxapp/checkBindUrp'),err);
router.post('/wxapp/bindUrp',require('./router/wxapp/bindUrp'),err);
router.post('/wxapp/unBindUrp',require('./router/wxapp/unBindUrp'),err);
router.get('/wxapp/oldAchi',require('./router/wxapp/oldAchi'),err);
router.get('/wxapp/newAchi',require('./router/wxapp/newAchi'),err);
router.get('/wxapp/curri',require('./router/wxapp/curri'),err);
router.get('/wxapp/infoPlus',require('./router/wxapp/infoPlus'),err);
router.get('/wxapp/examDate',require('./router/wxapp/examDate'),err);

router.post('/wxapp/feedBack',require('./router/wxapp/wx/feedback'),err);
var getAvatar=require('./router/wxapp/wx/avatar/get');
var updateAvatar=require('./router/wxapp/wx/avatar/update');
router.all('/wxapp/avatar',getAvatar,updateAvatar,err);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(7777, function() {
    console.log("listen on 7777");
});