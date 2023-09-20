import Storage from '../index.js'
import assert from 'assert';
import chai from 'chai';
const expect = chai.expect
import fs from 'fs';

describe('test Json Storage basic functinality', () => {
    let storage = new Storage({
        type: 'json',
        keyvalue: false,
    });
    let name = 'json_test';
    // create a new storage
    let json_store = storage.open(name);
    // check if direcotry was created
    test('directory created', () => {
        assert.equal(fs.existsSync('./storage/' + name), true);
    })

    test('directory deleted', async () => { 
        await json_store.delete();
        assert.equal(fs.existsSync('./storage/' + name), false);
    })
});

