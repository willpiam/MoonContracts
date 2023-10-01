import getPrice from "./functions/getPrice.js";
import mint from "./functions/mint.js";
import getPhase from "./functions/getPhase.js";
import getOwnedTokens from "./functions/getOwnedTokens.js";
import { setPhaseOnPage, setPriceOnPage, setOwnedTokensOnPage } from "./functions/DOMModifiers/DOMModifiers.js";

if (typeof window.ethereum !== 'undefined')
    console.log('MetaMask is installed!');

const mintButton = document.getElementById('mint-button');
mintButton.addEventListener('click', mint);

getPhase().then(setPhaseOnPage)
getPrice(0).then(setPriceOnPage)
getOwnedTokens().then(setOwnedTokensOnPage);
