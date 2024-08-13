import { json, Contract } from 'starknet'
import * as fs from 'fs';
import * as path from 'path';
import { setFilePath } from '../lib';
import { DO_SystemAbi, type SysAbi } from '$lib/system';

/**
 * Finds and then returns a set of strings repreenting files
 * under a directory that match the passed in regex
 *
 * This function kinda of hangs of the output of the build
 * script `scripts/cp_abis.sh
 *
 * @param {string} doc - The root path for the serach.
 * @param {RegExp} pattern - The regex.
 * @returns {string[]} The found file path strings.
 *
 */
async function locateFiles(dir: string, pattern: RegExp): Promise<string[]> {
    return fs.readdirSync(dir)
    .filter((file) => {
        return fs.statSync(path.join(dir, file)).isFile() && pattern.test(file);
    })
    .map((file) => path.join(dir, file)); // Return full path
}

/**
 * Generates a set of SystemAbi's
 * 
 * These are intended to be consumed and end up as Providers
 *  
 * @param {string}f_paths
 * @returns {SysAbi[]} 
 */
async function parseAbis(f_paths: string[]): Promise<SysAbi[]> {
    return f_paths.map(p => {
        // Use path.parse to extract the file name without extension
        const name = path.parse(p).name;
        const c_name = name;

        // Read and parse the JSON file
        const manifest = setFilePath(p);
        // const fileContent = json.parse(
        //     fs.readFileSync(manifest()).toString('ascii')
        // );
        const fileContent = "foo";
        // Create and return a new SystemAbi object
        return new DO_SystemAbi({ c_name: name, data: fileContent });
    });

}

// Conditional export for testing purposes
if (process.env.NODE_ENV === 'test') {
    module.exports = { locateFiles, parseAbis };
  } else {
    // module.exports = { publicFunction };
  }
