/**
 * Created by mpio on 13/06/16.
 */
var DataProcessorModel = require('./DataProcessorModel'),
    db                 = process.mainModule.exports.db;
var ValidationErrors = require('../errorTypes'),
    NoConstraintViolation    = ValidationErrors.NoConstraintViolation,
    MandatoryValueConstraintViolation = ValidationErrors.MandatoryValueConstraintViolation,
    UniquenessConstrainViolation = ValidationErrors.UniquenessConstraintViolation;

class dataTypeModel extends DataProcessorModel {
    constructor(initData) {
        super(initData);

        this.setName(initData.name);
        this.setDataSource(initData.dataSource);

        this.setSchema(initData.schema);

        this.cache_db_name = this.name + '_' + this.dataSource + '.db';
        this.description   = initData.description || 'N/A';

    };

    
    setDataSource(dataSourceName) {
        var validationResult = this.checkDataSource(dataSourceName);

        if (validationResult instanceof NoConstraintViolation) {
            this.dataSource = dataSourceName;
        } else {
            throw validationResult;
        }
    };
    
    checkDataSource(dataSourceName) {
        if(!dataSourceName) return new NoConstraintViolation;

        //TODO: foreign key constraint on DataSources.name
        return new NoConstraintViolation
    };
    
    setSchema(schema) {
        var validationResult = this.checkSchema(schema);
        
        if (validationResult instanceof NoConstraintViolation) {
            this.schema = schema;
        }else {
            throw validationResult;
        };
    };
    
    checkSchema(schema) {
        if (!schema || typeof(schema) != 'object') {
            return new MandatoryValueConstraintViolation('Error - data type schema must be a nonempty object')
        } else {
            return new NoConstraintViolation();
        }
    };

    setName(name) {
        var validationResult = dataTypeModel.checkNameAsId(name);
        if (validationResult instanceof NoConstraintViolation) {
            this.name = name;
        } else {
            throw validationResult;
        };
    };
    // checkNameAsId() checker defined in ES5 way below (in order to enable access to static store)

    static subscribe(callback) {
        dataTypeModel.onChange.push(callback)
    };

    static _add(initData, cb) {
        try {
            var newDataType = new dataTypeModel(initData);
        }catch(e) {
            console.log( e.constructor.name +": "+ e.message);
            newDataType = null;
        }
        if (newDataType) {
            dataTypeModel.elements.push(newDataType);
            console.log('Created a data type object "' + initData.name + '"');
            dataTypeModel.inform();
            typeof(cb) == 'function' && cb(newDataType);
        }
    };

    static create(initData) {
        this._add(initData,(newDS) => {this._save(newDS);});
    };

    static loadAll() {
        db.dataSources.find({}, (err, records) => {
            records.forEach( (record) => {
                this._add(record);
            });
        });
    };

    static addDummy() {
        var initD ={name: 'Dummy Data Source Model',
            dataTypes: [{name: 't1'}, {name:'t2'}],
            dropboxFileLocation: '~/Dropbox/Apps/sraps',
            parserPath: 'dummy.py'
        };

        dataTypeModel._add(initD);
    };
    static _save(dsModel) {
        db.dataSources.insert(dsModel);
    };
    static destroy(dsModelName){
        db.dataSources.remove({name: dsModelName});
        //TODO: remove the crappy elements array and replace hash map object
        var  moduleIndex;
        this.elements.forEach((val, i) => {if(val.name == dsModelName) moduleIndex = i;})
        this.elements.splice(moduleIndex, 1);
        this.inform();
        //TODO:  ensure cleaning up of the parser script, folder etc.
    };
    static destroyAll(){

    }
    // TODO: check if it's the React way

};

dataTypeModel.elements = [];
dataTypeModel.onChange = [];
dataTypeModel.inform = function inform() {
    dataTypeModel.onChange.forEach((cb) => {cb()});
};

dataTypeModel.checkNameAsId = function(name) {
    var validationResult = DataProcessorModel.checkName(name);
    if (validationResult instanceof NoConstraintViolation) {
        if (!name) {
            validationResult = new MandatoryValueConstraintViolation("Name of a registered dataSource has to be specified");
        } else if (dataTypeModel.elements.filter((ds) => {if (ds.name == name) return true}).length > 0) {  // nasty way of checking element with given name alredy exists in the elements array
            validationResult =  new UniquenessConstrainViolation("There is already a data source called " + name)
        };
    };

    return validationResult;
};


module.exports = dataTypeModel;