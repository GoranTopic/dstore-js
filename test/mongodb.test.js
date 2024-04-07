import Storage from '../js/index.js'
import assert from 'assert';
import fs from 'fs';

let test_size = 100;

describe('mongo Storage functionality', () => {
    let storage = new Storage({
        type: 'mongodb',
        url: 'mongodb://0.0.0.0:27017',
        database: 'storage_test'
    });
    // 
    let json = { str: 'test', num: 123, bool: true };
    let jsons = Array(test_size).fill(json).map((item, index) => ({ ...item, index: index }));
    let name = 'mongodb_test';
    let func = () => { console.log("hello") }
    let bool = true;
    let num = 123;
    let str = 'test';
    let store;

    test('create collection', async () => {
        // check if direcotry was created
        // create a new storage
        store = await storage.open(name);
        assert.equal(store? true: false, true);
    }) 

    // save json file
    test('save and get file', async () => {
        // check if file was created
        await store.set(json);
        let [ data ] = await store.get({ str: 'test' });
        assert.deepEqual(data, json);
    })

    // delete file
    test('delete file', async () => {
        // check if file was deleted
        await store.remove({ str: 'test' });
        let data = await store.get({ str: 'test' });
        assert.deepEqual(data, []);
    })

    // save function
    test('save function', async () => {
        let func_str = func.toString();
        await store.set({ func: func_str });
        let [ data ] = await store.get({ func: func_str });
        
        assert.deepEqual(data.func, func_str);
    })

    // save boolean
    test('save boolean', async () => {
        await store.set({ bool });
        let [ data ] = await store.get({ bool });
        assert.deepEqual(data.bool, bool);
    })

    // save number
    test('save number', async () => {
        await store.set({ num });
        let [ data ] = await store.get({ num });
        assert.deepEqual(data.num, num);
    })

    // save string
    test('save string', async () => {
        await store.set({ str });
        let [ data ] = await store.get({ str });
        assert.deepEqual(data.str, str);
    })

    test('delete function, boolean, number, string', async () => {
        await store.remove({ func });
        await store.remove({ bool });
        await store.remove({ num });
        await store.remove({ str });
        let data = await store.all();
        assert.deepEqual(data, []);
    })
    
    // save many files
    test('save many files, and get them all', async () => {
        // check if files was created
        await Promise.all(jsons.map( async (v, i) => await store.set(v)));
        // get the all
        let data = await store.all();
        // check if files where created
        // sort by index
        data = data.sort((a, b) => a.index - b.index);
        jsons = jsons.sort((a, b) => a.index - b.index);
        assert.deepEqual(data, jsons);
    }, 100000000)

    // delete many files
    test('collection deleted', async () => { 
        await store.delete();
        assert.equal(fs.existsSync('./storage/' + name), false);
    }, 100000000)

})


