# William Doyle's Lunar Contracts 

https://moon.williamdoyle.ca/

## Description

This is an NFT project all about the moon. Each token will display the current phase of the moon based on ON CHAIN data. 

## Definitions 
Synodic Month - Period of time it talks for one full moon cycle to complete. 29.53 days

Special Type Id - This references an index referencing the "version/mutation" of the minted token. 

Supply - The supply of this token as a whole is limited only by the number of "special types" I create and the supply limit I set for each. However, the supply of each "special type" is limited to the amount specified when the special type is created. The supply of special types zero, or the standard version, will be specified at the time of deployment.

Please note that I do plan on adding more special types in the future.

Minting Policy - tokens can only be minted under a full moon. Only N per moon. 

# TODO

## Interface

1. Display the current phase of the moon using a public RPC instead of metamask .. so the site can be used just to check the current phase of the moon.
2. Allow users to specify the recipient address, they may not want to receive the token at the address they are using to interact with the site. But this option should be hidden by default.

## Contract
1. Deploy on milkomeda
2. setup and integrate with DCSparks wrapped smart contracts
3. find a way to avoid metamask all together.
4. allow people to mint these tokens via lace or some other cardano wallet
6. see if there is a way for people to take these tokens onto cardano mainnet