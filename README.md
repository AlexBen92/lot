- 
- **Transaction Management:** Loading states, success/error notifications, ETH value formatting, automatic state updates.
- **User Experience:** Toast notifications, proper error messages, transaction status updates, automatic UI updates.

## 🧱 Architecture

The application is designed for easy transition to a real blockchain:

- `useLottery` Hook: Contains all lottery logic; update with smart contract calls.
- Types: Separately defined for easy modification and scalability.
- Modular UI: Reusable components for maintainability.

## ⚙️ Current Simulation

The current version simulates:

- Wallet connection
- 30-minute lottery rounds
- Random winner selection
- Ticket purchases
- Jackpot accumulation

## 🚀 Roadmap

- Integrate with a specific blockchain (e.g., Ethereum, Polygon).
- Implement secure smart contracts for lottery logic.
- Add more sophisticated wallet integration features.

## 💻 Technologies Used

- React
- TypeScript
- [Add any UI library or specific dependencies here e.g., Material UI, ethers.js, web3.js, etc.]

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
