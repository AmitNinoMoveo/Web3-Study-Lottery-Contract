// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Lottery {
    constructor() {
        manager = msg.sender;
    }

    // ===== Manager =====

    address public manager;

    // ===== Players =====

    address payable[] public players;

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }

    function enter() public payable {
        require(msg.value > 0.001 ether);
        players.push(payable(msg.sender));
    }

    // ====== Pool =====

    function pickWinner() public restricted playersValid {
        uint8 randIndex = uint8(getRandomUint() % players.length);
        players[randIndex].transfer(address(this).balance);
        players = new address payable[](0);
    }

    function getRandomUint() private view returns (uint256) {
        return uint256(keccak256(abi.encode(block.difficulty, block.timestamp, players)));
    }

    // ===== Modifires =====
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    modifier playersValid() {
        require(players.length > 1);
        _;
    }
}
