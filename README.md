Storage-js
=======
#### ever wish writting stuff to disk was simple? Ever wish it would be easy to switch between databases? Well, fred no more. 


## Installation
```
npm install storage-js
```
## Type JSON
```javascript
import Storage from 'storage-js'

let storage = new Storage({
        type: 'json', // sqlite, csv, ..etc
        keyvalue: false,
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

## Options
new Storage({
  type, // type of db to be used. ex: json, cvs, sqlite,               
  path, // path where to store the db                   
  keyValue, // are we using a keyvalue pair to store data?  default: false           
  mutex, // use a mutex to avoid collisions? default: true
  })


## Options
