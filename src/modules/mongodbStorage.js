import { MongoClient } from 'mongodb';

class MongodbStorage{
    constructor({ url, database }){
        // this function is the constructor for the class
        this.url = url;
        this.client = new MongoClient(url);
        this.database = database;
        this.collection = null;
    }

    async open({ name }){
        // this function opens the stora
        // in this case path would be the endpoint of the database
        this.collection = name;
        await this.client.connect();
        //make sure to replace the database name with the name of your database
        this.database = this.client.db(this.database);
        // make a collection 
        this.collection = this.database.collection(this.collection);
    }   

    async set(key, value){
        // lets ignore the key for now and just pass the value
        return await this.collection.insertOne(value);
    }

    async get(key) {
        // this function retrives a value with a key
        return await this.collection.find(key).toArray();
    }

    async getAll() {
        // this function returns all the values in the storage
        return await this.collection.find({}).toArray();
    }

    async remove(key) {
        // this function removes a value with a key
        return await this.collection.deleteMany(key);
    }

    async delete() {
        // this function deletes the entire storage
        await this.collection.drop();
        return await this.client.close();
    }

}

export default MongodbStorage;
