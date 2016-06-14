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

        this.cache_db_name = initData.cache_db_name || this.name + '_' + this.dataSource + '.db';
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
            var newDataTypeName = newDataType.name;
            dataTypeModel.elements[newDataTypeName] = newDataType;
            dataTypeModel.inform();
            typeof(cb) == 'function' && cb(newDataType);
        }
    };

    static create(initData) {
        this._add(initData,(newDT) => {this._save(newDT);});
    };

    static loadAll() {
        db.dataTypes.find({}, (err, records) => {
            records.forEach( (record) => {
                console.log('Found data type '+record.name+' in the db. Proceeding to loading it to the model');
                this._add(record);
            });
        });
    };

    static addDummy() {
        var initD ={
            "dataSource" : "Digital-Halo",
            "name"       : "sromain",
            "description": "Stores unique sromain colors 'up to one dot before the ",
            "schema": {
                "game": "TEXT UNIQUE",
                "general": "INT",
                "specific": "INT",
                "private": "INT",
                "public": "TEXT"
            }
        };

        dataTypeModel._add(initD);
    };
    static _save(dtModel) {
        db.dataTypes.insert(dtModel);
    };

    static getOne(query) {
        //TODO: implement in datatype, AM and datasource
    };

    static getAllforDataSource() {
        //TODO
    };


    static destroy(dtModelName){
        db.dataTypes.remove({name: dtModelName});
        
        delete(this.elements[dtModelName]);
        this.inform();
        //TODO:  ensure cleaning up of the parser script, folder etc.
    };
    static destroyAll(){
        //TODO: destroy them all
    }
};

dataTypeModel.elements = {};
dataTypeModel.onChange = [];
dataTypeModel.inform = function inform() {
    dataTypeModel.onChange.forEach((cb) => {cb()});
};

dataTypeModel.checkNameAsId = function(name) {
    var validationResult = DataProcessorModel.checkName(name);
    if (validationResult instanceof NoConstraintViolation) {
        if (!name) {
            validationResult = new MandatoryValueConstraintViolation("Name of a registered dataSource has to be specified");
        } else if (dataTypeModel.elements[name]) {  // data type alredy exists?
            validationResult =  new UniquenessConstrainViolation("There is already a data type called " + name)
        };
    };

    return validationResult;
};


module.exports = dataTypeModel;