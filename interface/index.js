import getPrice from "./functions/getPrice.js";
import mint from "./functions/mint.js";
import getPhase from "./functions/getPhase.js";
import getOwnedTokens from "./functions/getOwnedTokens.js";

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

const setPhaseOnPage = (phase) => {
    document.getElementById('phase-display').innerText = `Current Lunar Phase: ${phase}`;
    return phase;
};

// query the current phase and set it on the page
getPhase().then(setPhaseOnPage)

// do the same for the price (0 represents standard version)
getPrice(0).then(setPriceOnPage)

const setOwnedTokensOnPage = (ownedTokens) => {
    const {
        amountOwned,
        amountOwnedNumber,
        tokens
    } = ownedTokens;

    document.getElementById('token-amount-display').innerText = `You own ${amountOwned.toString()} token ${amountOwnedNumber > 1 ? 's' : ''}`;

    const tokensView = document.getElementById('tokens-view');

    tokens.forEach(token => {
        // add a new child of class "tokens-view" with the calls "token-view" and the id "token-view-${tokenId}"
        const tokenDiv = document.createElement('div');
        const tokenImage = document.createElement('img');

        tokenImage.src = token.image;  // Assuming imageURL is a property of your token object
        tokenDiv.appendChild(tokenImage);
        tokensView.appendChild(tokenDiv);
    })
}

getOwnedTokens().then(setOwnedTokensOnPage);
