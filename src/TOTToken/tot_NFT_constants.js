// Starknet.js
import { RpcProvider, Contract, Account, ec, json } from 'starknet';

// Initialize provider with Sepolia Testnet node
export const provider = new RpcProvider({ nodeUrl: 'https://starknet-sepolia.public.blastapi.io' });
            
// Contract address for the TOT NFT Token
export const addrContract = "0x02cf8f08f551ecb5b839726396d8c8600843078a30b2e288784980cb098ccb7b";

// The contract ABI
const { abi: contractAbi } = await provider.getClassAt(addrContract);
if (contractAbi === undefined) {
  throw new Error('no abi.');
}

// Connect to the contract
export const totNFTContract = new Contract(contractAbi, addrContract, provider);
