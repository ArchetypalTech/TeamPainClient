import { describe, it, expect } from 'vitest';
import * as path from 'path';

import { locateFiles, parseAbis } from '$lib/contract_abis'


describe('Creates contracts', () => {
  it('shoukld create an array of Contract objects', () => {
    // Arrange
    const result = true

    // Act
    // Perform the action

    // Assert
    expect(result).toBe(true)
  });
});

describe("Fetch JSON Abi's", () => {
  it("we get 4 abi's returned", () => {
    const fp = path.resolve(__dirname, '../manifest');
    const regex = /^system_.*\.json$/;
    return locateFiles(fp, regex).then(result => {
      expect(result).toHaveLength(4);
    });
  });

  it("returns expected file names", () => {
    const fp = path.resolve(__dirname, '../manifest');
    const regex = /^system_.*\.json$/;
    const expected = 'system_outputter.json';
    return locateFiles(fp, regex).then(result => {
      expect(result.some(r => r.includes(expected))).toBe(true)
    });
  });

  it("returns some SystemAbi objects", () => {
    const f_paths = ['../tests/assets/system_actions.json', '../tests/assets/system_outputter.json'];
    return parseAbis(f_paths).then(result => {
      expect(result).toBeTruthy();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toEqual(2);
    });
  });

  it("returns valid SystemAbis objects", () => {
    const f_paths = ['../tests/assets/system_outputter.json', '../tests/assets/system_actions.json'];
     return parseAbis(f_paths).then(result => {
      expect(result[0].c_name).toEqual('system_outputter');
      expect(result[0].data).not.toBeNull;
    }); 
  });

});
