import { access } from 'node:fs/promises';
import { cwd } from 'node:process';
import { join } from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress, createBrotliDecompress } from 'node:zlib';
import { platform } from 'node:os';

const divider = platform() === 'win32' ? '\\' : '/';

export const compressFile = async (pathToFile, pathToDest) => {
  try {
    pathToFile = pathToFile.includes(divider) ? pathToFile : join(cwd(), pathToFile);
    pathToDest = pathToDest.includes(divider) ? pathToDest : join(cwd(), pathToDest);
    await access(pathToFile);
    const fileStream = createReadStream(pathToFile);
    const archiveStream = createWriteStream(pathToDest);
    fileStream.pipe(createBrotliCompress()).pipe(archiveStream)
      .on('finish', () => console.log('Compressed'));
  } catch (e) {
    throw new Error(e.message);
  }
}

export const decompressFile = async (pathToArchive, pathToDest) => {
  try {
    pathToArchive = pathToArchive.includes(divider) ? pathToArchive : join(cwd(), pathToArchive);
    pathToDest = pathToDest.includes(divider) ? pathToDest : join(cwd(), pathToDest);
    await access(pathToArchive);
    const archiveStream = createReadStream(pathToArchive);
    const fileStream = createWriteStream(pathToDest);
    archiveStream.pipe(createBrotliDecompress()).pipe(fileStream)
      .on('finish', () => console.log('Decompressed'));
  } catch (e) {
    throw new Error(e.message);
  }
}