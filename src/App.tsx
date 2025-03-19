import React from 'react';
import { Ticket, Coins, Trophy, Wallet } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useLottery } from './hooks/useLottery';
import { Timer } from './components/Timer';

function App() {
  const { connected, walletAddress, lotteryState, connectWallet, buyTicket } = useLottery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-3">
              <Trophy className="w-10 h-10 text-yellow-400" />
              <h1 className="text-4xl font-bold">Lucky Block</h1>
            </div>
            <button
              onClick={connectWallet}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${
                connected
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              } transition-colors`}
            >
              <Wallet className="w-5 h-5" />
              <span>
                {connected
                  ? `${walletAddress?.slice(0, 6)}...${walletAddress?.slice(-4)}`
                  : 'Connect Wallet'}
              </span>
            </button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Current Lottery */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Current Round</h2>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Coins className="w-6 h-6 text-yellow-400" />
                  <span className="text-lg">Ticket Price:</span>
                </div>
                <span className="text-xl font-bold">{lotteryState.ticketPrice} ETH</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <span className="text-lg">Current Jackpot:</span>
                </div>
                <span className="text-xl font-bold">{lotteryState.jackpot} ETH</span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Ticket className="w-6 h-6 text-yellow-400" />
                  <span className="text-lg">Participants:</span>
                </div>
                <span className="text-xl font-bold">{lotteryState.participants.length}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg">Time Remaining:</span>
                <Timer endTime={lotteryState.endTime} isActive={lotteryState.isActive} />
              </div>

              <button
                onClick={buyTicket}
                disabled={!connected}
                className="w-full mt-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Buy Ticket
              </button>
            </div>

            {/* Right Column - Last Winner */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Last Winner</h2>
              
              {lotteryState.lastWinner ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                    <span className="text-lg">Winner Address:</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 break-all">
                    {lotteryState.lastWinner}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg">Prize Amount:</span>
                    <span className="text-xl font-bold">{lotteryState.lastJackpot} ETH</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No winner yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;