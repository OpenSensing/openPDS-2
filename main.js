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

var dropboxPath = "/Users/radugatej/Dropbox/Apps/";

exports.dataSourceParseJob = new CronJob('* */10 * * * *', function() {
    running = true;
    db.find({}, function (err, results) {
        results.forEach(function(dataSource) {
            var lastProcessingDate = dataSource.lastProcessingDate;
            if (!lastProcessingDate) {
                lastProcessingDate = new Date(0);
            }

            var filesToProcess = utils.getFilesAfterDate(dropboxPath + dataSource.dropboxFileLocation, lastProcessingDate);

            if (filesToProcess.length === 0) {
                return;
            }

            var dataTypeDBs = [];
            dataSource.dataTypes.forEach(function(dataType) {
                dataTypeDBs.push(dataType.cache_db_name);
            });
            db.update({_id: dataSource._id}, {$set: {lastProcessingDate: new Date()}}, {});

            utils.spawnPython(dataSource.parserPath, JSON.stringify({files: filesToProcess, dbs: dataTypeDBs}));
        });
    });
}, function () {

}, true, 'Europe/Copenhagen');

exports.db = db;


