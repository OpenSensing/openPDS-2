/**
 * Created by mpio on 19/05/16.
 */

var UIModel = require('./UIModel'),
    db      = process.mainModule.exports.db;
var ValidationErrors = require('../errorTypes'),
    NoConstraintViolation    = ValidationErrors.NoConstraintViolation,
    MandatoryValueConstraintViolation = ValidationErrors.MandatoryValueConstraintViolation,
    UniquenessConstrainViolation = ValidationErrors.UniquenessConstraintViolation;

class answerModuleModel extends UIModel {
    constructor(initData) {
        super(initData);

        this.setName(initData.name);

        this.scriptPath          = initData.scriptPath || 'N/A';
        this.dropboxDirectory = initData.dropboxDirectory || 'N/A';
        this.requiredDataTypes   = initData.requiredDataTypes || 'N/A';
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

    static add(initData) {
        try {
            var newDataSource = new answerModuleModel(initData);
        }catch(e) {
            console.log( e.constructor.name +": "+ e.message);
            newDataSource = null;
        }
        if (newDataSource) {
            answerModuleModel.elements.push(newDataSource);
            console.log('Created an Answer Module object "' + initData.name + '"');
            answerModuleModel.inform();
            this._save(newDataSource);
        }
    };

    static loadAll() {
        db.answerModules.find({}, (err, records) => {
            records.forEach( (record) => {
                this.add(record);
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

        answerModuleModel.add(initD);
    }

    static _save(amModel) {
        db.answerModules.insert(amModel);
    };

    static destroy(amModelName){
        db.answerModules.remove(amModelName);
        //TODO: remove the crappy elements array with an aobject
        var  moduleIndex;
        answerModuleModel.elements.forEach((val, i) => {if(val.name == amModelName.name) moduleIndex = i;})
        answerModuleModel.elements.splice(moduleIndex, 1);
        this.inform();
        //TODO:  ensure cleaning up of the AM script, folder etc.
    };
    static destroyAll(){

    };
    // TODO: check if it's the React way

};

answerModuleModel.elements = [];
answerModuleModel.onChange = [];
answerModuleModel.inform = function inform() {
    answerModuleModel.onChange.forEach((cb) => {cb()})
};

answerModuleModel.checkNameAsId = function(name) {
    var validationResult = UIModel.checkName(name);
    if (validationResult instanceof NoConstraintViolation) {
        if (!name) {
            validationResult = new MandatoryValueConstraintViolation("Name of a registered dAnswer module has to be specified");
        } else if (answerModuleModel.elements.filter((ds) => {if (ds.name == name) return true}).length > 0) {  // nasty way of checking element with given name alredy exists in the elements array
            validationResult =  new UniquenessConstrainViolation("There is already an Answer Module called " + name)
        };
    };

    return validationResult;
};


module.exports = answerModuleModel;