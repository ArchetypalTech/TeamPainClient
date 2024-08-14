import { json, Contract, RpcProvider, Account } from 'starknet'
import * as fs from 'fs';
import * as path from 'path';
import { setFilePath } from '../lib';
import { DO_SystemAbi, type SysAbi } from '$lib/system';
import { readFile } from 'fs/promises';

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
        const fileContent = json.parse(
            fs.readFileSync(manifest()).toString('ascii')
        );
        // Create and return a new SystemAbi object
        return new DO_SystemAbi({ c_name: name, data: fileContent });
    });

}

// intermediate store objects for parsing the manifest to
// addresses
interface ContractAddress {
    address: string;
    name: string;
}

// intermediate store objects for parsing the manifest to
// addresses
interface ContractList {
    contracts: ContractAddress[];
}

async function readAddressPath(m_path: string): Promise<ContractList> {
    const manifest_path = setFilePath(m_path);
    try {
        const _raw = await readFile(manifest_path(), 'utf8');
        return JSON.parse(_raw) as ContractList;
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Invalid JSON in file ${m_path}: ${error.message}`);
        }
        console.error("E:", error);
        throw error;
    }
}

async function getAddresses(m_path: string): Promise<ContractAddress[]> {
    const c_list: ContractList = await readAddressPath(setFilePath(m_path)());
    try {
        const c: ContractAddress[] = c_list.contracts.map(ct => (
            {
                address: ct.address,
                name: ct.name
            }
        ));
        return c;
    } catch (error) {
        console.error('Error reading or parsing file:', error);
    }
}

async function getSystemContracts(f_paths: string[], provider: RpcProvider, address: string): Promise<any> {

}

// Conditional export for testing purposes
if (process.env.NODE_ENV === 'test') {
    module.exports = { locateFiles, parseAbis, getAddresses };
} else {
    module.exports = { getSystemContracts };
}
