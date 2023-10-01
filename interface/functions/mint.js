import { getNftContract } from "./getContract.js";
import getPrice from "./getPrice.js";

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

export default mint;