import { writable } from 'svelte/store';
import type { AccountInterface } from 'starknet';
import type { ConnectorData } from 'starknetkit';

// Store for account
export const account = writable<AccountInterface | undefined>(undefined);

// Store for username
export const username = writable<string | undefined>(undefined);

// Store for accountAddress
export const accountAddr = writable<string | undefined>(undefined);

// Store for connection status to Cartridge Game Controller
export const connectedToCGC= writable(false); // Initial value is a boolean false

// Store for connection status Argent X
export const connectedToArX= writable(false); // Initial value is a boolean false

// Store account address from ArgentX
export const walletAddress = writable<any | undefined>(undefined);