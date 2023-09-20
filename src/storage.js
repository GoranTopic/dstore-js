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
        // use a big number to avoid collisions
        this.index = 0;
    }

    open(name) {
        return new Store({ 
            type: this.type, 
            path: this.path,
            keyValue: this.keyValue,
            name: name
        });
    }
}


class Store {
    constructor({ type, path, keyValue, name }) {
        // handle type
        if(type === 'json') 
            this.storage = new jsonStorage(path);
        else if(type === 'jsonFile')
            this.storage = new jsonFileStorage(path);
        else if(type === 'cvs')
            this.storage = new cvsStorage(path);
        else if(type === 'sqlite')
            this.storage = new sqliteStorage(path);
        else if(type === 'binary')
            this.storage = new binaryStorage(path);
        else // if type is not supported
            throw new Error(`type ${type} is not supported`);
        // handle path
        if(path){
            let { dir, name } = parsePath(path);
            // if path is not an dir
            if(name === 'file') throw new Error('path must be a directory');
            // if path is dir
            path = dir;
        } else  // working dir + /sotrage
            path = osPath.join(process.cwd(), 'storage');
        // create the directory if it does not exist
        if(!fs.existsSync(path)) fs.mkdirSync(path);
        // if the file does not exist
        if(!fs.existsSync(path)) fs.mkdirSync(path);
        // handle keyValue
        this.keyValue = keyValue ?? false;
        // handle mutex
        this.mutex = new Mutex();
        // open data base
        this.storage.open({name, path});
    }

    async set(first, second) {
        let { key, value } = this._handleInputs(first, second);
        return await this.mutex.runExclusive(async () => {
            await storage.set(key, value);
        });
    }
    

    async get(key) {
        return await this.mutex.runExclusive(async () => {
            return await storage.get(key);
        });
    }

    async getAll() {
        return await this.mutex.runExclusive(async () => {
            return await storage.getAll();
        });
    }

    async has(key) {
        return await this.mutex.runExclusive(async () => {
            return (await storage.get(key))? true : false;
        });
    }

    async remove(key) {
        return await this.mutex.runExclusive(async () => {
            return await storage.remove(key);
        });
    }

    async delete() {
        return await this.mutex.runExclusive(async () => {
            console.log('delete mutex run');
            return await storage.delete();
        });
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

    add = this.set;
    push = this.set;

}


export default Storage;
