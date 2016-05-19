var UIModel = require('./UIModel');

function dataSourceModel (initData) {
    UIModel.call(this, initData);
}

dataSourceModel.prototype = Object.create(UIModel.prototype);
dataSourceModel.prototype.constructor = dataSourceModel;

// Class level props and methods
dataSourceModel.elements = [];

dataSourceModel.add = function (initData) {

    var newDataSource = new dataSourceModel(initData);
    dataSourceModel.elements.push(newDataSource);
    console.log('Created a data source object "' + initData.name + '"');
}

dataSourceModel.addDummy = function () {
    var initD ={name: 'Dummy Data Source',
                types: ['t1', 't2'],
                description: "playin'",
                author: 'Jam',
                version: 0,
                folder: '~/Dropbox/Apps/sraps',
                schedule: 'NA'};
    
    dataSourceModel.add(initD);
    return dataSourceModel.elements['Dummy Data Source'];
}

//TODO: not only add to the model but register the data source in the db

dataSourceModel.destroy = function () {

}

dataSourceModel.destroyAll = function () {

}

dataSourceModel.loadAll = function () {

}

module.exports = dataSourceModel;