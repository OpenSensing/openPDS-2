/**
 * @fileOverview  Defines error classes (also called "exception" classes)
 * @author Gerd Wagner
 */
/**
 * Rewritten in ES6 and commonJS by Mieszko Manijak on 25/05/16.
 */
"use strict";
module.exports.NoConstraintViolation = class NoConstraintViolation{
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

module.exports.MandatoryValueConstraintViolation = class MandatoryValueConstraintViolation extends ConstraintViolation {
    constructor(msg, culprit){
        super(msg, culprit);
    };
};

module.exports.RangeConstraintViolation = class RangeConstraintViolation extends ConstraintViolation {
    constructor(msg, culprit){
        super(msg, culprit);
    };
};


module.exports.IntervalConstraintViolation = class IntervalConstraintViolation extends ConstraintViolation {
    constructor(msg, culprit){
        super(msg, culprit);
    };
};

module.exports.PatternConstraintViolation = class PatternConstraintViolation extends ConstraintViolation{
    constructor(msg, culprit){
        super(msg, culprit);
    };
};

module.exports.UniquenessConstraintViolation = class UniquenessConstraintViolation extends ConstraintViolation {
    constructor(msg, culprit){
        super(msg, culprit);
    };
};

module.exports.OtherConstraintViolation = class OtherConstraintViolation extends ConstraintViolation{
    constructor(msg, culprit){
        super(msg, culprit);
    };
};
