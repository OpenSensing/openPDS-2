var CronJob = require('cron').CronJob;
var utils = require('./utils.js');
var path = require('path');
var config = require('./config.js');
var dataSourceUtils = require('./data_sources.js');


var Datastore = require('nedb');
var db = {};


db.dataSources = new Datastore({filename: path.join(config.dataPath, 'openPDS_dataSources.db'), autoload: true});
db.dataSources.ensureIndex({fieldName: 'name', unique: true}, function(err) {
    //console.log(err.toString());
});

db.dataTypes = new Datastore({filename: path.join(config.dataPath, 'openPDS_dataTypes.db'), autoload: true});
db.dataTypes.ensureIndex({fieldName: 'name', unique: true}, function(err) {
    //console.log(err.toString());
});

db.answerModules = new Datastore({filename: path.join(config.dataPath, 'openPDS_answerModules.db'), autoload: true});
db.answerModules.ensureIndex({fieldName: 'name', unique: true}, function(err) {
    //console.log(err.toString());
});


//exports.dataSourceParseJob = new CronJob('* * * * * *', function () {
//    db.dataSources.find({}, function (err, results) {
//        results.forEach(function (dataSource) {
//            processRawDataSource(dataSource);
//        });
//    });
//}, function () {
//
//}, false, 'Europe/Copenhagen');

exports.db = db;


