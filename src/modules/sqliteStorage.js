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
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
let files_js = require('files-js');
const { rm_file } = files_js;
class sqliteStorage extends Storage_1.default {
    constructor() {
        super();
        this.file = undefined;
        this.db = undefined;
    }
    open(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, path }) {
            // this function opens the storage
            this.file = path + '/' + name + '.sqlite';
            this.db = yield (0, sqlite_1.open)({
                filename: this.file,
                driver: sqlite3_1.default.Database
            });
            try { // create colums
                yield this.db.exec('CREATE TABLE storage ( key TEXT PRIMARY KEY, value TEXT, type TEXT)');
            }
            catch (e) {
                if (e.code !== 'SQLITE_ERROR')
                    throw e;
            }
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let [valueStr, type] = this._parseValue(value);
            // if we have a value with the same key, we update it
            let result;
            try {
                result = yield this.db.get(`SELECT value FROM storage WHERE key = '${key}'`);
            }
            catch (e) {
                if (e.code !== 'SQLITE_ERROR')
                    throw e;
                else
                    result = undefined;
            }
            if (result) {
                yield this.db.exec(`UPDATE storage SET value = '${valueStr}', type = '${type}' WHERE key = '${key}'`);
            }
            else {
                //console.log(`INSERT INTO storage (key, value, type) VALUES ( '${key}', '${valueStr}', '${type}')`)
                yield this.db.exec(`INSERT INTO storage (key, value, type) VALUES ( '${key}', '${valueStr}', '${type}')`);
            }
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // this function retrives a value with a key
            let result;
            try {
                result = yield this.db.get(`SELECT value, type FROM storage WHERE key = '${key}'`);
            }
            catch (e) {
                if (e.code !== 'SQLITE_ERROR')
                    throw e;
                else
                    result = undefined;
            }
            if (!result)
                return undefined;
            if (result.value === 'undefined')
                return undefined;
            return this._parseString(result.value, result.type);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            // this function returns all the values in the storage
            const results = yield this.db.all(`SELECT key, value, type FROM storage`);
            if (results.length === 0)
                return [];
            // convert the values to the original type
            let values = results.map((result) => ({
                key: result.key,
                value: this._parseString(result.value, result.type)
            }));
            return values;
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // this function removes a value with a key
            let result;
            try {
                result = yield this.db.get(`SELECT value FROM storage WHERE key = '${key}'`);
            }
            catch (e) {
                if (e.code !== 'SQLITE_ERROR')
                    throw e;
                else
                    result = undefined;
            }
            if (!result)
                return undefined;
            yield this.db.exec(`DELETE FROM storage WHERE key = '${key}'`);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            // this function deletes the entire storage
            yield this.db.exec(`DELETE FROM storage`);
            // remove the file
            rm_file(this.file);
        });
    }
    _parseValue(value) {
        // convert any type to string and save the type
        if (typeof value === 'object') {
            return [JSON.stringify(value), 'object'];
        }
        else if (typeof value === 'string') {
            return [value, 'string'];
        }
        else if (typeof value === 'number') {
            return [value.toString(), 'number'];
        }
        else if (typeof value === 'function') {
            return [value.toString(), 'function'];
        }
        else if (typeof value === 'boolean') {
            return [value.toString(), 'boolean'];
        }
        else if (typeof value === 'undefined') {
            return ['undefined', 'undefined'];
        }
        else
            throw new Error('Invalid value type');
    }
    _parseString(value, type) {
        // convert back any string into the original type
        if (type === 'object') {
            return JSON.parse(value);
        }
        else if (type === 'string') {
            return value;
        }
        else if (type === 'number') {
            return Number(value);
        }
        else if (type === 'function') {
            return eval(value);
        }
        else if (type === 'boolean') {
            return Boolean(value);
        }
        else if (type === 'undefined') {
            return undefined;
        }
    }
}
exports.default = sqliteStorage;
