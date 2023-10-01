import nftAbi from "./nftAbi.js";
import lunarAbi from "./lunarAbi.js";
import settings from "./settings.js";

if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
}

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

const getContract = async (contractAddrress, abi) => {
    await connectAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer);

    return new ethers.Contract(contractAddrress, abi, signer);
}

const getLunarContract = getContract.bind(null, settings.lunarAddress, lunarAbi);
const getNftContract = getContract.bind(null, settings.nftAddress, nftAbi);

const getPrice = async (specialTypeId) => {
    const nftContract = await getNftContract();
    const price = await nftContract.specialTypeIdToPrice(specialTypeId);
    console.log('Price:', price.toString());
    const priceInEth = ethers.utils.formatEther(price);
    console.log('Price:', priceInEth);
    document.getElementById('version-0-price-display').innerText = `₳ ${priceInEth}`; // ₳  Ξ
    return price;
}

const mint = async () => {
    console.log(`About to attempt minting`)
    try {
        const nftContract = await getNftContract();
        // Assume mint is the method to call for minting in your smart contract
        const specialTypeId = 0;
        const price = await getPrice(specialTypeId);
        const mintTx = await nftContract.mint(nftContract.signer.getAddress(), specialTypeId, { value: price });
        await mintTx.wait();
        console.log('Minted successfully');
    } catch (error) {
        console.error('Error minting:', error);
    }
};

const mintButton = document.getElementById('mint-button');
mintButton.addEventListener('click', mint);

const setPhase = async () => {
    const lunarContract = await getLunarContract();

    try {
        const phase = await lunarContract.currentPhase();
        console.log('Current phase:', phase)
        document.getElementById('phase-display').innerText = `Current Lunar Phase: ${phase}`;
    } catch (error) {
        console.error('Error fetching phase:', error);
    }
};

// Call the function to set the phase on page load
setPhase()
getPrice(0)

const loadTokens = async () => {
    try {
        const nftContract = await getNftContract();

        const amountOwned = await nftContract.balanceOf(nftContract.signer.getAddress());
        const amountOwnedNumber = parseInt(amountOwned.toString());

        console.log('Amount owned:', amountOwned.toString());
        document.getElementById('token-amount-display').innerText = `You own ${amountOwned.toString()} token ${amountOwnedNumber > 1 ? 's' : ''}`;

        const tokensView = document.getElementById('tokens-view');

        const tokens = await Promise.all(Array.from({ length: amountOwnedNumber }, (v, i) => { })
            .map(async (element, index) => {
                const tokenId = await nftContract.tokenOfOwnerByIndex(nftContract.signer.getAddress(), index);
                const tokenUri = await nftContract.tokenURI(tokenId);
                const metadata = await fetch(`${settings.metadataPrefix}${tokenUri}`).then(response => response.json());
                const image = `${settings.metadataPrefix}${metadata.image}`

                // add a new child of class "tokens-view" with the calls "token-view" and the id "token-view-${tokenId}"
                const tokenDiv = document.createElement('div');
                const tokenImage = document.createElement('img');

                tokenImage.src = image;  // Assuming imageURL is a property of your token object
                tokenDiv.appendChild(tokenImage);
                tokensView.appendChild(tokenDiv);

                return {
                    tokenId: tokenId,
                    uri: tokenUri,
                    metadata: metadata,
                    image: image,
                }
            }))


        console.log('Tokens:', tokens)

    }
    catch (error) {
        console.error('Error fetching tokens:', error);
    }

}

loadTokens()