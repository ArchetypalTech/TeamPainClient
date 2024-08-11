import { json, Contract } from 'starknet'
import * as fs from 'fs';
import * as path from 'path';



async function locateFiles(dir: string, pattern: RegExp): Promise<string[]> {
    return fs.readdirSync(dir)
    .filter((file) => {
        return fs.statSync(path.join(dir, file)).isFile() && pattern.test(file);
    })
    .map((file) => path.join(dir, file)); // Return full path
}

async function parseAbis(paths: string[]): Promise<Contract[]> {

}


// Conditional export for testing purposes
if (process.env.NODE_ENV === 'test') {
    module.exports = { locateFiles };
  } else {
    // module.exports = { publicFunction };
  }


