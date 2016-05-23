var UIModel = require('./UIModel'),
    db      = process.mainModule.exports.db;

class dataSourceModel extends UIModel {
    constructor(initData) {
        super(initData);
    };

    static subscribe(callback) {
        dataSourceModel.onChange.push(callback)
    };

    //static inform() {
    //    this.constructor.onChange.forEach((cb) => {
    //            cb();
    //    });
    //};


    static add(initData) {
        var newDataSource = new dataSourceModel(initData);
        dataSourceModel.elements.push(newDataSource);
        console.log('Created a data source object "' + initData.name + '"');

        dataSourceModel.inform();
    };

    static loadAll() {
        db.dataSources.find({}, (err, records) => {
            records.forEach( (record) => {
                this.add(record);
            });
        });
    };

    static addDummy() {
        var initD ={name: 'Dummy Data Source Model',
            types: ['t1', 't2'],
            description: "playin'",
            author: 'Jam',
            version: '0.0.1',
            folder: '~/Dropbox/Apps/sraps',
            schedule: 'NA'};

        dataSourceModel.add(initD);
    }
    static destroy(){

    }
    static destroyAll(){

    }
    // TODO: check if it's the React way

};

dataSourceModel.elements = [];
dataSourceModel.onChange = [];
dataSourceModel.inform = function inform() {
    dataSourceModel.onChange.forEach((cb) => {cb()})
}
//dataSourceModel.elements = [];


module.exports = dataSourceModel;