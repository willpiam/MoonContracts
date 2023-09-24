// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "./ILunar.sol";

struct Settings {
    ILunar lunar;
    address paymentAddress;
}

contract LunarTokens is ERC721, ERC721Enumerable, ERC721Burnable, Ownable, PullPayment {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _specialIdCounter;

    mapping(uint256 => uint256) private tokenIdToSpecialTypeId;
    mapping(uint256 => mapping(string => string)) private specialTypeIdToSpecialPhaseURIs;
    mapping(uint256 => bool) private isValidSpecialTypeId;
    mapping(uint256 => uint256) private specialTypeIdToPrice; 
    mapping(uint256 => uint256) private specialTypeIdToSupply; 
    mapping(uint256 => uint256) private specialTypeIdToAmountMinted;
    mapping(uint256 => uint256) private specialTypeIdToAmountBurned;

    Settings settings;

    constructor(
        ILunar _lunaSource,
        string[] memory uris,
        uint256 standardPrice,
        address _paymentAddress
    ) ERC721("Magic Moons", "MMOON") {
        settings.lunar = _lunaSource;

        settings.paymentAddress = _paymentAddress;

        createSpecialType(uris, standardPrice, 100_000); // make specialTypeIdToSpecialPhaseURIs[0] the default type
    }

    function getPrice(uint256 specialTypeId) public view returns (uint256) {
        return specialTypeIdToPrice[specialTypeId];
    }

    function liveSupplyOf(uint256 specialTypeId) public view returns (uint256) {
        return specialTypeIdToAmountMinted[specialTypeId] - specialTypeIdToAmountBurned[specialTypeId];
    }

    function setPrice(uint256 specialTypeId, uint256 newPrice) public onlyOwner {
        require(isValidSpecialTypeId[specialTypeId], "Special type does not exist");
        specialTypeIdToPrice[specialTypeId] = newPrice;
    }

    function liveMintableAmount(uint256 specialTypeId) public view returns (uint256) {
        return specialTypeIdToSupply[specialTypeId] - specialTypeIdToAmountMinted[specialTypeId];
    }

    function setSettings(
        ILunar _lunaSource,
        address _paymentAddress
    ) public onlyOwner {
        settings.lunar = _lunaSource;
        settings.paymentAddress = _paymentAddress;
    }
    
    function mint(address to, uint256 specialTypeId) public payable {
        require(isValidSpecialTypeId[specialTypeId], "Special type does not exist");
        // require(Strings.equal(lunar.currentPhase(), "Full Moon"), "You can only mint under a Full Moon"); // for later  
        require(specialTypeIdToAmountMinted[specialTypeId] < specialTypeIdToSupply[specialTypeId], "Supply of this type has been exhausted");
        require(msg.value == specialTypeIdToPrice[specialTypeId], "Must send the correct amount of Currency");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        tokenIdToSpecialTypeId[tokenId] = specialTypeId;
        specialTypeIdToAmountMinted[specialTypeId]++;

        _safeMint(to, tokenId);

        _asyncTransfer(settings.paymentAddress, specialTypeIdToPrice[specialTypeId]); // pay for minting
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721) returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        uint256 specialTypeId = tokenIdToSpecialTypeId[tokenId];
        return specialTypeIdToSpecialPhaseURIs[specialTypeId][settings.lunar.currentPhase()];
    }

    function burn(uint256 tokenId) public override(ERC721Burnable) {
        uint256 specialTypeId = tokenIdToSpecialTypeId[tokenId];
        super.burn(tokenId);
        specialTypeIdToAmountBurned[specialTypeId]++;
    }

    function createSpecialType(
        string[] memory uris,
        uint256 price,
        uint256 supply
    ) public onlyOwner {
        require(uris.length == 8, "Must provide 8 URIs");
        require(price > 0, "Price must be greater than 0");
        require(supply > 0, "Supply must be greater than 0");

        uint256 specialTypeId = _specialIdCounter.current();
        _specialIdCounter.increment();
        
        isValidSpecialTypeId[specialTypeId] = true;

        specialTypeIdToPrice[specialTypeId] = price;
        specialTypeIdToSupply[specialTypeId] = supply;

        specialTypeIdToSpecialPhaseURIs[specialTypeId]["New Moon"] = uris[0];
        specialTypeIdToSpecialPhaseURIs[specialTypeId]["Waxing Crescent"] = uris[1];
        specialTypeIdToSpecialPhaseURIs[specialTypeId]["First Quarter"] = uris[2];
        specialTypeIdToSpecialPhaseURIs[specialTypeId]["Waxing Gibbous"] = uris[3];
        specialTypeIdToSpecialPhaseURIs[specialTypeId]["Full Moon"] = uris[4];
        specialTypeIdToSpecialPhaseURIs[specialTypeId]["Waning Gibbous"] = uris[5];
        specialTypeIdToSpecialPhaseURIs[specialTypeId]["Last Quarter"] = uris[6];
        specialTypeIdToSpecialPhaseURIs[specialTypeId]["Waning Crescent"] = uris[7];
    }
}
