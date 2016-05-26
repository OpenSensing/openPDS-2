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

        this.parserPath          = initData.parserPath || 'N/A';
        this.dropboxFileLocation = initData.dropboxFileLocation || 'N/A';
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
            dataSourceModel.inform();
            this._save(newDataSource);
        }
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
    };
    static _save(dsModel) {
        db.dataSources.insert(dsModel);
    };
    static destroy(dsModelName){
        db.dataSources.remove(dsModelName);
        //TODO: remove the crappy elements array with an aobject
        var  moduleIndex;
        this.elements.forEach((val, i) => {if(val.name == dsModelName.name) moduleIndex = i;})
        this.elements.splice(moduleIndex, 1);
        this.inform();
        //TODO:  ensure cleaning up of the parser script, folder etc.
    };
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
            validationResult = new MandatoryValueConstraintViolation("Name of a registered dataSource has to be specified");
        } else if (dataSourceModel.elements.filter((ds) => {if (ds.name == name) return true}).length > 0) {  // nasty way of checking element with given name alredy exists in the elements array
            validationResult =  new UniquenessConstrainViolation("There is already a data source called " + name)
        };
    };

    return validationResult;
};


module.exports = dataSourceModel;