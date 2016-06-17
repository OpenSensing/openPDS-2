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

var dataDbs = {};

var data = {};



DataSources.loadAll();
DataTypes.loadAll();
AnswerModules.loadAll();



var Scheduler = {dataSources:{}, answerModules:{}};

//TODO- think about registering callbacks or returning promisses rather than actual datasource etc. objects
// Schedule for data parsers

DataSources.loadAll();
DataTypes.loadAll();






// load all data sources in to memrory

var dSources = DataSources.getAll();

for (var name in dSources) {
    let ds = dSources[name];

    let dataTypes = ds.dataTypes;
    dataTypes = DataTypes.get(dataTypes)

    let dsDetails = {

    }
}


// Prepare input and output files
function getDataTypesDBs (typeNames) {
    var dTypes = DataTypes.get(typeNames);  // load typ detalis from the model
    var dbs ={};
    for (let dType in dTypes) {            // for every type types
        dType =  dTypes[dType];

        // open the db
        if (dataDbs[dType.cache_db_name]) {  //if db already open just reference it
            dbs[dType.name] = dataDbs[dType.cache_db_name]
        } else {                              // else open it and put a reference to it in the dataDbs object
            dbs[dType.name] = openDataDb(dType)
        }

    }
    return dbs
}

function openDataDb (dType) {

    var dataSource, cache_db_name, name;
    ({dataSource, cache_db_name, name} = dType);

    var dbFolderPath = path.join(config.dataPath, 'dataSources', dataSource)
    var dbPath       = path.join(dbFolderPath, cache_db_name);
    dataDbs[dataTypeName] = new Datastore({filename: dbPath, autoload: true});   // open  the db and store it in the dataDBs obj

    return dataDbs[name] //and return it
}


function openInputFile () {

}


