import fs from 'fs';
import osPath from 'path';
import parsePath from './utils/parsePath';
import { Mutex } from 'async-mutex';

// module export 
import { 
    CvsStorage, 
    SqliteStorage,
    JsonStorage,
    JsonFileStorage,
    BinaryStorage,
    MongodbStorage
} from './modules'


class Storage {
    //* this is jsut an initilizer for the store class */
    private type: string;
    private path: string;
    private keyValue: boolean;
    private mutex: boolean;
    private url: string;
    private database: string;

    constructor({ type, path, keyValue, mutex, url, database } : {
        type: string,
        path?: string,
        keyValue?: boolean,
        mutex?: boolean,
        url?: string,
        database?: string
    }) {
        this.type = type;
        this.path = path ?? osPath.join(process.cwd(), 'storage');
        this.keyValue = keyValue ?? false;
        this.mutex = mutex ?? true;
        this.url = url ?? '';
        this.database = database ?? '';
    }

    async open(name: string) : Promise<Store> {
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
        await store.open(name);
        // return the store
        return store;
    }
}


class Store {
    private storage: any;
    private path: string;
    private keyValue: boolean;
    private mutex: Mutex | null;
    private index: number;

    constructor({ type, path, keyValue, mutex, url, database } : {
        type: string,
        path?: string,
        keyValue?: boolean,
        mutex?: boolean,
        url?: string,
        database?: string
    }) {
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
            this.storage = new JsonStorage();
        } else if(type === 'jsonFile') {
            this.storage = new JsonFileStorage();
        } else if(type === 'cvs') {
            this.storage = new CvsStorage();
        } else if(type === 'sqlite') {
            this.storage = new SqliteStorage();
        } else if(type === 'binary') {
            this.storage = new BinaryStorage();
        } else if(type === 'mongodb') {
            // if url or database is not defined throw an error
            if(!url || !database) throw new Error('url and database must be defined');
            // set mutex to null, because mongodb is already thread safe
            this.mutex = null;
            // disable keyValue, because mongodb is a key value storage
            this.keyValue = false;
            // create the storage
            this.storage = new MongodbStorage({ url, database });
        } else // if type is not supported
            throw new Error(`type ${type} is not supported`);
        // handle indexing of values, if keyValue is false
        this.index = (!this.keyValue)? 0 : -1;
    }

    async open(name: string) : Promise<void> {
        // open database
        await this.storage.open({name: name, path: this.path});
    }

    async set(first: any, second?: any) : Promise<void> {
        let { key, value } = this._handleInputs(first, second);
        // promise to run
        return await this._mutex(
            async () => await this.storage.set(key, value)
        );
    }

    async get(key : any) : Promise<any> {
        return await this._mutex(
            async () => await this.storage.get(key)
        );
    }

    async getAll() : Promise<any> {
        return await this._mutex(
            async () => await this.storage.getAll()
        );
    }

    async has(key: any) : Promise<boolean> {
        return await this._mutex(
            async () => await (await this.storage.get(key))? true : false
        );
    }

    async remove(key : any) : Promise<void> {
        return await this._mutex(
            async () => await this.storage.remove(key)
        );
    }

    async delete() : Promise<void> {
        return await this._mutex(
            async () => await this.storage.delete()
        );
    }

    _handleInputs(first : any, second : any) {
        let key, value;
        if(this.keyValue){
            key = first;
            value = second;
        }else{
            key = ++this.index;
            value = first;
        }
        return { key, value };
    }

    _mutex(promise : () => Promise<any>) : Promise<any> {
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
