import { writable, get } from 'svelte/store';
import { ProviderInterface, AccountInterface, constants, type WalletAccount} from "starknet";


// Store for account for Cartridge Controller
export const accountController = writable<AccountInterface | undefined>(undefined);

// Store for account for Argent X
export const accountArgentX = writable<AccountInterface| null>(null);

// Store for username
export const username = writable<string | undefined>(undefined);

// Store for accountAddress from Controller
export const walletAddressCont = writable<string | undefined>(undefined);

// Store for connection status to Cartridge Game Controller
export const connectedToCGC= writable(false); // Initial value is a boolean false

// Store for connection status Argent X
export const connectedToArX= writable(false); // Initial value is a boolean false

// Store account address from ArgentX
export const walletAddressArX = writable<string | undefined>(undefined);

// export const networkName: string = constants.NetworkName.SN_SEPOLIA;
export const providerST = "https://api.cartridge.gg/x/theoruggintrail/katana"; // Sepolia
