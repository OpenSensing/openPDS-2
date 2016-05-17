function AnswerModule() {
    this.elements = [{
        dropboxDirectory: "/dropbox/",
        dataTypes: ["location", "bluetooth"],
        name: "Digital Halo",
        description: "Mock answer module"
    }];
}

AnswerModule.prototype.serialize = function (object) {

    var dataTypesString = object.dataTypes.map(function (dataType) {
        return dataType + " ";
    });

    var pairs = [];

    pairs.push({name: "Description", value: object.description});
    pairs.push({name: "Data types", value: dataTypesString});
    pairs.push({name: "Dropbox folder", value: object.dropboxDirectory});

    return pairs;
};

AnswerModule.prototype.all = function (cb) {
    cb(null, this.elements);
};

module.exports = AnswerModule;