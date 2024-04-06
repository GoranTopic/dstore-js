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
class SomeStorage extends Storage_1.default {
    open(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, path }) {
            // this function opens the storage
            //
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            // this function sets a value for a key
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // this function retrives a value with a key
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            // this function returns all the values in the storage
        });
    }
    remove(key) {
        return __awaiter(this, void 0, void 0, function* () {
            // this function removes a value with a key
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            // this function deletes the entire storage
        });
    }
}
exports.default = SomeStorage;
