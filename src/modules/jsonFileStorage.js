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
const { write_json, read_json, delete_json } = files_js;
const path_1 = __importDefault(require("path"));
class jsonFileStorage extends Storage_1.default {
    constructor() {
        super();
        this.json = {};
        this.path = '';
    }
    open(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, path }) {
            // let make a dir with the name on the path
            this.path = path_1.default.join(path, `${name}.json`);
            // hole entire json in memory
            this.json = {};
            // if file exists, read it
            if (read_json(this.path))
                this.json = read_json(this.path);
            // write the json to the file, otherwise create the file
            else
                write_json(this.json, this.path, { format: true });
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            // add to json
            this.json[key] = value;
            // write to file
            write_json(this.json, this.path, { format: true });
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // convet key which can be any type to string
            return this.json[key];
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            // return all values in json
            let data = [];
            if (this.json)
                data = Object.keys(this.json).
                    map(key => ({ key, value: this.json[key] }));
            return data;
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // remove key from json in memory
            delete this.json[key];
            // write to file
            write_json(this.json, this.path, { format: true });
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            // delete the file
            this.json = {};
            delete_json(this.path);
        });
    }
}
exports.default = jsonFileStorage;
