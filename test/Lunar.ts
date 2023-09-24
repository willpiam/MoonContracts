import { expect } from "chai";
import { ethers } from "hardhat";

describe("Lunar", async () => {
    let lunar: any;
    let currentPhase: string;
    let nftContract: any;
    let owner: any;
    const paymentAccount = ethers.Wallet.createRandom();

    it("simple test", async () => {
        lunar = await ethers.deployContract("Lunar");
        await lunar.waitForDeployment();
        const lunarAddress = await lunar.getAddress();
        console.log(`Lunar deployed to: ${lunarAddress}`)

        currentPhase = await lunar.currentPhase();
        console.log(`Current phase:     ${currentPhase}`);

        const currentFraction: bigint = await lunar.currentFrac();
        console.log(`Current fraction:  ${currentFraction}`);

        const numberOfSynodicMonths: bigint = await lunar.numberOfSynodicMonthsSinceReferenceNewMoon();
        console.log(`Number of synodic months since reference new moon: ${numberOfSynodicMonths}`);
    });

    it("NFT Contract", async () => {
        const prefix = "https://williamdoyle.ca/lunar-tokens/standard-version/";
        const postfix = ".json";
        nftContract = await ethers.deployContract("LunarTokens", [
            lunar.getAddress(),
            [
                `${prefix}New_Moon${postfix}`,
                `${prefix}Waxing_Crescent${postfix}`,
                `${prefix}First_Quarter${postfix}`,
                `${prefix}Waxing_Gibbous${postfix}`,
                `${prefix}Full_Moon${postfix}`,
                `${prefix}Waning_Gibbous${postfix}`,
                `${prefix}Last_Quarter${postfix}`,
                `${prefix}Waning_Crescent${postfix}`,
            ],
            ethers.parseEther("1"),
            paymentAccount.address,
        ]);

        owner = await nftContract.owner();
        console.log(`NFT Contract owner: ${owner}`);

        await nftContract.mint(owner, 0, {
            value: ethers.parseEther("1")
        });
        const tokenId = await nftContract.tokenOfOwnerByIndex(owner, 0);
        expect(tokenId).to.equal(0);

        const tokenURI = await nftContract.tokenURI(tokenId);
        console.log(`Token URI: ${tokenURI}`);

        const expectedURI = `${prefix}${currentPhase.replace(` `, `_`)}${postfix}`;
        expect(tokenURI).to.equal(expectedURI);
    })

    it("NFT Contract - Create a special type", async () => {
        const prefix = "https://williamdoyle.ca/lunar-tokens/psychedelic-version/";
        const postfix = ".json";
        await nftContract.createSpecialType(
            [
                `${prefix}New_Moon${postfix}`,
                `${prefix}Waxing_Crescent${postfix}`,
                `${prefix}First_Quarter${postfix}`,
                `${prefix}Waxing_Gibbous${postfix}`,
                `${prefix}Full_Moon${postfix}`,
                `${prefix}Waning_Gibbous${postfix}`,
                `${prefix}Last_Quarter${postfix}`,
                `${prefix}Waning_Crescent${postfix}`,
            ],
            ethers.parseEther("2"),
            100
        )

        await nftContract.mint(owner, 1, {
            value: ethers.parseEther("2")
        });
        const tokenId = await nftContract.tokenOfOwnerByIndex(owner, 1);
        expect(tokenId).to.equal(1);

        const tokenURI = await nftContract.tokenURI(tokenId);
        console.log(`Token URI: ${tokenURI}`);

        const expectedURI = `${prefix}${currentPhase.replace(` `, `_`)}${postfix}`;
        expect(tokenURI).to.equal(expectedURI);
    })

    it("NFT Contract - Create another special type", async () => {
        const prefix = "https://williamdoyle.ca/lunar-tokens/minimalist-version/";
        const postfix = ".json";
        await nftContract.createSpecialType(
            [
                `${prefix}New_Moon${postfix}`,
                `${prefix}Waxing_Crescent${postfix}`,
                `${prefix}First_Quarter${postfix}`,
                `${prefix}Waxing_Gibbous${postfix}`,
                `${prefix}Full_Moon${postfix}`,
                `${prefix}Waning_Gibbous${postfix}`,
                `${prefix}Last_Quarter${postfix}`,
                `${prefix}Waning_Crescent${postfix}`,
            ],
            ethers.parseEther("3"),
            3
        )

        await nftContract.mint(owner, 2, {
            value: ethers.parseEther("3")
        });
        const tokenId = await nftContract.tokenOfOwnerByIndex(owner, 2);
        expect(tokenId).to.equal(2);

        const tokenURI = await nftContract.tokenURI(tokenId);
        console.log(`Token URI: ${tokenURI}`);

        const expectedURI = `${prefix}${currentPhase.replace(` `, `_`)}${postfix}`;
        expect(tokenURI).to.equal(expectedURI);
    })

    it("Make sure we can't mint more than the specified supply of a given special type", async () => {
        // mint 2 more of the minimalist type
        await nftContract.mint(owner, 2, { value: ethers.parseEther("3") });
        await nftContract.mint(owner, 2, { value: ethers.parseEther("3") });

        // expect the next mint call to fail
        expect(nftContract.mint(owner, 2, { value: ethers.parseEther("3") })).to.be.revertedWith("Supply of this type has been exhausted")
    })

    it("Payment address can withdraw funds", async () => {
        const balanceOwed = await nftContract.payments(paymentAccount.address);
        console.log(`Balance owed: ${balanceOwed}`);

        const balanceBefore = await ethers.provider.getBalance(paymentAccount.address);
        console.log(`Balance before: ${balanceBefore}`);

        await nftContract.withdrawPayments(paymentAccount.address);

        const balanceAfter = await ethers.provider.getBalance(paymentAccount.address);
        console.log(`Balance after: ${balanceAfter}`);

        expect(balanceAfter).to.be.gt(balanceBefore);
    })

    it("Owner can change price and payment address or even the lunar data source contract", async () => {
        const price_t1 = await nftContract.getPrice(0);
        expect(price_t1).to.equal(ethers.parseEther("1"))

        await nftContract.setPrice(0, ethers.parseEther("1.1"));

        const price_t2 = await nftContract.getPrice(0);
        expect(price_t2).to.equal(ethers.parseEther("1.1"))
    })

    it("burning tokens, total supply, and live supply of individual types + live mintable amount", async () => {
        const totalSupply = await nftContract.totalSupply();
        console.log(`Total supply: ${totalSupply}`);

        const liveSupplyOfStandard = await nftContract.liveSupplyOf(0);
        console.log(`Live supply of standard: ${liveSupplyOfStandard}`);

        const liveMintableAmountOfStandard = await nftContract.liveMintableAmountOf(0);
        console.log(`Live mintable amount of standard: ${liveMintableAmountOfStandard}`);

        // continue here ... 

    })


});
