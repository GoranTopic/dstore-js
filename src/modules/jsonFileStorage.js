import { write_json, read_json, delete_json } from 'files-js'
import osPath from 'path';

class jsonFileStorage {

    async open({name, path}){
        // let make a dir with the name on the path
        this.path = osPath.join(path, `${name}.json`);
        // hole entire json in memory
        this.json = {};
        // if file exists, read it
        if (read_json(this.path)) this.json = read_json(this.path);
        // write the json to the file, otherwise create the file
        else write_json(this.json, this.path, { format: true });
    }

    async set(key, value) {
        // convet key which can be any type to string
        key = String(key);
        // add to json
        this.json[key] = value;
        // write to file
        write_json(this.json, this.path, { format: true });
    }

    async get(key) {
        // convet key which can be any type to string
        key = String(key);
        return this.json[key];
    }

    async getAll() {
        // return all values in json
        let data = [];
        if(this.json)
            data = Object.keys(this.json).map(key => ({ key, value: this.json[key] }));
        return data;
    }

    async remove(key) {
        key = String(key);
        // remove key from json in memory
        delete this.json[key];
        // write to file
        write_json(this.json, this.path, { format: true });
    }

    async delete() {
        // delete the file
        this.json = {};
        delete_json(this.path);
    }

}

export default jsonFileStorage;

