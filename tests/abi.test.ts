import { locateFiles } from '$lib/contract_abis';
import path from 'path';

describe("Fetch json abi's", () => {
  test("we get 4 abi's returned", () => {
    const fp = path.resolve(__dirname, '../src/manifest');
    const regex = /^system_.*\.json$/;
    return locateFiles(fp, regex).then( result => {
      expect(result).toHaveLength(4);
    });
  });
  
  test("we get expected file names", () => {
    const fp = path.resolve(__dirname, '../src/manifest');
    const regex = /^system_.*\.json$/;
    const expected = 'system_outputter.json';
    return locateFiles(fp, regex).then( result => {
      expect(result.some(r => r.includes(expected))).toBe(true)
    });
  });
  
});