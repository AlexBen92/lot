export const LUCKY_BLOCK_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';

export const LUCKY_BLOCK_ABI = [
  "function buyTicket() external payable",
  "function getParticipants() external view returns (address[])",
  "function ticketPrice() external view returns (uint256)",
  "function jackpot() external view returns (uint256)",
  "function endTime() external view returns (uint256)",
  "function lastWinner() external view returns (address)",
  "function lastJackpot() external view returns (uint256)",
  "event TicketPurchased(address indexed buyer)",
  "event WinnerPicked(address indexed winner, uint256 jackpot)"
];