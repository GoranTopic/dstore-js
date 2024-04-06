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
const mongodb_1 = require("mongodb");
const Storage_1 = __importDefault(require("./types/Storage"));
class MongodbStorage extends Storage_1.default {
    constructor({ url, database }) {
        super();
        // this function is the constructor for the class
        this.url = url;
        this.client = new mongodb_1.MongoClient(url);
        this.database = database;
        this.collection = undefined;
    }
    open(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name }) {
            // this function opens the stora
            // in this case path would be the endpoint of the database
            this.collection = name;
            yield this.client.connect();
            // make sure to replace the database name with the name of your database
            this.database = this.client.db(this.database);
            // make a collection 
            this.collection = this.database.collection(this.collection);
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            // lets ignore the key for now and just pass the value
            return yield this.collection.insertOne(value);
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // this function retrives a value with a key
            return yield this.collection.find(key).toArray();
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            // this function returns all the values in the storage
            return yield this.collection.find({}).toArray();
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // this function removes a value with a key
            return yield this.collection.deleteMany(key);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            // this function deletes the entire storage
            yield this.collection.drop();
            return yield this.client.close();
        });
    }
}
exports.default = MongodbStorage;
