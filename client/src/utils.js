import Web3 from 'web3';

const ganacheURL = 'http://localhost:8545';

export async function getWeb3() {
    const web3 = new Web3(new Web3.providers.HttpProvider(ganacheURL));
    return web3;
  }
  
// export async function getWeb3() {
//   if (window.ethereum) {
//     // Use MetaMask provider
//     const web3 = new Web3(window.ethereum);
//     try {
//       // Request account access if not granted
//       await window.ethereum.enable();
//       return web3;
//     } catch (error) {
//       throw new Error('User denied account access');
//     }
//   } else if (window.web3) {
//     // Legacy dApp browsers
//     return new Web3(window.web3.currentProvider);
//   } else {
//     // Non-dApp browsers
//     return new Web3(new Web3.providers.HttpProvider(ganacheURL));
//   }
// }
