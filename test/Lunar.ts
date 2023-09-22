import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lunar", async function () {
    it("simple test", async function () {
        const lunar = await ethers.deployContract("Lunar");
        await lunar.waitForDeployment();
        const lunarAddress = await lunar.getAddress();
        console.log(`Lunar deployed to: ${lunarAddress}`)

        const currentPhase : string = await lunar.currentPhase();
        console.log(`Current phase:     ${currentPhase}`);

        const currentFraction : bigint = await lunar.currentFrac();
        console.log(`Current fraction:  ${currentFraction}`);

        it("NFT Contract", async function () {
            const nftContract = await ethers.deployContract("LunarTokens", [lunar.getAddress()]);



            
        })
    });
});
