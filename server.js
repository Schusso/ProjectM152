var express = require("express");
var app = express();
var multer = require('multer');
var gm = require('gm').subClass({ imageMagick: true });
//multer storage and Upload
var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage }).single('MyImage');
//Template with EJS
app.use(express.static('./public/uploads'));
app.set('view engine', 'ejs');
app.get('/', function (req, res) { return res.render('index', { image: null }); });
app.post('/api/files/optimize', function (req, res) {
    upload(req, res, function (err) {
        gm("" + req.file.path)
            .resize("720")
            .write(__dirname + '/public/uploads/small_' + req.file.filename, function (err) {
            console.log(err);
        });
        gm("" + req.file.path)
            .resize("1280")
            .write(__dirname + '/public/uploads/medium_' + req.file.filename, function (err) {
            console.log(err);
        });
        gm("" + req.file.path)
            .resize("1920")
            .write('public/uploads/big_' + req.file.filename, function (err) {
            console.log(err);
        });
        if (err) {
            res.render('index', {
                msg: err,
                image: "https://projektm152.herokuapp.com/uploads/" + req.file.filename
            });
        }
        else {
            res.render('index', {
                msg: 'Danke für den Upload!',
                image: "https://projektm152.herokuapp.com/uploads/" + req.file.filename
            });
        }
    });
});
app.listen(process.env.PORT || 80);
console.log("Application listening on Port:" + (process.env.PORT || 80));
//app.use(express.static( __dirname 'dist/bla bla /);
//res.sendFile(__dirname + "/dist/demo-app-angular/index.html")
//# sourceMappingURL=server.js.map