import { readdir, access } from 'node:fs/promises';
import { chdir, cwd } from 'node:process';
import { join } from 'node:path';
import { homedir } from 'node:os';

export const printFileList = async () => {
  console.clear();
  const files = await readdir(cwd(), { withFileTypes: true });
  console.table(
    files
      .map(item => ({ Name: item.name, Type: item.isDirectory() ? 'directory' : 'file'}))
      .sort((item, nextItem) => item.Type < nextItem.Type ? 1 : -1)
      .sort((item, nextItem) => item.Type === nextItem.Type && item.Name > nextItem.Name ? 1 : -1)
  );
}

export const upDir = async () => {
  try {
    const newPath = cwd().split('/').slice(0, -1).join('/');
    chdir(newPath);
  } catch (e) {
    throw new Error(e.message);
  }
}

export const cdDir = async (dir) => {
  try {
    const newPath = dir.startsWith(homedir().split('/')[1]) ? '/' + dir : join(cwd(), dir);
    await access(newPath);
    chdir(newPath);
  } catch (e) {
    throw new Error(e.message);
  }
}