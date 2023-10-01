const setPriceOnPage = (price) => {
    const priceInEth = ethers.utils.formatEther(price);
    console.log('Price:', priceInEth);
    document.getElementById('version-0-price-display').innerText = `₳ ${priceInEth}`; // ₳  Ξ
    return price;
}

const setPhaseOnPage = (phase) => {
    document.getElementById('phase-display').innerText = `Current Lunar Phase: ${phase}`;
    return phase;
};

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

export {
    setPriceOnPage,
    setPhaseOnPage,
    setOwnedTokensOnPage
}