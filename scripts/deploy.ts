import { ethers } from "hardhat";

const uris : string[] = [
  `QmUBF8UzjH3cLw9wrUjrwoydBoxhukaGJZtKf9K1GQxKhG/New_Moon.json`,
  `QmUBF8UzjH3cLw9wrUjrwoydBoxhukaGJZtKf9K1GQxKhG/Waxing_Crescent.json`,
  `QmUBF8UzjH3cLw9wrUjrwoydBoxhukaGJZtKf9K1GQxKhG/First_Quarter.json`,
  `QmUBF8UzjH3cLw9wrUjrwoydBoxhukaGJZtKf9K1GQxKhG/Waxing_Gibbous.json`,
  `QmUBF8UzjH3cLw9wrUjrwoydBoxhukaGJZtKf9K1GQxKhG/Full_Moon.json`,
  `QmUBF8UzjH3cLw9wrUjrwoydBoxhukaGJZtKf9K1GQxKhG/Waning_Gibbous.json`,
  `QmUBF8UzjH3cLw9wrUjrwoydBoxhukaGJZtKf9K1GQxKhG/Last_Quarter.json`,
  `QmUBF8UzjH3cLw9wrUjrwoydBoxhukaGJZtKf9K1GQxKhG/Waning_Crescent.json`,
];

async function main() {

  const lunar = await ethers.deployContract("Lunar", [], { });

  await lunar.waitForDeployment();

  const lunarAddress = await lunar.getAddress();

  console.log(`Lunar deployed to: ${lunarAddress}`)

  const currentPhase = await lunar.currentPhase();

  console.log(`Current phase:     ${currentPhase}`);

  const nftContract = await ethers.deployContract("LunarTokens", [lunarAddress, uris]);

  const nftContractAddress = await nftContract.getAddress();

  console.log(`NFT Contract deployed to: ${nftContractAddress}`);

  const owner = await nftContract.owner();

  console.log(`NFT Contract owner: ${owner}`);

  // mint one into my account
  await nftContract.mint(`0xd90f7Fb941829CFE7Fc50eD235d1Efac05c58190`, 0);

  const tokenId = await nftContract.tokenOfOwnerByIndex(`0xd90f7Fb941829CFE7Fc50eD235d1Efac05c58190`, 0);

  console.log(`Token ID: ${tokenId}`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
