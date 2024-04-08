dstore-js
=======
#### Do you ever wish writing stuff to disk was simple? Do you ever wish it would be easy to switch between databases? Well, fret no more. 
## Installation
```
npm install dstore-js
```
## JSON Type
```javascript
import Storage from 'dstore-js'

let storage = new Storage({
        type: 'json', // sqlite, csv, ..etc
        keyValue: false,
        path: './my_storages', // default: ./storage/
    });

let store = await storage.open('my_jsons')

let jsonToSave = { 'some': 'data' }

// save json
await store.set(jsonToSave)

// get json back
let json = await store.get(0)

// get all jsons
let jsons = await store.all()

// remove json
await store.remove(0)

// delete store along with all files
await store.delete()

```

## Mongodb 
```javascript
import Storage from 'dstore-js'

let storage = new Storage({
        type: 'mongodb',
        url: 'mongodb://0.0.0.0:27017',
        database: 'my_db'
    });

//Make a store object that will match a collection
let store = await storage.open(name);

// save json file
await store.set( { str: 'test', num: 123, bool: true } );

// get json file
let [ data ] = await store.get({ str: 'test' }); // { str: 'test', num: 123, bool: true }

// remove archive
await store.remove({ str: 'test' });

// get all record 
let all = await store.all();

// close connection with the db
await store.close()

// drop collection. Deletes everything!
await store.delete();
```

## Mongodb Files
Mongofiles ables the ability to easily set and get values from MongoDB via Gridfs.

The input for the file is in the form of a `Buffer`, `Readble` Stream, or `String`, path to the file in os for the first parameter.

The second parameter is an object which must contain the property `filename`, and any additional metadata you might want to add. ;)


The output will always be of the form:
```typescript
{
        buffer: <Buffer>
        metadata: {
                filename: <String>
                other_properties: <any>
                ...
        }
}
```
Where the Metadata is the same as defined in the input and must have the filename property.

Note: You can use the Mongodb store with the MongoFile store on the same database

Note: Mutiple files can have the same filename, though this is not recommended and should be enforced by the user. (that means you)

```javascript
import Storage from 'dstore-js'

let storage = new Storage({
        type: 'mongoFiles',
        url: 'mongodb://0.0.0.0:27017',
        database: 'my_files'
    });

// Create a store just like Mongodb
let store = await storage.open(name);

// pdf buffer
let pdf_buffer = fs.readFileSync(fileTestDir + 'file.pdf');

// save pdf buffer
await store.set(pdf_buffer, { filename: 'buffer_file.pdf' });

// save pdf stream
await store.set(fs.createReadStream('file.pdf');, { filename: 'buffer_file.pdf' });

// save pdf from filesystem
await store.set('/path/to/file.pdf', { filename: 'buffer_file.pdf' });

// get the pdf returns an array of all the files that match the metadata
let [ data ] = await store.get({ filename: 'buffer_file.pdf' });
let {
        buffer, // <Buffer>
        metadata // { filename: 'buffer_file.pdf', uploadDate: '2024-04-08T02:29:06.376+00:00' }
} = data;
                                       
// remove pdf file or any other files that match the metadata
await store.remove({ filename: 'buffer_file.pdf' });

// get all record metadata 
let all = await store.all();

// Close client connection
await store.close()

// drop collection
await store.delete();
```

## Options
```javascript
new Storage({
  type, // type of db to be used. ex: json, cvs, sqlite,               
  path, // path where to store the db                   
  keyValue, // are we using a keyvalue pair to store data?  default: false           
  mutex, // use a mutex to avoid collisions? default: true
  url, // used of Mongodb and other network dbs
  database, // used of db like mongo
  })
```
