import settings from '../settings.js';

async function connectAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${(settings.networkID).toString(16)}` }]
    }).catch(async (error) => {
        console.log(`Error: Could not switch to chain `)
        return
    })
}

export default connectAccount;