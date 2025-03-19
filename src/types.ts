export interface Participant {
  address: string;
  tickets: number;
}

export interface LotteryState {
  ticketPrice: number;
  jackpot: number;
  participants: Participant[];
  endTime: Date;
  lastWinner: string | null;
  lastJackpot: number | null;
  isActive: boolean;
}