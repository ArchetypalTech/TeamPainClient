// Starknet.js
import { RpcProvider, Contract, Account, ec, json } from 'starknet';

// Initialize provider with Sepolia Testnet node
export const provider = new RpcProvider({ nodeUrl: 'https://starknet-sepolia.public.blastapi.io' });
            
// Contract address for the token
export const addrContract = "0x00ad3fca70b118504944c580d6cb0082755e9a8b62f5be415ba6ee1d292a6a4d";

// The contract ABI
const { abi: contractAbi } = await provider.getClassAt(addrContract);
if (contractAbi === undefined) {
  throw new Error('no abi.');
}

// Connect to the contract
export const FerryTicketContract = new Contract(contractAbi, addrContract, provider);
