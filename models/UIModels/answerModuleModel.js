/**
 * Created by mpio on 19/05/16.
 */
var UIModel = require('./UIModel'),
    db      = process.mainModule.exports.db;;

class answerModuleModel extends UIModel {
    constructor(initData) {
        super(initData);
    };
    static subscribe(callback) {
        answerModuleModel.onChange.push(callback)
    };

    //static inform() {
    //    this.constructor.onChange.forEach((cb) => {
    //            cb();
    //    });
    //};


    static add(initData) {
        var newAnswerModule = new answerModuleModel(initData);
        answerModuleModel.elements.push(newAnswerModule);
        console.log('Created a answer module object "' + initData.name + '"');

        answerModuleModel.inform();
    };

    static loadAll() {
        db.answerModules.find({}, (err, records) => {
            records.forEach( (record) => {
            this.add(record);
            });
        });
    };

    static addDummy() {
        var initD ={name: 'Dummy AM Source Model',
            types: ['t1', 't2'],
            description: "playin'",
            author: 'Jam',
            version: '0.0.1',
            folder: '~/Dropbox/Apps/sraps',
            schedule: 'NA'};

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