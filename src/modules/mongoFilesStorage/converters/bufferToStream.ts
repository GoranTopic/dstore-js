import { Readable } from 'stream';

/**
 * @param binary Buffer
 * returns readableInstanceStream Readable
 */
function bufferToStream(binary: Buffer): Readable {

    const readableInstanceStream = new Readable({
      read() {
        this.push(binary);
        this.push(null);
      }
    });

    return readableInstanceStream;
}

export default bufferToStream;
