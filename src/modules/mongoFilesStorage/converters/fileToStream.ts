import { Readable } from 'stream';

/**
 * @param File object
 * returns readableInstanceStream Readable
 */
function fileToStream(file: File): Readable {
  const stream = new Readable();
  stream.push(file);
  stream.push(null);
  return stream;
}


export default fileToStream;
