import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { LotteryState } from '../types';
import { LUCKY_BLOCK_ADDRESS, LUCKY_BLOCK_ABI } from '../contracts/LuckyBlock';
import toast from 'react-hot-toast';

export const useLottery = () => {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [lotteryState, setLotteryState] = useState<LotteryState>({
    ticketPrice: 0,
    jackpot: 0,
    participants: [],
    endTime: new Date(),
    lastWinner: null,
    lastJackpot: null,
    isActive: true
  });

  // Initialize Web3 provider
  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(provider);
      
      const contract = new ethers.Contract(
        LUCKY_BLOCK_ADDRESS,
        LUCKY_BLOCK_ABI,
        provider
      );
      setContract(contract);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
          setConnected(false);
        }
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      window.ethereum?.removeAllListeners();
    };
  }, []);

  // Connect wallet
  const connectWallet = async () => {
    if (!provider) {
      toast.error('Please install MetaMask!');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      const signer = await provider.getSigner();
      setSigner(signer);
      setWalletAddress(accounts[0]);
      setConnected(true);

      // Update contract with signer
      if (contract) {
        setContract(contract.connect(signer));
      }

      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    }
  };

  // Buy ticket
  const buyTicket = async () => {
    if (!contract || !connected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      const tx = await contract.buyTicket({
        value: lotteryState.ticketPrice
      });
      
      toast.loading('Buying ticket...');
      await tx.wait();
      
      toast.success('Ticket purchased successfully!');
      await updateLotteryState();
    } catch (error) {
      console.error('Error buying ticket:', error);
      toast.error('Failed to buy ticket');
    }
  };

  // Update lottery state
  const updateLotteryState = useCallback(async () => {
    if (!contract) return;

    try {
      const [
        ticketPrice,
        jackpot,
        participants,
        endTime,
        lastWinner,
        lastJackpot
      ] = await Promise.all([
        contract.ticketPrice(),
        contract.jackpot(),
        contract.getParticipants(),
        contract.endTime(),
        contract.lastWinner(),
        contract.lastJackpot()
      ]);

      setLotteryState({
        ticketPrice: Number(ethers.formatEther(ticketPrice)),
        jackpot: Number(ethers.formatEther(jackpot)),
        participants: participants.map(address => ({ address, tickets: 1 })),
        endTime: new Date(Number(endTime) * 1000),
        lastWinner,
        lastJackpot: Number(ethers.formatEther(lastJackpot)),
        isActive: Number(endTime) * 1000 > Date.now()
      });
    } catch (error) {
      console.error('Error updating lottery state:', error);
    }
  }, [contract]);

  // Listen for contract events
  useEffect(() => {
    if (!contract) return;

    const ticketPurchasedFilter = contract.filters.TicketPurchased();
    const winnerPickedFilter = contract.filters.WinnerPicked();

    contract.on(ticketPurchasedFilter, () => {
      updateLotteryState();
      toast.success('New ticket purchased!');
    });

    contract.on(winnerPickedFilter, (winner: string, amount: bigint) => {
      updateLotteryState();
      toast.success(`Winner picked! ${ethers.formatEther(amount)} ETH won!`);
    });

    return () => {
      contract.removeAllListeners();
    };
  }, [contract, updateLotteryState]);

  // Initial state update
  useEffect(() => {
    updateLotteryState();
  }, [updateLotteryState]);

  return {
    connected,
    walletAddress,
    lotteryState,
    connectWallet,
    buyTicket
  };
};