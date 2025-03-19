// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LuckyBlock {
    address public owner;
    uint256 public ticketPrice = 0.01 ether;
    uint256 public jackpot;
    address[] public participants;
    uint256 public endTime;
    address public lastWinner;
    uint256 public lastJackpot;
    bool public isActive;

    event TicketPurchased(address indexed buyer);
    event WinnerPicked(address indexed winner, uint256 jackpot);

    constructor() {
        owner = msg.sender;
        endTime = block.timestamp + 30 minutes;
        isActive = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function buyTicket() external payable {
        require(isActive, "Lottery is not active");
        require(block.timestamp < endTime, "Lottery has ended");
        require(msg.value == ticketPrice, "Incorrect ticket price");

        participants.push(msg.sender);
        jackpot += msg.value;

        emit TicketPurchased(msg.sender);
    }

    function pickWinner() public {
        require(block.timestamp >= endTime || !isActive, "Lottery is still active");
        require(participants.length > 0, "No participants");

        uint256 randomIndex = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    participants.length
                )
            )
        ) % participants.length;

        address winner = participants[randomIndex];
        uint256 prize = jackpot;

        lastWinner = winner;
        lastJackpot = prize;
        
        // Reset lottery
        delete participants;
        jackpot = 0;
        endTime = block.timestamp + 30 minutes;
        isActive = true;

        emit WinnerPicked(winner, prize);
        
        (bool sent, ) = winner.call{value: prize}("");
        require(sent, "Failed to send prize");
    }

    function getParticipants() external view returns (address[] memory) {
        return participants;
    }

    function setTicketPrice(uint256 _price) external onlyOwner {
        ticketPrice = _price;
    }

    function emergencyWithdraw() external onlyOwner {
        require(!isActive, "Lottery must be stopped first");
        require(address(this).balance > 0, "No balance to withdraw");
        
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Failed to withdraw");
    }

    function stopLottery() external onlyOwner {
        isActive = false;
    }
}