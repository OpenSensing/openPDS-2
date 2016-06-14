/**
 * Created by mpio on 19/05/16.
 */

var DataProcessorModel = require('./DataProcessorModel'),
    db      = process.mainModule.exports.db;
var ValidationErrors = require('../errorTypes'),
    NoConstraintViolation    = ValidationErrors.NoConstraintViolation,
    MandatoryValueConstraintViolation = ValidationErrors.MandatoryValueConstraintViolation,
    UniquenessConstrainViolation = ValidationErrors.UniquenessConstraintViolation;

class answerModuleModel extends DataProcessorModel {
    constructor(initData) {
        super(initData);

        this.setName(initData.name);

        this.scriptPath          = initData.scriptPath || 'N/A';
        this.dropboxDirectory = initData.dropboxDirectory || 'N/A';
        this.requiredDataTypes   = initData.requiredDataTypes || ['N/A'];
    };

    setName(name) {
        var validationResult = answerModuleModel.checkNameAsId(name);
        if (validationResult instanceof NoConstraintViolation) {
            this.name = name;
        } else {
            throw validationResult;
        };
    };

    static subscribe(callback) {
        answerModuleModel.onChange.push(callback)
    };

    static _add(initData, cb) {
        try {
            var newAnswerModule = new answerModuleModel(initData);
        }catch(e) {
            console.log( e.constructor.name +": "+ e.message);
            newAnswerModule = null;
        }
        if (newAnswerModule) {
            var newAnswerModuleName = newAnswerModule.name;
            answerModuleModel.elements[newAnswerModuleName] = newAnswerModule;
            console.log('Created an Answer Module object "' + initData.name + '"');
            answerModuleModel.inform();

            typeof(cb) =='function' && cb(newAnswerModule);
        }
    };

    static create(iniitData) {
        this._add(iniitData,(newAM) => {this._save(newAM);});
    };

    static loadAll() {
        db.answerModules.find({}, (err, records) => {
            records.forEach( (record) => {
                this._add(record);
            });
        });
    };

    static addDummy() {
        var initD = {
            name: 'Dummy AM Source Model',
            requiredDataTypes: ['t1', 't2'],
            dropboxDirectory: '~/Dropbox/Apps/sraps',
            scriptPath: 'script.py'
        }

        answerModuleModel._add(initD);
    }

    static _save(amModel) {
        db.answerModules.insert(amModel);
    };

    static getOne(query) {
        //TODO: implement in datatype, AM and datasource
    };


    static destroy(amModelName){
        db.answerModules.remove({name: amModelName});

        delete(this.elements[amModelName]);
        this.inform();
        //TODO:  ensure cleaning up of the AM script, folder etc.
    };
    static destroyAll(){

    };
    // TODO: check if it's the React way

};

answerModuleModel.elements = {};
answerModuleModel.onChange = [];
answerModuleModel.inform = function inform() {
    answerModuleModel.onChange.forEach((cb) => {cb()})
};

answerModuleModel.checkNameAsId = function(name) {
    var validationResult = DataProcessorModel.checkName(name);
    if (validationResult instanceof NoConstraintViolation) {
        if (!name) {
            validationResult = new MandatoryValueConstraintViolation("Name of a registered dAnswer module has to be specified");
        } else if (answerModuleModel.elements[name]) {  // element already exists?
            validationResult =  new UniquenessConstrainViolation("There is already an Answer Module called " + name)
        };
    };

    return validationResult;
};


module.exports = answerModuleModel;