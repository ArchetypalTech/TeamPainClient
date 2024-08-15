import { describe, it, expect } from 'vitest';
import * as path from 'path';

import { locateFiles, parseAbis, getAddresses, setShortName } from '$lib/contract_abis'
import type { Contract } from 'starknet';


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

  it("returns valid intermediate address objects", () => {
    const f_paths = ['../tests/assets/manifest.json'];
    return getAddresses(f_paths[0]).then(result => {
      expect(result.length).toBeGreaterThan(0);
      const expected: ContractAddress = {
        address: "0x48a75af79de26bd265c05d82043ba29b30cbf5e15963bd9ebfc641b1cecc824",
        name: "the_oruggin_trail::systems::meatpuppet::meatpuppet"
      };
      expect(result).toContainEqual(expected);
    });
  });
  
  it("correctly processes namespaces to short names", async () => {
    const f_paths = ['../tests/assets/manifest.json'];
    return getAddresses(f_paths[0]).then( result => {
        const actual = setShortName(result, "systems");
        const expected: ContractAddress =  {
          address: '0x48a75af79de26bd265c05d82043ba29b30cbf5e15963bd9ebfc641b1cecc824',
          name: 'the_oruggin_trail::systems::meatpuppet::meatpuppet',
          s_name: 'systems_meatpuppet'
        };
        expect(actual).toContainEqual(expected);
    });
  });

});
