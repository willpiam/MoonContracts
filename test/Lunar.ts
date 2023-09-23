import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lunar", async function () {
    let lunar: any;
    let currentPhase: string;
    let nftContract: any;
    let owner: any;

    it("simple test", async function () {
        lunar = await ethers.deployContract("Lunar");
        await lunar.waitForDeployment();
        const lunarAddress = await lunar.getAddress();
        console.log(`Lunar deployed to: ${lunarAddress}`)

        currentPhase = await lunar.currentPhase();
        console.log(`Current phase:     ${currentPhase}`);

        const currentFraction: bigint = await lunar.currentFrac();
        console.log(`Current fraction:  ${currentFraction}`);
    });

    it("NFT Contract", async function () {
        const prefix = "https://williamdoyle.ca/lunar-tokens/standard-version/";
        const postfix = ".json";
        nftContract = await ethers.deployContract("LunarTokens", [lunar.getAddress(), [
            `${prefix}New_Moon${postfix}`,
            `${prefix}Waxing_Crescent${postfix}`,
            `${prefix}First_Quarter${postfix}`,
            `${prefix}Waxing_Gibbous${postfix}`,
            `${prefix}Full_Moon${postfix}`,
            `${prefix}Waning_Gibbous${postfix}`,
            `${prefix}Last_Quarter${postfix}`,
            `${prefix}Waning_Crescent${postfix}`,
        ]]);

        owner = await nftContract.owner();
        console.log(`NFT Contract owner: ${owner}`);

        await nftContract.mint(owner, 0);
        const tokenId = await nftContract.tokenOfOwnerByIndex(owner, 0);
        expect(tokenId).to.equal(0);

        const tokenURI = await nftContract.tokenURI(tokenId);
        console.log(`Token URI: ${tokenURI}`);

        const expectedURI = `${prefix}${currentPhase.replace(` `, `_`)}${postfix}`;
        expect(tokenURI).to.equal(expectedURI);
    })

    it("NFT Contract - Create a special type", async function () {
        const prefix = "https://williamdoyle.ca/lunar-tokens/psychedelic-version/";
        const postfix = ".json";
        await nftContract.createSpecialType([
            `${prefix}New_Moon${postfix}`,
            `${prefix}Waxing_Crescent${postfix}`,
            `${prefix}First_Quarter${postfix}`,
            `${prefix}Waxing_Gibbous${postfix}`,
            `${prefix}Full_Moon${postfix}`,
            `${prefix}Waning_Gibbous${postfix}`,
            `${prefix}Last_Quarter${postfix}`,
            `${prefix}Waning_Crescent${postfix}`,
        ])

        await nftContract.mint(owner, 1);
        const tokenId = await nftContract.tokenOfOwnerByIndex(owner, 1);
        expect(tokenId).to.equal(1);

        const tokenURI = await nftContract.tokenURI(tokenId);
        console.log(`Token URI: ${tokenURI}`);

        const expectedURI = `${prefix}${currentPhase.replace(` `, `_`)}${postfix}`;
        expect(tokenURI).to.equal(expectedURI);
    })

    it("NFT Contract - Create another special type", async function () {
        const prefix = "https://williamdoyle.ca/lunar-tokens/minimalist-version/";
        const postfix = ".json";
        await nftContract.createSpecialType([
            `${prefix}New_Moon${postfix}`,
            `${prefix}Waxing_Crescent${postfix}`,
            `${prefix}First_Quarter${postfix}`,
            `${prefix}Waxing_Gibbous${postfix}`,
            `${prefix}Full_Moon${postfix}`,
            `${prefix}Waning_Gibbous${postfix}`,
            `${prefix}Last_Quarter${postfix}`,
            `${prefix}Waning_Crescent${postfix}`,
        ])

        await nftContract.mint(owner, 2);
        const tokenId = await nftContract.tokenOfOwnerByIndex(owner, 2);
        expect(tokenId).to.equal(2);

        const tokenURI = await nftContract.tokenURI(tokenId);
        console.log(`Token URI: ${tokenURI}`);

        const expectedURI = `${prefix}${currentPhase.replace(` `, `_`)}${postfix}`;
        expect(tokenURI).to.equal(expectedURI);
    })
});
