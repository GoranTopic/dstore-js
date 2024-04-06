"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Storage_1 = __importDefault(require("./types/Storage"));
let files_js = require('files-js');
const { write_json, read_json, delete_json, mkdir, ls_files, rm_dir } = files_js;
const path_1 = __importDefault(require("path"));
class jsonStorage extends Storage_1.default {
    constructor() {
        super();
        this.path = '';
    }
    open(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, path }) {
            // let make a dir with the name on the path
            path = path_1.default.join(path, name);
            mkdir(path);
            // save the path for later use
            this.path = path;
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            // if key is a number, convert it to string
            if (typeof key === 'number')
                key = this._convet_to_string_int(key);
            // check if value is a js object
            if (typeof value !== 'object') {
                throw new Error('value must be a js object');
            }
            return write_json(value, path_1.default.join(this.path, key + '.json'), { format: true });
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof key === 'number')
                key = this._convet_to_string_int(key);
            return read_json(path_1.default.join(this.path, key + '.json'));
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            let files = ls_files(this.path);
            let jsons = [];
            // for each file, read it and return it
            for (let file of files)
                // get base name if file 
                jsons.push({
                    key: path_1.default.basename(file, '.json'),
                    value: read_json(path_1.default.join(this.path, file))
                });
            return jsons;
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof key === 'number')
                key = this._convet_to_string_int(key);
            return delete_json(path_1.default.join(this.path, key + '.json'));
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            let files = ls_files(this.path);
            for (let i = 0; i < files.length; i++)
                delete_json(files[0]);
            // delete the dir
            rm_dir(this.path);
        });
    }
    _convet_to_string_int(num) {
        let n = 10; // Change this to the number of zeros you want to add
        // convert number to string
        let integerStr = num.toString();
        // get the number of digits
        let digits = integerStr.length;
        // Concatenate zeros to the left
        let resultStr = "0".repeat(n - digits) + integerStr;
        // Return the result
        return resultStr;
    }
}
exports.default = jsonStorage;
