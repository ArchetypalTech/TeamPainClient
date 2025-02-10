// Starknet.js
import { RpcProvider, Contract, Account, ec, json } from 'starknet';

// Initialize provider with Sepolia Testnet node
// Sepolia: https://starknet-sepolia.public.blastapi.io
export const provider = new RpcProvider({ nodeUrl: 'https://api.cartridge.gg/x/theoruggintrail/katana' });
export const providerSepolia = new RpcProvider({ nodeUrl: 'https://starknet-sepolia.public.blastapi.io' });
            
// Contract address for the TOT NFT Token in Katana/Slot
export const addrContract = "0x01dc981317c9b40a04229c3e48724704a428aa9582c29dabc41233cc564f1706";

// Contract address for the TOT NFT Token in Sepolia
export const addrContractSepolia = "0x02cf8f08f551ecb5b839726396d8c8600843078a30b2e288784980cb098ccb7b";

// The contract ABI from Katana/Slot
const { abi: contractAbi } = await provider.getClassAt(addrContract);
if (contractAbi === undefined) {
  throw new Error('no abi.');
}

// The contract ABI from Sepolia
const { abi: contractAbiSepolia } = await providerSepolia.getClassAt(addrContractSepolia);
if (contractAbi === undefined) {
  throw new Error('no abi.');
}

// Connect to the contract Katana/Slot
export const totNFTContract = new Contract(contractAbi, addrContract, provider);

// Connect to the contract Sepolia
export const totNFTContractSepolia = new Contract(contractAbiSepolia, addrContractSepolia, providerSepolia);