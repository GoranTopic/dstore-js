import { write_json, read_json, delete_json } from 'files-js'

class jsonStorage{

    async open({name, path}){
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
            return await storage.has(key);
        });
    }

    async remove(key) {
        return await this.mutex.runExclusive(async () => {
            return await storage.remove(key);
        });
    }

    async delete() {
        return await this.mutex.runExclusive(async () => {
            return await storage.delete();
        });
    }



}

