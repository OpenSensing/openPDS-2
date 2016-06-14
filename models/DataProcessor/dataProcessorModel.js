/**
 * Created by mpio on 18/05/16.
 */
var ValidationErrors = require('../errorTypes'),
    NoConstraintViolation    = ValidationErrors.NoConstraintViolation,
    RangeConstraintViolation = ValidationErrors.RangeConstraintViolation;

class DataProcessorModel {

    constructor(initData) {
        this._id       = initData._id;
        
    };

    serialize() {
        var expanded = [];
        var keys = Object.keys(this);

        var self = this;
        keys.forEach(function (key){
            if (key == 'dataTypes') {
                let dataTypes = self[key].map((dataType) => {return dataType.name});
                expanded.push({name: key, value: dataTypes.toString()})
            } else if (key != '_id') {
                expanded.push({name: key, value: self[key].toString()});
            }
        });

        return expanded;
    };

    static checkName(name) {
        if (!name) return new NoConstraintViolation;
        if (typeof(name) == 'string' || name.trim() != "") {
            return new NoConstraintViolation()
        } else {
            return new RangeConstraintViolation("Name of AM/data source hast to be a nonempty string")
        };
    };
}


module.exports = DataProcessorModel;