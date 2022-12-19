import { USER_NAME_ARGUMENT } from './constants.js';
import { cwd, chdir } from 'node:process';
import { homedir } from 'node:os';
import { printFileList, cdDir, upDir } from './nav.js';
import { addFile, catFile, cpFile, mvFile, renameFile, rmFile } from "./fs.js";
import { os } from './os.js';
import { hash } from './hash.js';
import {compressFile, decompressFile} from "./zip.js";

const startApp = () => {
  chdir(homedir());
  const args = process.argv.slice(2);
  const userName = args.find(item => item.startsWith(USER_NAME_ARGUMENT))?.split('=')[1] || 'Guest';
  const byeText = `Thank you for using File Manager, ${userName}, goodbye!`;
  console.clear();
  console.log(`Welcome to the File Manager, ${userName}!`);
  console.log(`You are currently in ${cwd()}`);

  const handleInput = async (v) => {
    const stringValue = v.toString().split('\n').join('').trim();
    const command = stringValue.split(' ')[0];
    const attribute = stringValue.split(' ')[1] || null;
    const attributes = stringValue.split(' ');
    if (attributes.length > 1) attributes.shift();
    console.clear();
    try {
      switch (command) {
        case '.exit': {
          console.log(byeText);
          process.exit(0);
          break;
        }
        case 'ls': {
          await printFileList();
          break;
        }
        case 'up': {
          await upDir();
          break;
        }
        case 'cd': {
          if (attribute) await cdDir(attribute);
          else throw new Error('Invalid input: The name of directory is required! Example: cd your_directory_name');
          break;
        }
        case 'cat': {
          if (attribute) await catFile(attribute);
          else throw new Error('Invalid input: The name of file is required! Example: cat your_file_name');
          break;
        }
        case 'add': {
          if (attribute) await addFile(attribute);
          else throw new Error('Invalid input: The name of file is required! Example: add your_file_name');
          break;
        }

        case 'rn': {
          if (attributes.length === 2) await renameFile(attributes[0], attributes[1]);
          else throw new Error('Invalid input: The path to file and the new name of file is required! Example: rn path_to_file new_filename');
          break;
        }
        case 'cp': {
          if (attributes.length === 2) await cpFile(attributes[0], attributes[1]);
          else throw new Error('Invalid input: The path to file and directory is required! Example: cp path_to_file path_to_new_directory');
          break;
        }
        case 'mv': {
          if (attributes.length === 2) await mvFile(attributes[0], attributes[1]);
          else throw new Error('Invalid input: The path to file and directory is required! Example: mv path_to_file path_to_new_directory');
          break;
        }
        case 'rm': {
          if (attribute) await rmFile(attribute);
          else throw new Error('Invalid input: The name of file or path to file is required! Example: rm path_to_file');
          break;
        }
        case 'os': {
          if (attribute) await os(attribute);
          else throw new Error('Invalid input: The option is required! Example: os --EOL');
          break;
        }
        case 'hash': {
          if (attribute) await hash(attribute);
          else throw new Error('Invalid input: The name of file or path to file is required! Example: hash path_to_file');
          break;
        }
        case 'compress': {
          if (attributes.length === 2) await compressFile(attributes[0], attributes[1]);
          else throw new Error('Invalid input: The path to file and archive is required! Example: compress path_to_file path_to_destination');
          break;
        }
        case 'decompress': {
          if (attributes.length === 2) await decompressFile(attributes[0], attributes[1]);
          else throw new Error('Invalid input: The path to archive and file is required! Example: decompress path_to_file path_to_destination');
          break;
        }
        default: throw new Error(`Invalid input: unknown command ${stringValue}`);
      }
    } catch (e) {
      console.error( e.message.startsWith('Invalid input') ? e.message : `Operation failed: ${e.message}` );
    }
    console.log(`You are currently in ${cwd()}`);
  };

  process.stdin.on('data', handleInput);

  process.on('SIGINT', () => {
    console.clear();
    console.log('\n' + byeText);
    process.exit();
  });
}

startApp();