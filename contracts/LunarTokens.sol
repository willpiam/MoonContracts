// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./ILunar.sol";

contract LunarTokens is ERC721, ERC721Enumerable, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _specialIdCounter;

    ILunar public lunar;

    mapping(uint256 => uint256) private tokenIdToSpecialTypeId;
    mapping(uint256 => mapping(string => string)) private specialTypeIdToSpecialPhaseURIs;
    mapping(uint256 => bool) private isValidSpecialTypeId;

    constructor(
        ILunar _lunaSource,
        string[] memory uris
    ) ERC721("Magic Moons", "MMOON") {
        lunar = _lunaSource;

        createSpecialType(uris); // make specialTypeIdToSpecialPhaseURIs[0] the default type
    }

    function mint(address to, uint256 specialTypeId) public onlyOwner {
        require(isValidSpecialTypeId[specialTypeId], "Special type does not exist");
        // require(Strings.equal(lunar.currentPhase(), "Full Moon"), "You can only mint under a Full Moon"); // for later  
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        tokenIdToSpecialTypeId[tokenId] = specialTypeId;

        _safeMint(to, tokenId);
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
        return specialTypeIdToSpecialPhaseURIs[specialTypeId][lunar.currentPhase()];
    }

    function createSpecialType(
        string[] memory uris
    ) public onlyOwner {
        require(uris.length == 8, "Must provide 8 URIs");
        uint256 specialTypeId = _specialIdCounter.current();
        _specialIdCounter.increment();
        
        isValidSpecialTypeId[specialTypeId] = true;

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
