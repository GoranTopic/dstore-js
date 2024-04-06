"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteStorage = exports.MongodbStorage = exports.JsonStorage = exports.JsonFileStorage = exports.CvsStorage = exports.BinaryStorage = void 0;
const binaryStorage_1 = __importDefault(require("./binaryStorage"));
exports.BinaryStorage = binaryStorage_1.default;
const cvsStorage_1 = __importDefault(require("./cvsStorage"));
exports.CvsStorage = cvsStorage_1.default;
const jsonFileStorage_1 = __importDefault(require("./jsonFileStorage"));
exports.JsonFileStorage = jsonFileStorage_1.default;
const jsonStorage_1 = __importDefault(require("./jsonStorage"));
exports.JsonStorage = jsonStorage_1.default;
const mongodbStorage_1 = __importDefault(require("./mongodbStorage"));
exports.MongodbStorage = mongodbStorage_1.default;
const sqliteStorage_1 = __importDefault(require("./sqliteStorage"));
exports.SqliteStorage = sqliteStorage_1.default;
