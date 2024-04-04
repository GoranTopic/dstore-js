dstore-js
=======
#### Ever wish writing stuff to disk was simple? Ever wish it would be easy to switch between databases? Well, fret no more. 
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

// drop collection
await store.delete();
```

## Mongodb Files
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
