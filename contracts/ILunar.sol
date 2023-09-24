// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

// A minimal interface defining only what a client who wants to know the current phase needs to know about.
interface ILunar {
    function currentPhase() external view returns (string memory);
    function numberOfSynodicMonthsSinceReferenceNewMoon() external view returns (uint256);
    function synodicMonth() external view returns (uint256);
}
