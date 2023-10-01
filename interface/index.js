import getPrice from "./functions/getPrice.js";
import mint from "./functions/mint.js";
import getPhase from "./functions/getPhase.js";
import getOwnedTokens from "./functions/getOwnedTokens.js";
import settings from "./settings.js";
import { setPhaseOnPage, setPriceOnPage, setOwnedTokensOnPage } from "./functions/DOMModifiers/DOMModifiers.js";

if (typeof window.ethereum !== 'undefined')
    console.log('MetaMask is installed!');

const mintButton = document.getElementById('mint-button');
mintButton.addEventListener('click', mint);

getPhase().then(setPhaseOnPage)
getPrice(0).then(setPriceOnPage)
getOwnedTokens().then(setOwnedTokensOnPage);

// add a link to the 2 contracts on the block explorer.. both in the same div. the link is titled "Lunar Contratc" and "NFT Contract"
{
    const linksWrapper = document.getElementById('links-wrapper');
    const lunarContractLink = document.createElement('a');
    const nftContractLink = document.createElement('a');

    lunarContractLink.innerText = 'Lunar Contract';
    lunarContractLink.href = `${settings.explorerPrefix}address/${settings.lunarAddress}`;
    lunarContractLink.target = '_blank';
    lunarContractLink.rel = 'noopener noreferrer';

    nftContractLink.innerText = 'NFT Contract';
    nftContractLink.href = `${settings.explorerPrefix}address/${settings.nftAddress}`;
    nftContractLink.target = '_blank';
    nftContractLink.rel = 'noopener noreferrer';

    const lunarContractLinkWrapper = document.createElement('div');
    lunarContractLinkWrapper.appendChild(lunarContractLink);

    const nftContractLinkWrapper = document.createElement('div');
    nftContractLinkWrapper.appendChild(nftContractLink);

    linksWrapper.appendChild(lunarContractLinkWrapper);
    linksWrapper.appendChild(nftContractLinkWrapper);
}
