import fs from 'fs';
import osPath from 'path';
import parsePath from './utils/parsePath.js';      
import { Mutex } from 'async-mutex';
import cvsStorage from './modules/cvsStorage.js';
import sqliteStorage from './modules/sqliteStorage.js';
import jsonStorage from './modules/jsonStorage.js';
import jsonFileStorage from './modules/jsonFileStorage.js';
import binaryStorage from './modules/binaryStorage.js';

/*
// hash a new name based on the values
this._name = ( name ? name :  
    hash(values, { unorderedArrays: true } )) + ".json"

let tmp_path = '';
// if it is windows, set the tmp path to the user temp folder
if(os.platform() === 'win32') tmp_path = os.tmpdir();
// if it is on linux, set the tmp path to /tmp/checklists
else if(os.platform() === 'linux') tmp_path = '/tmp/';
// if it is on mac, set the tmp path to /tmp/checklists
else if(os.platform() === 'darwin') tmp_path = '/tmp/';

// try to read the file from memeory
try{  // get the check list form memory
    let string_file = fs.readFileSync(this._filename);
    let json_list = JSON.parse(string_file);
    // shuffe if is enabled
    if(shuffle) 
        json_list = [ ...json_list].sort(() => Math.random() - 0.5);
    this._checklist = new Map(json_list);
}catch(e){ // otherwise make a new checklist
    this._checklist = new Map();
}

// if you want to mantain the original missing list of value after checks
        this._filename = osPath.join( this._tmp_path, this._name);

// if custom path is not defined
       if(path === undefined) // make a tmp folder
            this._tmp_path = tmp_path
        else // set the directory path
            this._tmp_path = path
*/

class Storage {
    constructor({ type, path, keyValue, mutex }){
        this.type = type;
        this.path = path;
        this.keyValue = keyValue;
        this.mutex = mutex;
    }

    async open(name) {
        // initileze the store
        let store = new Store({ 
            type: this.type, 
            path: this.path,
            keyValue: this.keyValue,
        });
        // open database
        await store.open(name);
        // return the store
        return store;
    }
}


class Store {
    constructor({ type, path, keyValue, mutex }) {
        // handle path 
        if(path){
            let { dir, name } = parsePath(path);
            // if path is not an dir
            if(name === 'file') throw new Error('path must be a directory');
            // if path is dir
            this.path = dir;
        } else  // working dir + /sotrage
            this.path = osPath.join(process.cwd(), 'storage');
        // create the directory if it does not exist
        if(!fs.existsSync(this.path)) fs.mkdirSync(this.path);
        // handle keyValue, default is true
        this.keyValue = keyValue ?? false;
        // handle mutex, defaul is ot use mutex
        this.mutex = mutex === false? null : new Mutex();
        // handle type, chose the storage depending on the type
        if(type === 'json'){
            this.storage = new jsonStorage();
        } else if(type === 'jsonFile') {
            this.storage = new jsonFileStorage();
        } else if(type === 'cvs') {
            this.storage = new cvsStorage();
        } else if(type === 'sqlite') {
            this.storage = new sqliteStorage();
        } else if(type === 'binary') {
            this.storage = new binaryStorage();
        } else // if type is not supported
            throw new Error(`type ${type} is not supported`);
        // handle indexing of values, if keyValue is false
        if(!this.keyValue) this.index = 0;
    }

    async open(name) {
        // open database
        await this.storage.open({name: name, path: this.path});
    }

    async set(first, second) {
        let { key, value } = this._handleInputs(first, second);
        // promise to run
        return await this._mutex(
            async () => await this.storage.set(key, value)
        );
    }

    async get(key) {
        return await this._mutex(
            async () => await this.storage.get(key)
        );
    }

    async getAll() {
        return await this._mutex(
            async () => await this.storage.getAll()
        );
    }

    async has(key) {
        return await this._mutex(
            async () => await (await this.storage.get(key))? true : false
        );
    }

    async remove(key) {
        return await this._mutex(
            async () => await this.storage.remove(key)
        );
    }

    async delete() {
        return await this._mutex(
            async () => await this.storage.delete()
        );
    }

    _handleInputs(first, second) {
        let key, value;
        if(this.keyValue) {
            key = first;
            value = second;
        } else {
            key = ++this.index;
            value = first;
        }
        return { key, value };
    }

    _mutex(promise) {
        return this.mutex?
            this.mutex.runExclusive(promise) :
            promise();
    }



    add = this.set;
    push = this.set;
    write = this.set;

    read = this.get;

    all = this.getAll;
    list = this.getAll;
}


export default Storage;
