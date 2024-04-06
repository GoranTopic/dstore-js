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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const parsePath_1 = __importDefault(require("./utils/parsePath"));
const async_mutex_1 = require("async-mutex");
// module export 
const modules_1 = require("./modules");
class Storage {
    constructor({ type, path, keyValue, mutex, url, database }) {
        this.type = type;
        this.path = path !== null && path !== void 0 ? path : path_1.default.join(process.cwd(), 'storage');
        this.keyValue = keyValue !== null && keyValue !== void 0 ? keyValue : false;
        this.mutex = mutex !== null && mutex !== void 0 ? mutex : true;
        this.url = url !== null && url !== void 0 ? url : '';
        this.database = database !== null && database !== void 0 ? database : '';
    }
    open(name) {
        return __awaiter(this, void 0, void 0, function* () {
            // initileze the store
            let store = new Store({
                type: this.type,
                path: this.path,
                keyValue: this.keyValue,
                mutex: this.mutex,
                url: this.url,
                database: this.database
            });
            // open database
            yield store.open(name);
            // return the store
            return store;
        });
    }
}
class Store {
    constructor({ type, path, keyValue, mutex, url, database }) {
        this.add = this.set;
        this.push = this.set;
        this.write = this.set;
        this.read = this.get;
        this.all = this.getAll;
        this.list = this.getAll;
        // handle path 
        if (path) {
            let { dir, name } = (0, parsePath_1.default)(path);
            // if path is not an dir
            if (name === 'file')
                throw new Error('path must be a directory');
            // if path is dir
            this.path = dir;
        }
        else // working dir + /sotrage
            this.path = path_1.default.join(process.cwd(), 'storage');
        // create the directory if it does not exist
        if (!fs_1.default.existsSync(this.path))
            fs_1.default.mkdirSync(this.path);
        // handle keyValue, default is true
        this.keyValue = keyValue !== null && keyValue !== void 0 ? keyValue : false;
        // handle mutex, defaul is ot use mutex
        this.mutex = mutex === false ? null : new async_mutex_1.Mutex();
        // handle type, chose the storage depending on the type
        if (type === 'json') {
            this.storage = new modules_1.JsonStorage();
        }
        else if (type === 'jsonFile') {
            this.storage = new modules_1.JsonFileStorage();
        }
        else if (type === 'cvs') {
            this.storage = new modules_1.CvsStorage();
        }
        else if (type === 'sqlite') {
            this.storage = new modules_1.SqliteStorage();
        }
        else if (type === 'binary') {
            this.storage = new modules_1.BinaryStorage();
        }
        else if (type === 'mongodb') {
            // if url or database is not defined throw an error
            if (!url || !database)
                throw new Error('url and database must be defined');
            // set mutex to null, because mongodb is already thread safe
            this.mutex = null;
            // disable keyValue, because mongodb is a key value storage
            this.keyValue = false;
            // create the storage
            this.storage = new modules_1.MongodbStorage({ url, database });
        }
        else // if type is not supported
            throw new Error(`type ${type} is not supported`);
        // handle indexing of values, if keyValue is false
        this.index = (!this.keyValue) ? 0 : -1;
    }
    open(name) {
        return __awaiter(this, void 0, void 0, function* () {
            // open database
            yield this.storage.open({ name: name, path: this.path });
        });
    }
    set(first, second) {
        return __awaiter(this, void 0, void 0, function* () {
            let { key, value } = this._handleInputs(first, second);
            // promise to run
            return yield this._mutex(() => __awaiter(this, void 0, void 0, function* () { return yield this.storage.set(key, value); }));
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._mutex(() => __awaiter(this, void 0, void 0, function* () { return yield this.storage.get(key); }));
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._mutex(() => __awaiter(this, void 0, void 0, function* () { return yield this.storage.getAll(); }));
        });
    }
    has(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._mutex(() => __awaiter(this, void 0, void 0, function* () { return (yield (yield this.storage.get(key))) ? true : false; }));
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._mutex(() => __awaiter(this, void 0, void 0, function* () { return yield this.storage.remove(key); }));
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._mutex(() => __awaiter(this, void 0, void 0, function* () { return yield this.storage.delete(); }));
        });
    }
    _handleInputs(first, second) {
        let key, value;
        if (this.keyValue) {
            key = first;
            value = second;
        }
        else {
            key = ++this.index;
            value = first;
        }
        return { key, value };
    }
    _mutex(promise) {
        return this.mutex ?
            this.mutex.runExclusive(promise) :
            promise();
    }
}
exports.default = Storage;
