/**
 * Created by mpio on 19/05/16.
 */
var UIModel = require('./UIModel');

function answerModuleModel (initData) {
    UIModel.call(this, initData);
}

answerModuleModel.prototype = Object.create(UIModel.prototype);
answerModuleModel.prototype.constructor = answerModuleModel;

// Class level props and methods
answerModuleModel.elements = [];

answerModuleModel.add = function (initData) {

    var newDataSource = new answerModuleModel(initData);
    answerModuleModel.elements.push(newDataSource);
    console.log('Created a data source object "' + initData.name + '"');
}

answerModuleModel.addDummy = function () {
    var initD ={name: 'Dummy Answer Module',
        types: ['t1', 't2'],
        description: "playin'",
        author: 'Jam',
        version: 0,
        folder: '~/Dropbox/Apps/sraps',
        schedule: 'NA'};

    answerModuleModel.add(initD);
}

//TODO: not only add to the model but register the data source in the db

answerModuleModel.destroy = function () {

}

answerModuleModel.destroyAll = function () {

}

answerModuleModel.loadAll = function () {

}

module.exports = answerModuleModel;