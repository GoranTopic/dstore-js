"use strict";
/* this inner function check if paramter is a js object
 * this is used to handle values which are not objects */
Object.defineProperty(exports, "__esModule", { value: true });
const isObject = (objValue) => {
    return (objValue &&
        (typeof objValue === 'object') &&
        (objValue.constructor === Object));
};
exports.default = isObject;
