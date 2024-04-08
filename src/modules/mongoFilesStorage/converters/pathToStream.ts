import { Readable } from 'stream';
import fs from 'fs';

/**
 * @param {string} path of the file
 * returns readableInstanceStream Readable
 */
function pathToStream(path: string): Readable {
    // check if path is a file
    if (!fs.existsSync(path)) {
        throw new Error('File not found');
    }
    // check if it is a dir
    if (fs.lstatSync(path).isDirectory()) {
        throw new Error('Path is a directory');
    }
    // return readable stream
    return fs.createReadStream(path);
}

export default pathToStream;
