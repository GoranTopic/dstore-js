import Storage from './types/Storage';
import osPath from 'path';
// @ts-ignore // this is custom module
import { write_json, read_json, delete_json, mkdir, ls_files, rm_dir } from 'files-js';

class jsonStorage extends Storage {
    path: string;

    constructor() {
        super();
        this.path = '';
    }

    async open({name, path} : {name: string, path: string}) : Promise<void> {
        // let make a dir with the name on the path
        path = osPath.join(path, name);
        mkdir(path);
        // save the path for later use
        this.path = path;
    }

    async set(key: string | number, value: object) : Promise<void> {
        // if key is a number, convert it to string
        if (typeof key === 'number')
            key = this._convet_to_string_int(key);
        // check if value is a js object
        if (typeof value !== 'object') {
            throw new Error('value must be a js object');
        }
        return write_json(value, osPath.join(this.path, key + '.json'), { format: true })
    }

    async get(key: string | number) : Promise<object> {
        if (typeof key === 'number')
            key = this._convet_to_string_int(key);
        return read_json(osPath.join(this.path, key + '.json'));
    }

    async getAll() : Promise<{key: string, value: object}[]> {
        let files = ls_files(this.path);
        let jsons = [];
        // for each file, read it and return it
        for ( let file of files )
            // get base name if file 
            jsons.push( { 
                key: osPath.basename(file, '.json'), 
                value: read_json( osPath.join(this.path, file) )
            } );
        return jsons;
    }

    async remove(key : string | number) : Promise<void> {
        if (typeof key === 'number')
            key = this._convet_to_string_int(key);
        return delete_json(osPath.join(this.path, key + '.json'));
    }

    async close() : Promise<void> {
        this.path = '';
    }

    async delete() : Promise<void> {
        let files = ls_files(this.path);
        for (let i = 0; i < files.length; i++) 
            delete_json(files[0]);
        // delete the dir
        rm_dir(this.path);
    }

    _convet_to_string_int(num :number) : string {
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

export default jsonStorage;

