import connectAccount from "./connectAccount.js";
import lunarAbi from "../lunarAbi.js";
import nftAbi from "../nftAbi.js";
import settings from "../settings.js";

const getContract = async (contractAddrress, abi) => {
    await connectAccount();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log(signer);

    return new ethers.Contract(contractAddrress, abi, signer);
}

const getLunarContract = getContract.bind(null, settings.lunarAddress, lunarAbi);
const getNftContract = getContract.bind(null, settings.nftAddress, nftAbi);

export default getContract;
export {
    getLunarContract,
    getNftContract,
}