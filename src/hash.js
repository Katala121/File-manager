import { access, readFile } from 'node:fs/promises';
import { cwd } from 'node:process';
import { join } from 'node:path';
import crypto from 'node:crypto';
import { platform } from 'node:os';

const divider = platform() === 'win32' ? '\\' : '/';

export const hash = async (pathToFile) => {
  try {
    pathToFile = pathToFile.includes(divider) ? pathToFile : join(cwd(), pathToFile);
    await access(pathToFile);
    const file = await readFile(pathToFile);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(file);
    const hex = hashSum.digest('hex');
    console.log(hex);
  } catch (e) {
    throw new Error(e.message);
  }
}