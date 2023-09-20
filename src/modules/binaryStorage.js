class SomeStorage{

    async open({name, path}){
        // this function opens the storage
    }

    async set(key, value){
        // this function sets a value for a key
    }

    async get(key) {
        // this function retrives a value with a key
    }

    async getAll() {
        // this function returns all the values in the storage
    }

    async remove(key) {
        // this function removes a value with a key
    }

    async delete() {
        // this function deletes the entire storage
    }

}

export default SomeStorage;
