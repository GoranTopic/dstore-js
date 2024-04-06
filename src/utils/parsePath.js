"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
/*
 * if this is a path, reconize if it is a file or a directory
 * if it is a file, return the file name and the directory
 */
const parsePath = (input) => {
    const pathObj = node_path_1.default.parse(input);
    // check if the path could be parsed
    if (pathObj.name === input)
        throw new Error(`${input} path could not be parsed`);
    return pathObj;
};
exports.default = parsePath;
