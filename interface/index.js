import settings from "./settings.js";
import { getLunarContract, getNftContract } from "./functions/getContract.js";
import getPrice from "./functions/getPrice.js";
import mint from "./functions/mint.js";

if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
}

const setPriceOnPage = (price) => {
    const priceInEth = ethers.utils.formatEther(price);
    console.log('Price:', priceInEth);
    document.getElementById('version-0-price-display').innerText = `₳ ${priceInEth}`; // ₳  Ξ
    return price;
}



const mintButton = document.getElementById('mint-button');
mintButton.addEventListener('click', mint);

const getPhase = async () => {
    const lunarContract = await getLunarContract();
    const phase = await lunarContract.currentPhase();
    console.log('Current phase:', phase)
    return phase;
}

const setPhaseOnPage = (phase) => {
    document.getElementById('phase-display').innerText = `Current Lunar Phase: ${phase}`;
    return phase;
};

// query the current phase and set it on the page
getPhase().then(setPhaseOnPage)

// do the same for the price (0 represents standard version)
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