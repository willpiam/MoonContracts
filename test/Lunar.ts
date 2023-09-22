import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lunar", async function () {
    let lunar: any;

    it("simple test", async function () {
        lunar = await ethers.deployContract("Lunar");
        await lunar.waitForDeployment();
        const lunarAddress = await lunar.getAddress();
        console.log(`Lunar deployed to: ${lunarAddress}`)

        const currentPhase: string = await lunar.currentPhase();
        console.log(`Current phase:     ${currentPhase}`);

        const currentFraction: bigint = await lunar.currentFrac();
        console.log(`Current fraction:  ${currentFraction}`);


    });

    it("NFT Contract", async function () {
        const prefix = "https://williamdoyle.ca/lunar-tokens/standard-version/";
        const postfix = ".json";
        const nftContract = await ethers.deployContract("LunarTokens", [lunar.getAddress(), [
            `${prefix}New_Moon${postfix}`,
            `${prefix}Waxing_Crescent${postfix}`,
            `${prefix}First_Quarter${postfix}`,
            `${prefix}Waxing_Gibbous${postfix}`,
            `${prefix}Full_Moon${postfix}`,
            `${prefix}Waning_Gibbous${postfix}`,
            `${prefix}Last_Quarter${postfix}`,
            `${prefix}Waning_Crescent${postfix}`,
        ]]);

        const owner = await nftContract.owner();
        console.log(`NFT Contract owner: ${owner}`);

        await nftContract.safeMint(owner);
        const tokenId = await nftContract.tokenOfOwnerByIndex(owner, 0);

        const tokenURI = await nftContract.tokenURI(tokenId);
        console.log(`Token URI: ${tokenURI}`);
    })
});
