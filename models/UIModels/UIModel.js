/**
 * Created by mpio on 18/05/16.
 */
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

/*function UIModel (initData) {
    if (initData.name == undefined) throw 'Error while creating new dataSource object, no "name" specified';

    this.elements = {};
    this.elements.types       = initData.types || '';
    this.elements.folder      = initData.folder || '';
    this.elements.description = initData.description || '';
    this.elements.name        = initData.name;
    this.elements.author      = initData.author || '';
    this.elements.version     = initData.version || '';
    this.elements.schedule    = initData.schedule || '';
}*/
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

/*UIModel.prototype.serialize = function () {
    var expanded = [];
    var self = this;

    for (var key in self.elements) {
        expanded.push({name: key, value: self.elements[key].toString()})
    };

    return expanded;
};*/


UIModel.prototype.all = function (cb) {
    cb(null, this);
};

module.exports = UIModel;