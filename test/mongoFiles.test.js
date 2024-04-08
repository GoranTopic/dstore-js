import Storage from '../js/index.js'
import assert from 'assert';
import fs from 'fs';

let fileTestDir = './test/files/';

let test_size = 100;

describe('mongoFiles Storage with Buffer type', () => {

    let storage = new Storage({
        type: 'mongoFiles',
        url: 'mongodb://0.0.0.0:27017',
        database: 'dstore_test'
    });

    let collection_name = 'mongoFiles_test';
    let store = null;

    test('create collection', async () => {
        // check if direcotry was created
        // create a new storage
        store = await storage.open(collection_name);
        assert.equal(store? true: false, true);
    }) 

    // test array buffer
    // read text file as buffer
    let txt_buffer = fs.readFileSync(fileTestDir + 'file.txt');
    // read pdf file as buffer
    let pdf_buffer = fs.readFileSync(fileTestDir + 'file.pdf');
    // read images file as buffer
    let img_buffer = fs.readFileSync(fileTestDir + 'file.png');
    // read video file as buffer
    let video_buffer = fs.readFileSync(fileTestDir + 'file.webm');

    // save and get file text buffer
    test('save and get file txt buffer', async () => {
        // check if file was created
        await store.set(txt_buffer, { filename: 'buffer_file.txt' });
        let [ data ] = await store.get({ filename: 'buffer_file.txt' });
        let buffer = data.buffer;
        assert.deepEqual(txt_buffer, buffer);
    })

    // delete file txt buffer
    test('delete file txt buffer', async () => {
        // check if file was deleted
        await store.remove({ filename: 'buffer_file.txt' });
        let data = await store.get({ filename: 'buffer_file.txt' });
        assert.deepEqual(data, []);
    })

    // save and get file pdf buffer
    test('save and get file pdf buffer', async () => {
        // check if file was created
        await store.set(pdf_buffer, { filename: 'buffer_file.pdf' });
        let [ data ] = await store.get({ filename: 'buffer_file.pdf' });
        let buffer = data.buffer;
        assert.deepEqual(pdf_buffer, buffer);
    })

    // delete file pdf buffer
    test('delete file pdf buffer', async () => {
        // check if file was deleted
        await store.remove({ filename: 'buffer_file.pdf' });
        let data = await store.get({ filename: 'buffer_file.pdf' });
        assert.deepEqual(data, []);
    })

    // save and get file image buffer
    test('save and get file image buffer', async () => {
        // check if file was created
        await store.set(img_buffer, { filename: 'buffer_file.png' });
        let [ data ] = await store.get({ filename: 'buffer_file.png' });
        let buffer = data.buffer;
        assert.deepEqual(img_buffer, buffer);
    })

    // delete file image buffer
    test('delete file image buffer', async () => {
        // check if file was deleted
        await store.remove({ filename: 'buffer_file.png' });
        let data = await store.get({ filename: 'buffer_file.png' });
        assert.deepEqual(data, []);
    })

    // save and get file video buffer
    test('save and get file video buffer', async () => {
        // check if file was created
        await store.set(video_buffer, { filename: 'buffer_file.webm' });
        let [ data ] = await store.get({ filename: 'buffer_file.webm' });
        let buffer = data.buffer;
        assert.deepEqual(video_buffer, buffer);
    })

    // delete file video buffer
    test('delete file video buffer', async () => {
        // check if file was deleted
        await store.remove({ filename: 'buffer_file.webm' });
        let data = await store.get({ filename: 'buffer_file.webm' });
        assert.deepEqual(data, []);
    })

    // test readeble stream
    // create file obj from buffer for text file
    const text_stream = fs.createReadStream(fileTestDir + 'file.txt');
    // create file obj from buffer for pdf file
    const pdf_stream = fs.createReadStream(fileTestDir + 'file.pdf');
    // create file obj from buffer for image file
    const img_stream = fs.createReadStream(fileTestDir + 'file.png');
    // create file obj from buffer for video file
    const video_stream = fs.createReadStream(fileTestDir + 'file.webm');

    // save and get file Stream Readable
    test('save and get stream Readable', async () => {
        // check if file was created
        await store.set(text_stream, { filename: 'stream_file.txt' });
        let [ data ] = await store.get({ filename: 'stream_file.txt' });
        let buffer = data.buffer;
        assert.deepEqual(txt_buffer, buffer);
    })

    // delete file Stream Readable
    test('delete file Stream Readable', async () => {
        // check if file was deleted
        await store.remove({ filename: 'stream_file.txt' });
        let data = await store.get({ filename: 'stream_file.txt' });
        assert.deepEqual(data, []);
    })

    // save and get file pdf stream readable
    test('save and get file pdf stream readable', async () => {
        // check if file was created
        await store.set(pdf_stream, { filename: 'stream_file.pdf' });
        let [ data ] = await store.get({ filename: 'stream_file.pdf' });
        let buffer = data.buffer;
        assert.deepEqual(pdf_buffer, buffer);
    })

    // delete file pdf stream readable
    test('delete file pdf stream readable', async () => {
        // check if file was deleted
        await store.remove({ filename: 'stream_file.pdf' });
        let data = await store.get({ filename: 'stream_file.pdf' });
        assert.deepEqual(data, []);
    })

    // save and get file image stream readable
    test('save and get file image stream readable', async () => {
        // check if file was created
        await store.set(img_stream, { filename: 'stream_file.png' });
        let [ data ] = await store.get({ filename: 'stream_file.png' });
        let buffer = data.buffer;
        assert.deepEqual(img_buffer, buffer);
    })

    // delete file image stream readable
    test('delete file image stream readable', async () => {
        // check if file was deleted
        await store.remove({ filename: 'stream_file.png' });
        let data = await store.get({ filename: 'stream_file.png' });
        assert.deepEqual(data, []);
    })

    // save and get file video stream readable
    test('save and get file video stream readable', async () => {
        // check if file was created
        await store.set(video_stream, { filename: 'stream_file.webm' });
        let [ data ] = await store.get({ filename: 'stream_file.webm' });
        let buffer = data.buffer;
        assert.deepEqual(video_buffer, buffer);
    })

    // delete file video stream readable
    test('delete file video stream readable', async () => {
        // check if file was deleted
        await store.remove({ filename: 'stream_file.webm' });
        let data = await store.get({ filename: 'stream_file.webm' });
        assert.deepEqual(data, []);
    })

    // test string
    // read text file as string
    const txt_string = fileTestDir + 'file.txt'
    // read pdf file as string
    const pdf_string = fileTestDir + 'file.pdf'
    // read image file as string
    const img_string = fileTestDir + 'file.png'
    // read video file as string
    const video_string = fileTestDir + 'file.webm'

    // save and get file txt string
    test('save and get file txt string', async () => {
        // check if file was created
        await store.set(txt_string, { filename: 'string_file.txt' });
        let [ data ] = await store.get({ filename: 'string_file.txt' });
        let buffer = data.buffer;
        assert.deepEqual(txt_buffer, buffer);
    })

    // delete file txt string
    test('delete file txt string', async () => {
        // check if file was deleted
        await store.remove({ filename: 'string_file.txt' });
        let data = await store.get({ filename: 'string_file.txt' });
        assert.deepEqual(data, []);
    })

    // save and get file pdf string
    test('save and get file pdf string', async () => {
        // check if file was created
        await store.set(pdf_string, { filename: 'string_file.pdf' });
        let [ data ] = await store.get({ filename: 'string_file.pdf' });
        let buffer = data.buffer;
        assert.deepEqual(pdf_buffer, buffer);
    })

    // delete file pdf string
    test('delete file pdf string', async () => {
        // check if file was deleted
        await store.remove({ filename: 'string_file.pdf' });
        let data = await store.get({ filename: 'string_file.pdf' });
        assert.deepEqual(data, []);
    })

    // save and get file image string
    test('save and get file image string', async () => {
        // check if file was created
        await store.set(img_string, { filename: 'string_file.png' });
        let [ data ] = await store.get({ filename: 'string_file.png' });
        let buffer = data.buffer;
        assert.deepEqual(img_buffer, buffer);
    })

    // delete file image string
    test('delete file image string', async () => {
        // check if file was deleted
        await store.remove({ filename: 'string_file.png' });
        let data = await store.get({ filename: 'string_file.png' });
        assert.deepEqual(data, []);
    })

    // save and get file video string
    test('save and get file video string', async () => {
        // check if file was created
        await store.set(video_string, { filename: 'string_file.webm' });
        let [ data ] = await store.get({ filename: 'string_file.webm' });
        let buffer = data.buffer;
        assert.deepEqual(video_buffer, buffer);
    })

    // delete file video string
    test('delete file video string', async () => {
        // check if file was deleted
        await store.remove({ filename: 'string_file.webm' });
        let data = await store.get({ filename: 'string_file.webm' });
        assert.deepEqual(data, []);
    })
    
    // save many files
    test('save many files, and get them all', async () => {
        // check if files was created
        await Promise.all( Array(test_size).fill(0).map( async (v, i) => 
                await store.set(txt_buffer, { filename: 'buffer_file.txt' }) )
        );
        // get the all
        let data = await store.all();
        // check if we have the same number of files
        assert.equal(data.length, test_size);
    }, 100)

    // remove many files 
    test('remove many files', async () => {
        await store.remove({ filename: 'buffer_file.txt' });
        let data = await store.all();
        // check if we have the same number of files
        assert.equal(data.length, 0);
    })

    // delete many files
    test('collection deleted', async () => { 
        await store.delete();
    }, 100)
})


