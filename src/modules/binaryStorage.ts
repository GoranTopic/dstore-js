import Storage from './types/Storage';

class SomeStorage extends Storage {

    async open({name, path} : {name: string, path: string}) : Promise<void> {
        // this function opens the storage
        //
    }

    async set(key: string, value: any) {
        // this function sets a value for a key
    }

    async get(key: string) {
        // this function retrives a value with a key
    }

    async getAll() {
        // this function returns all the values in the storage
    }

    async remove(key: string) {
        // this function removes a value with a key
    }

    async delete() {
        // this function deletes the entire storage
    }

}

export default SomeStorage;
