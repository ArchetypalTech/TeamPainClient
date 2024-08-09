import { json, Contract } from 'starknet'
import * as fs from 'fs';
import * as path from 'path';
// add the system contract names here
// we then prepend system_ to the passed string
// const systems: Array<string> = ['outputter', 'meatpuppet'];

export async function locateFiles(dir: string, pattern: RegExp): Promise<string[]> {
    return fs.readdirSync(dir).filter((file) => {
        return fs.statSync(path.join(dir, file)).isFile() && pattern.test(file);
    });
}


// Conditional export for testing
// if (process.env.NODE_ENV === 'test') {
//     export { locateFiles };
// }