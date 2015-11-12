var path = './';
var fs = require('fs');
var CronJob = require('cron').CronJob;
var utils = require('./utils.js');

//fs.watch(path, function () {
//    if (location)
//        location.reload();
//});

var Datastore = require('nedb')
    , db = new Datastore({ filename: 'openPDS.db', autoload: true });

exports.db = db;


