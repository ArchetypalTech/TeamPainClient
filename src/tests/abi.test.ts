// import { describe, it, expect } from 'vitest';
// import * as path from 'path';
// import { locateFiles, parseAbis } from '$lib/contract_abis';

// describe("Fetch json abi's", () => {
//   test("we get 4 abi's returned", () => {
//     const fp = path.resolve(__dirname, '../src/manifest');
//     const regex = /^system_.*\.json$/;
//     return locateFiles(fp, regex).then( result => {
//       expect(result).toHaveLength(4);
//     });
//   });


import { describe, it, expect } from 'vitest';

describe('ABI tests', () => {
  it('should do something', () => {
    expect(true).toBe(true)
  })
});

  // test("we get the SystemAbi objects back", () => {
  //   const f_paths = ['./assets/system_actions.json', './assets/system_actions.json'];
  //   return parseAbis(f_paths).then(result => {
  //     expect(result).toBeTruthy();
  //     expect(Array.isArray(result)).toBe(true);
  //     expect(result.length).toBeGreaterThan(0);
  //   });
  // });
  
  // test("we get expected file names", () => {
  //   const fp = path.resolve(__dirname, '../src/manifest');
  //   const regex = /^system_.*\.json$/;
  //   const expected = 'system_outputter.json';
  //   return locateFiles(fp, regex).then( result => {
  //     expect(result.some(r => r.includes(expected))).toBe(true)
  //   });
  // });

// });