/**
 * @fileOverview  Defines error classes (also called "exception" classes)
 * @author Gerd Wagner
 */
/**
 * Rewritten in ES6 and commonJS by Mieszko Manijak on 25/05/16.
 */
"use strict";
module.exports.NoConstraintViolation = class {
    constructor() {
        this.message = "";
    };
};

class ConstraintViolation {
    constructor ( msg, culprit) {
        this.message = msg;
        if (culprit) this.culprit = culprit;
    };
};

module.exports.MandatoryValueConstraintViolation = class extends ConstraintViolation {
    constructor(msg, culprit){
        super(msg, culprit);
    };
};

module.exports.RangeConstraintViolation = class extends ConstraintViolation {
    constructor(msg, culprit){
        super(msg, culprit);
    };
};


module.exports.IntervalConstraintViolation = class extends ConstraintViolation {
    constructor(msg, culprit){
        super(msg, culprit);
    };
};

module.exports.PatternConstraintViolation = class extends ConstraintViolation{
    constructor(msg, culprit){
        super(msg, culprit);
    };
};

module.exports.UniquenessConstraintViolation = class extends ConstraintViolation {
    constructor(msg, culprit){
        super(msg, culprit);
    };
};

module.exports.OtherConstraintViolation = class extends ConstraintViolation{
    constructor(msg, culprit){
        super(msg, culprit);
    };
};
