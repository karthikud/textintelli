const http = require('http');
const express = require('express');
const app = express();
const crypto = require('crypto');
const path = require('path');
const async = require('async');
var fs = require('fs');
var _ = require('lodash');

var elasticlunr = require('elasticlunr');


const isDevMode = process.env.NODE_ENV === 'development';
const request = require('request')
var bodyParser = require('body-parser');
var busboy = require("connect-busboy");
var NodeOffice = require("nodeoffice");
var multer  = require('multer');
var storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)

      cb(null, raw.toString('hex') + path.extname(file.originalname))
    })
  }
})

var upload = multer({ storage: storage })


app.use(bodyParser.json());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('morgan')('short'));
app.use(busboy());

(function initWebpack() {
  const webpack = require('webpack');
  const webpackConfig = require('./webpack/common.config');
  const compiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath,
  }));

  app.use(require('webpack-hot-middleware')(compiler, {
    log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000,
  }));

  app.use(express.static(__dirname + '/'));
})();

app.get(/.*/, function root(req, res) {
  res.sendFile(__dirname + '/src/index.html');
});



app.post('/upload', upload.array('docs', 10), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
  console.log(req.body);
  var index = elasticlunr(function () {
    this.addField('data')
});
var Docs =[];


async.series({
    indexing:function(callback) {
	
		async.eachOfSeries(req.files, function (value, key, callback) {
			console.log(key,value);
			NodeOffice.readFile('uploads/' + value.filename, function (err, bodyObject) {
			if(err) throw err
			
			if(bodyObject){
			console.log('bodyobject',bodyObject);
			var paras = bodyObject.getParagraphs();
			var runs = [];
			
			var content ='';
            
			//for each paragraph
			for (var paraIndex in paras) {
			var paragraphcontent ="";
			var paragraph = paras[paraIndex];
			var runs = bodyObject.getRuns(paragraph);
			for (var runIndex in runs){
			var run = runs[runIndex];
			 paragraphcontent += bodyObject.getRunContent(run);

			
			}
			var contentObj={};
			contentObj.id =  _.uniqueId('doc_');
			contentObj.data = paragraphcontent;
			contentObj.filename = value.originalname;
			Docs.push(contentObj);
			index.addDoc(contentObj);

			}
			
            fs.unlinkSync('uploads/' + value.filename);
			callback();
			}
			})
        
		}, function (err) {
			if (err) console.error(err.message);
			callback();
		});

    },
    search:function(callback) {

		//var results  = index.search(req.body.searchterm);
		console.log('searchtype',req.body.searchtype);
        var results = index.search(req.body.searchterm,{bool: req.body.searchtype}).map(function (result) {
		console.log('search index',result);
            return Docs.filter(function (q) {
			return q.id === result.ref
			})[0]
        })
		//console.log('result----------',results);
        callback(null,results);
    }
}, function (err, results) {
    // result now equals 'done'
	//console.log('final-------------',err,results);
	//console.log('Docs-------------',Docs);
	
res.type('application/json');
	res.json(results);
});
//search




})

const server = http.createServer(app);
server.listen(process.env.PORT || 8080, function onListen() {
  const address = server.address();
  console.log('Listening on: %j', address);
  console.log(' -> that probably means: http://localhost:%d', address.port);
});
