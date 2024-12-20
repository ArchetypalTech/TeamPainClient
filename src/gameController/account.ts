import { writable } from 'svelte/store';
import type { AccountInterface } from 'starknet';

// Store for account
export const account = writable<AccountInterface | undefined>(undefined);

// Store for username
export const username = writable<string | undefined>(undefined);

// Store for accountAddress
export const accountAddr = writable<string | undefined>(undefined);

// Store for connection status
export const connected = writable(false); // Initial value is a boolean false