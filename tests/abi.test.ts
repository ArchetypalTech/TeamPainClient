import { locateFiles } from '$lib/contract_abis';
import path from 'path';

describe('testing index file', () => {
  test('we should get some stuff', () => {
    const fp = path.resolve(__dirname, '../src/manifest');
    const regex = /^system_.*\.json$/;
    return locateFiles(fp, regex).then( result => {
      expect(result.toBe('foo'));
    });
  });
});