/**
 * Created by mpio on 14/06/16.
 */
'use strict'

const CronJob       = require("cron").CronJob,
    path            = require('path'),
    config          = require('../config.js'),
    Datastore       = require('nedb');

var DataSources     = require("../models/DataProcessor/dataSourceModel"),
    DataTypes       = require("../models/DataProcessor/dataTypeModel"),
    AnswerModules   = require("../models/DataProcessor/answerModuleModel");

    //db              = process.mainModule.exports.db;
var data = {};



DataSources.loadAll();
DataTypes.loadAll();
AnswerModules.loadAll();



var Scheduler = {dataSources:{}, answerModules:{}};

//TODO- think about registering callbacks or returning promisses than actuall datasource etc. objects
// Schedule for data parsers

DataSources.loadAll();
DataTypes.loadAll();


var dSources = DataSources.getAll();




for (var name in dSources) {
    let ds = dSources[name];

    let dataTypes = ds.dataTypes;
    dataTypes = DataTypes.get(dataTypes)

    let dsDetails = {

    }

}


// Prepare input and output files
function openDataTypesDBs (typeNames) {
    var dTypes = DataTypes.get(typeNames);
    var dbs ={};

    for (let dType in dTypes) {
        dType =  dTypes[dType];

        let dbPath = path.join(config.dataPath, 'answerModules', dType.dataSource, dType.cache_db_name);
        dbs[dType.name] = new Datastore(dbPath, autoload: true)   ;
    }

    return dbs
}

function openInputFile () {

}


