import settings from "./settings.js";
import { getLunarContract, getNftContract } from "./functions/getContract.js";
import getPrice from "./functions/getPrice.js";

if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
}



const setPriceOnPage = (price) => {
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
// getPrice(0)
getPrice(0).then(setPriceOnPage)

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