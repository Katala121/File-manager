import {
  access,
  readFile,
  writeFile,
  copyFile,
  rm,
  constants
} from 'node:fs/promises';
import { cwd } from 'node:process';
import { join } from 'node:path';
import { createReadStream, createWriteStream } from 'node:fs';

const FSErrorMessage = 'FS operation failed';

export const catFile = async (fileName) => {
  try {
    const pathToFile = join(cwd(), fileName);
    await access(pathToFile);
    const contentFile = await readFile(pathToFile, { encoding: 'utf8' });
    console.log(contentFile);
  } catch (e) {
    throw new Error(e.message);
  }
}

export const addFile = async (fileName) => {
  const pathToFile = join(cwd(), fileName);
  try {
    await access(pathToFile);
    throw new Error(FSErrorMessage);
  } catch (e) {
    if (e.message !== FSErrorMessage) await writeFile(pathToFile, '', {flag: 'w+'});
    else throw new Error(e.message);
  }
}

export const renameFile = async (pathToFile, newFilename) => {
  try {
    const pathToOldFile = pathToFile.includes('/') ? pathToFile : join(cwd(), pathToFile);
    const arrFromPath = pathToOldFile.split('/');
    arrFromPath[arrFromPath.length - 1] = newFilename;
    const pathToNewFile = arrFromPath.join('/');
    await access(pathToFile);
    await copyFile(pathToFile, pathToNewFile, constants.COPYFILE_EXCL);
    await rm(pathToFile);
  } catch (e) {
    throw new Error(e.message);
  }
}

export const cpFile = async (pathToFile, pathToDir) => {
  try {
    pathToFile = pathToFile.includes('/') ? pathToFile : join(cwd(), pathToFile);
    const fileName = pathToFile.split('/')[pathToFile.split('/').length - 1];
    const pathToDestinationFile = join(pathToDir, fileName);
    await access(pathToFile);
    await access(pathToDir);
    const readable = createReadStream(pathToFile);
    const writable = createWriteStream(pathToDestinationFile);
    readable.pipe(writable);
  } catch (e) {
    throw new Error(e.message);
  }
}

export const mvFile = async (pathToFile, pathToDir) => {
  try {
    await cpFile(pathToFile, pathToDir);
    await rmFile(pathToFile);
  } catch (e) {
    throw new Error(e.message);
  }
}

export const rmFile = async (pathToFile) => {
  try {
    pathToFile = pathToFile.includes('/') ? pathToFile : join(cwd(), pathToFile);
    await access(pathToFile);
    await rm(pathToFile);
  } catch (e) {
    throw new Error(e.message);
  }
}