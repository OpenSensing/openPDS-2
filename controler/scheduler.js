/**
 * Created by mpio on 14/06/16.
 */
'use strict'

const CronJob       = require("node-chron").CronJob;
var DataSources     = require("../models/DataProcessor/dataSourceModel"),
    DataTypes       = require("../models/DataProcessor/dataTypeModel"),
    AnswerModules   = require("../models/DataProcessor/answerModuleModel");


DataSources.loadAll();
DataTypes.loadAll();
AnswerModules.loadAll();

