import Storage from '../index.js'
import assert from 'assert';
import fs from 'fs';

let test_size = 100;

describe('JSON Storage functionality', () => {
    let storage = new Storage({
        type: 'json',
        keyValue: false,
    });
    let json = { str: 'test', num: 123, bool: true };
    let jsons  = Array(test_size).fill(json).map((item, index) => ({ ...item, index: index }));
    let name = 'json_test';
    let store;
    // create a new storage
    test('directory created', async () => {
        // check if direcotry was created
        store = await storage.open(name);
    })

    // save json file
    test('save json file', async () => {
        // check if file was created
        await store.set(json);
        assert.equal(fs.existsSync('./storage/' + name + '/0000000001.json'), true);
    })
    
    // get json file
    test('get json file', async () => {
        let data = await store.get(1);
        assert.deepEqual(data, json);
    })

    // delete file
    test('delete file', async () => {
        // check if file was deleted
        await store.remove(1);
        assert.equal(fs.existsSync('./storage/' + name + `/0000000001.json`), false);
    })

    // save many files
    test('save many files', async () => {
        // check if files was created
        Promise.all(jsons.map( async (v, i) => await store.set(v)));
        // check if files where created
        let allFiles = jsons.some((v, i) =>
            !fs.existsSync('./storage/' + name + `/${String(i + 1).padStart(10, '0')}.json`)
        );
        assert.equal(allFiles, true);
    })

    // get all files
    test('get all files', async () => {
        let data = await store.all();
        assert.deepEqual(data.map(j => j.value), jsons);
    })

    // delete many files
    test('directory deleted', async () => { 
        await store.delete();
        assert.equal(fs.existsSync('./storage/' + name), false);
    })

})

describe('JSON Storage keyvalue', () => {
    let storage = new Storage({
        type: 'json',
        keyValue: true,
    });
    let name = 'json_test_keyvalue';
    // fill with ramdom alphanumric keys
    let keys = Array(test_size).fill(0).map(() => Math.random().toString(36).substring(7));
    let json = { str: 'test', num: 123, bool: true };
    let keyValue_store;
    // create a new storage
    test('directory created', async () => {
        // check if direcotry was created
        keyValue_store = await storage.open(name);
    })

    // save json file
    test('save json file', async () => {
        // check if file was created
        await keyValue_store.set(keys[0], json);
        assert.equal(fs.existsSync('./storage/' + name + `/${keys[0]}.json`), true);
    })

    // get json file
    test('get json file', async () => {
        let data = await keyValue_store.read(keys[0]);
        assert.deepEqual(data, json);
    })

    // delete file
    test('delete file', async () => {
        // check if file was deleted
        await keyValue_store.remove(keys[0]);
        assert.equal(fs.existsSync('./storage/' + name + `/${keys[0]}.json`), false);
    })


    // save many files
    test('save many files', async () => {
        // check if files was created
        Promise.all(keys.map( async (k, i) => await keyValue_store.set(k, json)));
        // check if files where created
        let allFiles = keys.some((v, i) => !fs.existsSync('./storage/' + name + `/${v}.json`));
        assert.equal(allFiles, true);
    })

    // get all files
    test('get all files', async () => {
        let data = await keyValue_store.all();
        // sort by key
        data = data.sort((a, b) => a.key > b.key ? 1 : -1);
        let expected = keys.map(k => ({ key: k, value: json })).sort((a, b) => a.key > b.key ? 1 : -1);
        // check if all keys are there
        assert.deepEqual(data,  expected);
    })

    // delete everything
    test('directory deleted', async () => { 
        await keyValue_store.delete();
        assert.equal(fs.existsSync('./storage/' + name), false);
    })

})


