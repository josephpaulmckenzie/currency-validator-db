import {existsSync, readFileSync} from 'fs';
import {FileNotFoundError} from './classes/errorClasses';

function checkFileExists(filePath: string) {
  if (!existsSync(filePath)) {
    throw new FileNotFoundError('File does not exist.');
  }
}

function readFile(filePath: string) {
  try {
    checkFileExists(filePath);
    return readFileSync(filePath, 'utf8');
  } catch (error) {
    if (error instanceof FileNotFoundError) {
      throw new Error(`Error reading file: ${error.message}`);
    } else {
      throw new Error(`Error reading file: ${error}`);
    }
  }
}

export {checkFileExists, readFile};
