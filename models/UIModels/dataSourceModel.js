var UIModel = require('./UIModel'),
    db      = process.mainModule.exports.db;

class dataSourceModel extends UIModel {
    constructor(initData) {
        super(initData);
    };
    static add(initData) {
        var newDataSource = new dataSourceModel(initData);
        dataSourceModel.elements.push(newDataSource);
        console.log('Created a data source object "' + initData.name + '"');
    }
    static addDummy() {
        var initD ={name: 'Dummy Data Source Model',
            types: ['t1', 't2'],
            description: "playin'",
            author: 'Jam',
            version: '0.0.1',
            folder: '~/Dropbox/Apps/sraps',
            schedule: 'NA'};

        dataSourceModel.add(initD);
        return dataSourceModel.elements['Dummy Data Source'];
    }
    static destroy(){

    }
    static destroyAll(){

    }
    // TODO: check if it's the React way
    static loadAll() {
        db.dataSources.find({}, (err, records) => {
            records.forEach( (record) => {
                this.add(record);
            });
        });
    };
};

dataSourceModel.elements = [];
//dataSourceModel.elements = [];


module.exports = dataSourceModel;