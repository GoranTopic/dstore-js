abstract class Storage{

    // this function opens the storage
    async open({name, path} : {name: string, path: string}) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    // this function sets a value for a key
    async set(key: string, value: any) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    // this function retrives a value with a key
    async get(key: string) : Promise<any> {
        throw new Error('Method not implemented.');
    }

    // this function returns all the values in the storage
    async getAll() : Promise<any> {
        throw new Error('Method not implemented.');
    }

    // this function removes a value with a key
    async remove(key: string) : Promise<void> {
        throw new Error('Method not implemented.');
    }

    // this function deletes the entire storage
    async delete() : Promise<void> {
        throw new Error('Method not implemented.');
    }

}

export default Storage;
