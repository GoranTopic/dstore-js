"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* this inner function check if paramter is an Array
 * this is used to handle args which might be an array */
const isArray = (arrayValue) => {
    return (arrayValue &&
        (typeof arrayValue === 'object') &&
        (arrayValue.constructor === Array));
};
exports.default = isArray;
