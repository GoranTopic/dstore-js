import { MongoClient } from 'mongodb';
import Storage from './types/Storage';

class MongodbStorage extends Storage {
    url: string;
    client: MongoClient;
    database:  any;
    collection: any | undefined;

    constructor({ url, database } : {url: string, database: string }){
        super();
        // this function is the constructor for the class
        this.url = url;
        this.client = new MongoClient(url);
        this.database = database;
        this.collection = undefined;
    }

    async open({ name } : { name: string }){
        // this function opens the stora
        // in this case path would be the endpoint of the database
        this.collection = name;
        await this.client.connect();
        // make sure to replace the database name with the name of your database
        this.database = this.client.db(this.database);
        // make a collection 
        this.collection = this.database.collection(this.collection);
    }   

    async set(key: string, value: any) : Promise<void> {
        // lets ignore the key for now and just pass the value
        return await this.collection.insertOne(value);
    }

    async get(key : string) : Promise<any> {
        // this function retrives a value with a key
        return await this.collection.find(key).toArray();
    }

    async getAll() : Promise<any> {
        // this function returns all the values in the storage
        return await this.collection.find({}).toArray();
    }

    async remove(key: string) : Promise<any> {
        // this function removes a value with a key
        return await this.collection.deleteMany(key);
    }

    async delete() : Promise<void> {
        // this function deletes the entire storage
        await this.collection.drop();
        return await this.client.close();
    }

}

export default MongodbStorage;
