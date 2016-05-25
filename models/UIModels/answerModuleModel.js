/**
 * Created by mpio on 19/05/16.
 */
var UIModel = require('./UIModel'),
    db      = process.mainModule.exports.db;;

class answerModuleModel extends UIModel {
    constructor(initData) {
        super(initData);

        this.name              = initData.name;
        this.scriptPath        = initData.scriptPath;
        this.dropboxDirectory  = initData.dropboxDirectory;
        this.requiredDataTypes = initData.requiredDataTypes || 'N/A';
    };
    static subscribe(callback) {
        answerModuleModel.onChange.push(callback)
    };


    static add(initData, save = false) {
        var newAnswerModule = new answerModuleModel(initData);
        answerModuleModel.elements.push(newAnswerModule);
        console.log('Created a answer module object "' + initData.name + '"');

        answerModuleModel.inform();
        if (save) {
            db.answerModules.insert()
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
    static destroy(){

    }
    static destroyAll(){

    }
    // TODO: check if it's the React way

};

answerModuleModel.elements = [];
answerModuleModel.onChange = [];
answerModuleModel.inform = function inform() {
    answerModuleModel.onChange.forEach((cb) => {cb()})
}
//answerModuleModel.elements = [];


module.exports = answerModuleModel;