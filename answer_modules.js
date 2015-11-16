var fs = require('fs-extra');
var hogan = require('hogan');
var utils = require('./utils.js');
var path = require('path');
var config = require('./config.js')

function submitAnswerModuleForm() {

    var configPath = document.getElementById('configPath');

    var manifestJSON = fs.readFileSync(configPath.value, 'utf-8');
    var manifest = JSON.parse(manifestJSON);

    installAnswerModule(manifest);

}

function installAnswerModule(manifest) {
    var db = process.mainModule.exports.db;

    var requiredDataSources = [];

    manifest.requiredDataTypes.forEach(function(dataType) {
        var dataSource = dataType.split(".")[0];
        requiredDataSources.push(dataSource);
    });

    var requiredDataSourcesSet = new Set(requiredDataSources);
    requiredDataSources = [];
    requiredDataSourcesSet.forEach(function(value) {
        requiredDataSources.push(value);
    });

    db.dataSources.find({name: {$in: requiredDataSources}}, function(err, docs) {

        var foundDataTypes = [];

        docs.forEach(function(doc) {
            var installedDataTypes = doc.dataTypes.filter(function(dataType) {
                return $.inArray(doc.name + "." + dataType.name, manifest.requiredDataTypes);
            });

            installedDataTypes.forEach(function(dataType) {
                foundDataTypes.push({name: dataType.name, description: dataType.description})
            });
        });

        var template = $('#answerModuleConsent').html();
        var html = hogan.compile(template).render({name: manifest.name, requiredDataTypes: foundDataTypes});
        $('#answerModuleConsentContent').html(html);
        $('#answerModuleConsentModal').openModal();

    });
}

function agreedCallback() {
    var configPath = document.getElementById('configPath');

    var manifestJSON = fs.readFileSync(configPath.value, 'utf-8');
    var manifest = JSON.parse(manifestJSON);
    var localAnswerModulePath = path.join(config.dataPath, 'answerModules', manifest.name);

    fs.mkdirsSync(localAnswerModulePath);
    fs.copySync(path.join(path.dirname(configPath.value), manifest.parserPath), path.join(localAnswerModulePath, manifest.parserPath));

    //fs.mkdirsSync(path.join(config.dropboxRoot, manifest.dropboxDirectory));

    process.mainModule.exports.db.answerModules.insert(manifest, function(err, doc) {
        console.log("Answer module saved");

        $('#addAnswerModuleModal').submit();

        //fix lingering modal overlay bug in materialize.css
        $('.lean-modal').remove();

        getAllAnswerModules();
    });


}

function getAllAnswerModules() {
    process.mainModule.exports.db.answerModules.find({}, function (err, results) {
        var template = $('#answerModulesList').html();
        var html = hogan.compile(template).render({answerModules: results});
        $('#answerModulesContainer').html(html);
        $('.collapsible').collapsible();
    });
}

function runAnswerModule(answerModuleName) {
    var db = process.mainModule.exports.db;
    db.answerModules.findOne({name: answerModuleName}, function (err, doc) {
        db.dataTypes.find({name: {$in: doc.requiredDataTypes}}, function (err, docs){

            var rawDataDBs = [];
            docs.forEach(function (dataType) {
                var root = path.join(config.dataPath, 'dataSources', dataType.name.split('.')[0]);
                rawDataDBs.push(path.join(root, dataType.cache_db_name));
            });

            params = {};
            params.results = path.join(config.dropboxRoot, doc.dropboxDirectory);
            params.dbs = rawDataDBs;


            //utils.spawnPython(path.join(config.dataPath, 'answerModules', answerModuleName, doc.parserPath), JSON.stringify(params),
            //function (code) {

            //});
        });

    });
}