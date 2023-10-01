import { getNftContract } from "./getContract.js";

const getPrice = async (specialTypeId) => {
    const nftContract = await getNftContract();
    const price = await nftContract.specialTypeIdToPrice(specialTypeId);
    console.log('Price:', price.toString());
    return price;
}

export default getPrice;