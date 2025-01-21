// Internals
import { writable, get } from 'svelte/store';
import {connectedToArX, walletAddressArX, accountArgentX, connectedToCGC, walletAddressCont, accountController, } from '../Wallets/Wallet_constants';
import { FerryTicketContract, addrContract } from './FerryTicket_constants.js';


// Get the balance of the FerryTicket via command
export async function getBalance(): Promise<string> {
    if (get(connectedToArX)) {
        try {       
            // Get the balance of the address stored in walletAddress
            const balance: BigInt = await FerryTicketContract.balance_of(get(walletAddressArX));
            //console.log('------>FT balance is: ', Number(balance));
            // Return the corresponding message
            if (Number(balance) > 1) {
                return `You have ${Number(balance)} Ferry Tickets in your wallet.`; 
            } else if (Number(balance) > 0 && Number(balance) < 2) {
                return `You have ${Number(balance)} Ferry Ticket in your wallet.`; 
            } else {
                return `You have ${Number(balance)} Ferry Tickets in your wallet.`
            }
        } catch (error) {
            console.error("Error checking token balance:", error);
            return `Error: ${error.message || 'An unknown error occurred.'}`;
        }
    } else if (get(connectedToCGC)){
        try {       
            // Get the balance of the address stored in walletAddress
            const balance: BigInt = await FerryTicketContract.balance_of(get(walletAddressCont));
            //console.log('------>FT balance is: ', Number(balance));
            // Return the corresponding message
            if (Number(balance) > 1) {
                return `You have ${Number(balance)} Ferry Tickets in your wallet.`; 
            } else if (Number(balance) > 0 && Number(balance) < 2) {
                return `You have ${Number(balance)} Ferry Ticket in your wallet.`; 
            } else {
                return `You have ${Number(balance)} Ferry Tickets in your wallet.`
            }
        } catch (error) {
            console.error("Error checking token balance:", error);
            return `Error: ${error.message || 'An unknown error occurred.'}`;
        } 
    } else {
        return "Your wallet is not currently supported."
    }
    
}

// Get the balance of the FerryTicket for playing
export async function getBalance2(): Promise<number> {
    if (get(walletAddressArX)) {
        try {       
            // Get the balance of the address stored in walletAddress
            const balance: BigInt = await FerryTicketContract.balance_of(get(walletAddressArX));
            //console.log('------>FT balance is: ', Number(balance));
            // Return the corresponding value
            return Number(balance);
        } catch (error) {
            console.error("Error checking token balance:", error);
            return 0; // If there is an error, set to 0 and cannot play.
        }
    } else if (get(walletAddressCont)){
        try {       
            // Get the balance of the address stored in walletAddress
            const balance: BigInt = await FerryTicketContract.balance_of(get(walletAddressCont));
            //console.log('------>FT balance is: ', Number(balance));
            // Return the corresponding value
            return Number(balance);
        } catch (error) {
            console.error("Error checking token balance:", error);
            return 0; // If there is an error, set to 0 and cannot play.
        }
    }  else {
        return 0;
    }
}

// Mint the Ferry Ticket Token
export async function mintFerryTicket(): Promise<number | string> {
    if (get(connectedToArX)) {
        try {
            // Subscribe to the walletAddress store and ensure it's defined
            const wallet = get(walletAddressArX);
    
            if (!wallet) {
                throw new Error("Wallet address is undefined");
            }
    
            // Prepare the transaction object with valid calldata
            const transaction = {
                contractAddress: addrContract, // Address of the NFT contract
                entrypoint: "mint",
                calldata: [wallet], // Wallet address to mint the token to
            };
    
            // Execute the transaction
            const mint = await get(accountArgentX)?.execute(transaction);
    
            console.log("Result of minting:", mint);
    
            return `You have successfully minted a Ferry Ticket. Your Transaction hash is ${mint?.transaction_hash}`;
    
        } catch (error) {
            console.error("Error minting token:", error);
            if (error.message.includes('USER_REFUSED_OP')) {
                return `Transaction rejected by user.`;
            } else {
                return `Error: ${error.message || 'An unknown error occurred.'}`;
            }
        }
    } else if (get(connectedToCGC)) {
        try {
            // Subscribe to the walletAddress store and ensure it's defined
            const wallet = get(walletAddressCont);
    
            if (!wallet) {
                throw new Error("Wallet address is undefined");
            }
    
            // Prepare the transaction object with valid calldata
            const transaction = {
                contractAddress: addrContract, // Address of the NFT contract
                entrypoint: "mint",
                calldata: [wallet], // Wallet address to mint the token to
            };
    
            // Execute the transaction
            const mint = await get(accountController)?.execute(transaction);
    
            console.log("Result of minting:", mint);
    
            return `You have successfully minted a Ferry Ticket. Your Transaction hash is ${mint?.transaction_hash}`;
    
        } catch (error) {
            console.error("Error minting token:", error);
            if (error.message.includes('USER_REFUSED_OP')) {
                return `Transaction rejected by user.`;
            } else {
                return `Error: ${error.message || 'An unknown error occurred.'}`;
            }
        }
    } else {
        return "Your wallet is not currently supported."
    }    
}


// Transfer the Ferry Ticket Token
export async function transferFerryTicket(recipientAddrss: string, token_id: number): Promise<string> {
    console.log("wallet address connected to controller is", get(walletAddressCont));
    // const wallet2 = get(walletAddressCont);
    //         const updatedWallet = wallet2?.replace(/^0x/, '0x0');
    //         console.log("updated value of wallet address is", updatedWallet); 
    if (get(connectedToArX)) {
        try {
            // Subscribe to the walletAddress store and ensure it's defined
            const wallet = get(walletAddressArX);
    
            if (!wallet) {
                throw new Error("Wallet address is undefined");                
            }
    
            console.log('Token ID passed as number is:', token_id);
    
            // Convert token_id to BigInt
            const tokenIdBN = BigInt(token_id);
    
            // Split the token ID into low and high 128-bit parts
            const low = (tokenIdBN & BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")).toString(); // Low 128 bits
            const high = (tokenIdBN >> BigInt(128)).toString(); // High 128 bits
    
            console.log('Token ID low:', low);
            console.log('Token ID high:', high);
    
            // Prepare the transaction object with valid calldata
            const transaction = {
                contractAddress: addrContract,
                entrypoint: "transfer_from",
                calldata: [
                    wallet,               // 'from' address (wallet address)
                    recipientAddrss,      // 'to' address (recipient address)
                    low,                  // Low 128 bits of token_id
                    high                  // High 128 bits of token_id
                ]
            };
    
            // Execute the transaction
            const transferFT = await get(accountArgentX)?.execute(transaction);
    
            console.log("Result of transferring is:", transferFT);
    
            if (transferFT && transferFT.transaction_hash) {
                // Return the transaction hash upon success
                return `Successfully transferred ticket with ID ${token_id}. Transaction hash: ${transferFT.transaction_hash}`;
            } else {
                // If no transaction hash is returned, throw an error
                throw new Error("Transaction failed: No transaction hash returned");
            }
    
        } catch (error) {
            // Enhanced error handling
            if (error.message.includes('USER_REFUSED_OP')) {
                console.error("Error transferring token: Transaction rejected by user.");
                return `Transaction rejected by user. Please check your wallet and try again.`;
            } else {
                console.error("Error transferring token:", error);
                // Return a generic error message if it's another type of failure
                return `Error: ${error.message || 'An unknown error occurred.'}`;
            }
        }
    } else if (get(connectedToCGC)) {
        console.log("wallet is", get(walletAddressCont));
        try {
            // Subscribe to the walletAddress store and ensure it's defined
            const wallet = get(walletAddressCont);
    
            if (!wallet) {
                throw new Error("Wallet address is undefined");                
            }
    
            console.log('Token ID passed as number is:', token_id);
    
            // Convert token_id to BigInt
            const tokenIdBN = BigInt(token_id);
    
            // Split the token ID into low and high 128-bit parts
            const low = (tokenIdBN & BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")).toString(); // Low 128 bits
            const high = (tokenIdBN >> BigInt(128)).toString(); // High 128 bits
    
            console.log('Token ID low:', low);
            console.log('Token ID high:', high);
    
            // Prepare the transaction object with valid calldata
            const transaction = {
                contractAddress: addrContract,
                entrypoint: "transfer_from",
                calldata: [
                    wallet,               // 'from' address (wallet address)
                    recipientAddrss,      // 'to' address (recipient address)
                    low,                  // Low 128 bits of token_id
                    high                  // High 128 bits of token_id
                ]
            };
    
            // Execute the transaction
            const transferFT = await get(accountController)?.execute(transaction);
    
            console.log("Result of transferring is:", transferFT);
            if (transferFT && transferFT.transaction_hash) {
                // Return the transaction hash upon success
                return `Successfully transferred ticket with ID ${token_id}. Transaction hash: ${transferFT.transaction_hash}`;
            } else {
                // If no transaction hash is returned, throw an error
                throw new Error("Transaction failed: No transaction hash returned");
            }
    
        } catch (error) {
            // Enhanced error handling
            if (error.message.includes('USER_REFUSED_OP')) {
                console.error("Error transferring token: Transaction rejected by user.");
                return `Transaction rejected by user. Please check your wallet and try again.`;
            } else {
                console.error("Error transferring token:", error);
                // Return a generic error message if it's another type of failure
                return `Error: ${error.message || 'An unknown error occurred.'}`;
            }
            // console.error("Error transferring token:", error);
            // // Return a generic error message if it's another type of failure
            //  return `Error: ${error.message || 'An unknown error occurred.'}`;
        }
    } else {
        return "Your wallet is not supported."
    }
   
}
