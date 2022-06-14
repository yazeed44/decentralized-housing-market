// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14 .0;

import "./Verifier.sol";
import "./ERC721Mintable.sol";

contract SolnSquareVerifier is PropertyERC721Token {
    struct Solution {
        address owner;
        uint256 index;
    }

    Solution[] private solutions;

    mapping(bytes32 => Solution) private uniqueSolutions;

    event SolutionAdded(address indexed owner, uint256 index);

    Verifier private verifier;

    constructor(
        string memory name,
        string memory symbol,
        address verifierAddress
    ) PropertyERC721Token(name, symbol) {
        verifier = Verifier(verifierAddress);
    }

    function addSolution(address owner, uint256 index) public returns (Solution memory) {
        Solution memory solution = Solution({owner: owner, index: index});
        solutions.push(solution);
        emit SolutionAdded(owner, index);
        return solution;
    }

    function mint(
        address tokenOwner,
        uint256 index,
        Verifier.Proof memory proof,
        uint256[2] memory input
    ) public returns (bool) {
        //verify the solution.
        bool verified = verifier.verifyTx(proof, input);
        require(verified, "Failed to verify");

        bytes32 key = keccak256(abi.encodePacked(tokenOwner, index, input));

        require(uniqueSolutions[key].owner == address(0), "Solution already submitted");

        uniqueSolutions[key] = addSolution(tokenOwner, index);

        return super.mint(tokenOwner, index);
    }
}

// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
