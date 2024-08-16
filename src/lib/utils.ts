
import { poseidonHashMany } from 'micro-starknet'

/**
 * Determines the entity ID from an array of keys. If only one key is provided,
 * it's directly used as the entity ID. Otherwise, a poseidon hash of the keys is calculated.
 *
 * @param {bigint[]} keys - An array of big integer keys.
 * @returns {any} The determined entity ID.
 */
export function getEntityIdFromKeys(keys: string | number): any {

  // needs to use an iterator but for now we just use the one key value
  const big = BigInt(keys)

  // if (keys.length === 1) {
  //     return ("0x" + keys[0].toString(16)) as Entity;
  // }
  // calculate the poseidon hash of the keys
  let poseidon = poseidonHashMany([big]);
  return ("0x" + poseidon.toString(16)) as any;
}


