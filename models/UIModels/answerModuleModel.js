/**
 * Created by mpio on 19/05/16.
 */
var UIModel = require('./UIModel');

class answerModuleModel extends UIModel {
    constructor(initData) {
        super(initData);
    };
    static add(initData) {
        var newDataSource = new answerModuleModel(initData);
        answerModuleModel.elements.push(newDataSource);
        console.log('Created a data source object "' + initData.name + '"');
    }
    static addDummy() {
        var initD ={name: 'Dummy AM Model',
            types: ['t1', 't2'],
            description: "playin'",
            author: 'Jam',
            version: '0.0.1',
            folder: '~/Dropbox/Apps/sraps',
            schedule: 'NA'};

        answerModuleModel.add(initD);
        return answerModuleModel.elements['Dummy Data Source'];
    }
    static destroy(){

    }
    static destroyAll(){

    }
    static loadAll() {

    }

}

answerModuleModel.elements = [];
//answerModuleModel.elements = [];

module.exports = answerModuleModel;