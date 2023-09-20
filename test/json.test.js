import Storage from '../index.js'
import assert from 'assert';
import chai from 'chai';
const expect = chai.expect
import fs from 'fs';

describe('JSON Storage', () => {
    let storage = new Storage({
        type: 'json',
        keyvalue: false,
    });
    let name = 'json_test';
    // create a new storage
    let json_store = storage.open(name);
    test('directory created', () => {
        // check if direcotry was created
        assert.equal(fs.existsSync('./storage/' + name), true);
    })

    test('directory deleted', async () => { 
        await json_store.delete();
        assert.equal(fs.existsSync('./storage/' + name), false);
    })


})


