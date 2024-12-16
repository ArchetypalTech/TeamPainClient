import { writable } from 'svelte/store';

// Store for account
export const account = writable<any>(null); // Initial value is null

// Store for account address
export const accountAddress = writable<any>(null); // Initial value is null

// Store for username
export const username = writable<any>(null); // Initial value is null

// Store for connection status
export const connected = writable(false); // Initial value is a boolean false