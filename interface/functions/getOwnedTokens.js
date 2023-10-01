import {getNftContract} from './getContract.js';
import settings from '../settings.js';

const getOwnedTokens = async () => {
    const nftContract = await getNftContract();
    const amountOwned = await nftContract.balanceOf(nftContract.signer.getAddress());
    const amountOwnedNumber = parseInt(amountOwned.toString());

    const tokens = await Promise.all(Array.from({ length: amountOwnedNumber }, (v, i) => { })
        .map(async (element, index) => {
            const tokenId = await nftContract.tokenOfOwnerByIndex(nftContract.signer.getAddress(), index);
            const tokenUri = await nftContract.tokenURI(tokenId);
            const metadata = await fetch(`${settings.metadataPrefix}${tokenUri}`).then(response => response.json());

            return {
                tokenId: tokenId,
                uri: tokenUri,
                metadata: metadata,
                image: `${settings.metadataPrefix}${metadata.image}`,
            }
        }))

    return {
        amountOwned: amountOwned,
        amountOwnedNumber: amountOwnedNumber,
        tokens: tokens
    }
}

export default getOwnedTokens;