import { MongoClient, GridFSBucket, GridFSBucketWriteStreamOptions } from 'mongodb';
import { Readable } from 'stream';
import { bufferToStream , pathToStream } from './converters';
import Storage from '../types/Storage';
import toArray from 'stream-to-array';

// this is the metadata object that is used get and store the file
interface Metadata extends GridFSBucketWriteStreamOptions {
    filename: string,
    [key: string]: any
}

// this si the restult from the get to the GridFSBucket database
interface ResultData { 
    buffer: Buffer,
    metadata: Metadata 
}

class MongoFilesStorage extends Storage {
    url: string;
    client: MongoClient;
    database:  any;
    bucket: GridFSBucket | undefined;
    filesCollection: string;
    chunksCollection: string;

    constructor({ url, database } : {url: string, database: string }){
        super();
        // this function is the constructor for the class
        this.url = url;
        this.client = new MongoClient(url);
        this.database = database;
        this.bucket = undefined;
        this.filesCollection = 'files';
        this.chunksCollection = 'chunks';
    }

    async open({ name } : { name: string }){
        // this function opens the store
        // in this case path would be the endpoint of the database
        let bucket_name = name ?? 'files';
        // define the files collection name
        this.filesCollection = bucket_name + '.files';
        // define the chunks collection name
        this.chunksCollection = bucket_name + '.chunks';
        // connect to the database
        await this.client.connect();
        // make sure to replace the database name with the name of your database
        this.database = this.client.db(this.database);
        // make a bucket
        this.bucket = new GridFSBucket(this.database, { bucketName: bucket_name });
    }   

    // metadata is an object that contains the filename or more properties
    async set(file : any, metadata : Metadata) : Promise<boolean> {
        // if metadata does not provide a filename, thorw an error
        if (!metadata.filename)
            throw new Error('filename is required in metadata');
        // if bucket is not defined, throw an error
        if (this.bucket === undefined)
            throw new Error('Bucket is not defined, call open() first');
        // promise to handle the  stream
        return new Promise((resolve, reject) => {
            // get the filename from the metadata
            let filename = metadata.filename;
            // Create a readable stream from the input
            const readStream = this._handleFileInput(file);
            // Create an upload stream
            // @ts-ignore
            const uploadStream = this.bucket.openUploadStream(filename, metadata);
            // Pipe the read stream to the upload stream
            uploadStream.on('finish', () =>  resolve(true) );
            // Handle errors
            uploadStream.on('error', error => reject(error) );
            // Pipe the read stream to the upload stream
            readStream.pipe(uploadStream, { end: true });
        });
    }

    async get(metadata : Metadata) : Promise<ResultData[]> {
        // if metadata does not provide a filename, thorw an error
        if (!metadata.filename)
            throw new Error('Filename is required in metadata');
        // if bucket is not defined, throw an error
        if (this.bucket === undefined)
            throw new Error('Bucket is not defined, call open() first');
        // get all files that match the metadata
        // @ts-ignore
        let files = await this.bucket.find(metadata).toArray();
        // if file is not found, return an empty array
        if(files.length === 0) return [];
        // for each file, get the file
        return await Promise.all(files.map(file => this._get(file)));
    }
                    
            
    // this is the code that is used to handle a single file download
    async _get(file : any) : Promise<ResultData> {
        // promise to handle the  stream
        return await new Promise( async (resolve, reject) => {
            // get the id of the file
            let id = file._id;
            // Create a download stream
            // @ts-ignore
            const downloadStream = this.bucket.openDownloadStream(id);
            // Handle errors
            downloadStream.on('error', error => reject(error) );
            // write the stream to a buffer
            let buffer = await toArray(downloadStream)
                .then(function (parts) {
                const buffers = parts
                    .map(part => (part instanceof Buffer) ? part : Buffer.from(part));
                return Buffer.concat(buffers);
            });
            // remove the _id from the file, length, and chunkSize
            delete file._id;
            delete file.length;
            delete file.chunkSize;
            // resolve the promise
            resolve({ buffer, metadata: file });
        });
    }

    async getAll() : Promise<string[]> {
        // this function returns all the values in the storage
        // if bucket is not defined, throw an error
        if (this.bucket === undefined)
            throw new Error('Bucket is not defined, call open() first');
        // get all the files
        let files = await this.bucket.find().toArray();
        // return the files
        return files.map(file => file.filename);
    }

    async remove(metadata : Metadata) : Promise<boolean> {
        // if metadata does not provide a filename, thorw an error
        if (!metadata.filename) throw new Error('filename is required in metadata');
        // if bucket is not defined, throw an error
        if (this.bucket === undefined)
            throw new Error('Bucket is not defined, call open() first');
        // get all files that match the metadata
        let files = await this.bucket.find(metadata).toArray();
        // if file is not found, return an empty array
        if(files.length === 0) return false;
        // for each file, remove the file
        let removed = await Promise.all(files.map(file => this._remove(file)))
        // if any of the files fail to be removed, return false
        if (removed.includes(false)) return false;
        // return true
        return true;
    }

    async _remove(file : any) : Promise<boolean> {
        // get the id of the file
        let id = file._id;
        // delete the file
        // @ts-ignore
        await this.bucket.delete(id);
        // return true
        return true;
    }

    async close() : Promise<void> {
        // this function closes the storage
        // if bucket is not defined, throw an error
        if (this.bucket === undefined)
            throw new Error('Bucket is not defined, call open() first');
        this.bucket = undefined;
        // close the connection
        await this.client.close();
    }

    async delete() : Promise<void> {
        // this function deletes the entire storage!!
        // if bucket is not defined, throw an error
        if (this.bucket === undefined)
            throw new Error('Bucket is not defined, call open() first');
        // delete the bucket
        // @ts-ignore
        await this.bucket.drop();
        // close the connection
        await this.client.close();
    }

    _handleFileInput(input: any) : Readable {
        // this function handles the input
        if (input instanceof Buffer) {
            return bufferToStream(input);
        } else if (typeof input === 'string') {
            return pathToStream(input);
        } else if (input instanceof Readable) {
            return input;
        } else {
            throw new Error('Invalid input, expected a Buffer,  ReadableStream, or path to a file.');
        }
    }

}

export default MongoFilesStorage;
