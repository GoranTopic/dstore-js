import Storage from './types/Storage';
let files_js = require('files-js');
const { write_json, read_json, delete_json } = files_js;
import osPath from 'path';


class jsonFileStorage extends Storage {
    json: any;
    path: string;

    constructor() {
        super();
        this.json = {};
        this.path = '';
    }

    async open({ name, path} : {name: string, path: string}) : Promise<void> {
        // let make a dir with the name on the path
        this.path = osPath.join(path, `${name}.json`);
        // hole entire json in memory
        this.json = {};
        // if file exists, read it
        if (read_json(this.path)) this.json = read_json(this.path);
        // write the json to the file, otherwise create the file
        else write_json(this.json, this.path, { format: true });
    }

    async set(key: string, value: any) : Promise<void> {
        // add to json
        this.json[key] = value;
        // write to file
        write_json(this.json, this.path, { format: true });
    }

    async get(key: string) : Promise<any> {
        // convet key which can be any type to string
        return this.json[key];
    }

    async getAll() : Promise<any[]> {
        // return all values in json
        let data : any[] = [];
        if(this.json)
            data = Object.keys(this.json).
                map(key => ({ key, value: this.json[key] }));
        return data;
    }

    async remove(key : string) : Promise<void> {
        // remove key from json in memory
        delete this.json[key];
        // write to file
        write_json(this.json, this.path, { format: true });
    }

    async delete() : Promise<void> {
        // delete the file
        this.json = {};
        delete_json(this.path);
    }

}

export default jsonFileStorage;

