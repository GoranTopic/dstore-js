import Storage from '../js/index.js'
import assert from 'assert';
import fs from 'fs';

let test_size = 100;

let working_dir = './storage/';

describe('sql Storage functionality', () => {
    let storage = new Storage({
        type: 'sqlite',
        keyValue: false,
    });
    // we will test all of these
    let json = { str: 'test', num: 123, bool: true };
    let jsons = Array(test_size).fill(json).map((item, index) => ({ ...item, index: index }));
    let name = 'sqlite_test';
    let func = () => { console.log("hello") };
    let bool = true;
    let num = 123;
    let str = 'test';
    let store;
    test('directory created', async () => {
        // check if direcotry was created
        // create a new storage
        store = await storage.open(name);
        assert.equal(fs.existsSync( working_dir + name + '.sqlite'), true);
    }) 

    // save json file
    test('save and get file', async () => {
        // check if file was created
        await store.set(json);
        let data = await store.get(1);
        assert.deepEqual(data, json);
    })

    // delete file
    test('delete file', async () => {
        // check if file was deleted
        await store.remove(1);
        let data = await store.get(1);
        assert.equal(data, undefined);
    })

    // save function
    test('save function', async () => {
        await store.set(func.toString());
        let data = await store.get(2);
        assert.deepEqual(data, func.toString());
    })

    // save boolean
    test('save boolean', async () => {
        await store.set(bool);
        let data = await store.get(3);
        assert.deepEqual(data, bool);
    })


    // save number
    test('save number', async () => {
        await store.set(num);
        let data = await store.get(4);
        assert.deepEqual(data, num);
    })

    // save string
    test('save string', async () => {
        await store.set(str);
        let data = await store.get(5);
        assert.deepEqual(data, str);
    })

    test('delete function, boolean, number, string', async () => {
        await store.remove(2);
        await store.remove(3);
        await store.remove(4);
        await store.remove(5);
        let data = await store.all();
        assert.deepEqual(data, []);
    })
    
    // save many files
    test('save many files, and get them all', async () => {
        // check if files was created
        Promise.all(jsons.map( async (v, i) => await store.set(v)));
        // get the all
        let data = await store.all();
        // check if files where created
        assert.deepEqual(data.map(v => v.value), jsons);
    }, 100000000)

    // delete many files
    test('directory deleted', async () => { 
        await store.delete();
        assert.equal(fs.existsSync( working_dir + name + '.sqlite'), false);
    }, 100000000)

})


describe('Sqlite Storage keyvalue', () => {
    let storage = new Storage({
        type: 'sqlite',
        keyValue: true,
    });
    let name = 'sqlite_test_keyvalue';
    // fill with ramdom alphanumric keys
    let keys = Array(test_size).fill(0).map(() => Math.random().toString(36).substring(7));
    let json = { str: 'test', num: 123, bool: true };
    // create a new storage
    let store;
    test('directory created', async () => {
        // check if direcotry was created
        // create a new storage
        store = await storage.open(name);
        assert.equal(fs.existsSync( working_dir + name + '.sqlite'), true);
    }) 
    
    test('save and get file', async () => {
        // check if file was created
        await store.set(keys[0], json);
        let data = await store.get(keys[0]);
        assert.deepEqual(data, json);
    })

    // test overwritting entries
    test('overwritting', async () => {
        await store.set(keys[0], json);
        await store.set(keys[0], json);
        await store.set(keys[0], json);
        await store.set(keys[0], json);
        let data = await store.all();
        assert.deepEqual(data.length, 1);
    })

    // delete file
    test('delete file', async () => {
        // check if file was deleted
        await store.remove(keys[0]);
        //let data = await store.get(keys[0]);
        //assert.equal(data, undefined);
    })

    // save many files
    test('save many files', async () => {
        // check if files was created
        Promise.all(keys.map( async (k, i) => await store.set(k, json)));
        // get all files
        let data = await store.all();
        data = data.map(v => ({ key: v.key, value: v.value }));
        assert.deepEqual(data, keys.map(k => ({ key: k, value: json })));
    }, 100000000)

    // delete everything
    test('directory deleted', async () => { 
        await store.delete();
        assert.equal(fs.existsSync('./js/storage/' + name + '.sqlite'), false);
    }, 100000000)

})


