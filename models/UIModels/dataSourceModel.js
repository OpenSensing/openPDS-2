var UIModel = require('./UIModel'),
    db      = process.mainModule.exports.db;
var ValidationErrors = require('../errorTypes'),
    NoConstraintViolation    = ValidationErrors.NoConstraintViolation,
    MandatoryValueConstraintViolation = ValidationErrors.MandatoryValueConstraintViolation,
    UniquenessConstrainViolation = ValidationErrors.UniquenessConstraintViolation;

class dataSourceModel extends UIModel {
    constructor(initData) {
        super(initData);

        this.setName(initData.name);

        this.parserPath          = initData.parserPath;
        this.dropboxFileLocation = initData.dropboxFileLocation;
        this.dataTypes           = initData.dataTypes || 'N/A';
    };

    setName(name) {
        var validationResult = dataSourceModel.checkNameAsId(name);
        if (validationResult instanceof NoConstraintViolation) {
            this.name = name;
        } else {
            throw validationResult;
        };
    };

    static subscribe(callback) {
        dataSourceModel.onChange.push(callback)
    };

    static add(initData) {
        try {
            var newDataSource = new dataSourceModel(initData);
        }catch(e) {
            console.log( e.constructor.name +": "+ e.message);
            newDataSource = null;
        }
        if (newDataSource) {
            dataSourceModel.elements.push(newDataSource);
            console.log('Created a data source object "' + initData.name + '"');
        }
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
            dataTypes: [{name: 't1'}, {name:'t2'}],
            dropboxFileLocation: '~/Dropbox/Apps/sraps',
            parserPath: 'dummy.py'
        };

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
};

dataSourceModel.checkNameAsId = function(name) {
    var validationResult = UIModel.checkName(name);
    if (validationResult instanceof NoConstraintViolation) {
        if (!name) {
            validationResult = new MandatoryValueConstraintViolation("Name of a registerd dataSource has to be specified");
        } else if (dataSourceModel.elements.filter((ds) => {if (ds.name == name) return true}).length > 0) {
            validationResult =  UniquenessConstrainViolation("There is already a data source called " + name)
        };
    };

    return validationResult;
};


module.exports = dataSourceModel;