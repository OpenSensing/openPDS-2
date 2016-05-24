/**
 * Created by mpio on 18/05/16.
 */
/*
function UIModel (initData) {
    if (initData.name == undefined) throw 'Error while creating new dataSource object, no "name" specified';

    this.name        = initData.name;
    this.types       = initData.types || '';
    this.folder      = initData.folder || '';
    this.description = initData.description || '';
    this.author      = initData.author || '';
    this.version     = initData.version || '';
    this.schedule    = initData.schedule || '';
}

// TODO: checker methods for props

UIModel.prototype.serialize = function () {
    var expanded = [];
    var keys = Object.keys(this);

    var self = this;
    keys.forEach(function (key){
        expanded.push({name: key, value: self[key].toString()})
    });

    return expanded;
};


UIModel.prototype.all = function (cb) {
    cb(null, this);
};

module.exports = UIModel;*/
class UIModel {

    constructor(initData) {
        if (initData.name == undefined) throw 'Error while creating new dataSource object, no "name" specified';

        this.name              = initData.name;
        this.DataTypes         = initData.requiredDataTypes || initData.dataTypes || '';
        this.dropboxLocation   = initData.dropboxDirectory || '' ;
        if (this.dropboxLocation == '') { this.dropboxLocation   = initData.dropboxFileLocation || '' };
        this.description       = initData.description || '';
        this.author            = initData.author || '';
        this.version           = initData.version || '';
        this.lastProcessedAt   = initData.lastProcessingDate || '';
        this.schedule          = initData.schedule || '';
    };

    serialize() {
        var expanded = [];
        var keys = Object.keys(this);

        var self = this;
        keys.forEach(function (key){
            if (key == 'DataTypes' && typeof(self[key][0])== Object) {
                var dts = self[key];
                expanded.push({name:key, value: dts.map(function (dt) {return dt.name}).toString()});
            }else {
                expanded.push({name: key, value: self[key].toString()});
            }
        });

        return expanded;
    };
 
}

// TODO: checker methods for props


module.exports = UIModel;