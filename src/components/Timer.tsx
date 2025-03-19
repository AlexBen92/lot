import React from 'react';
import { differenceInSeconds } from 'date-fns';
import { Timer as TimerIcon } from 'lucide-react';

interface TimerProps {
  endTime: Date;
  isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({ endTime, isActive }) => {
  const [timeLeft, setTimeLeft] = React.useState('');

  React.useEffect(() => {
    const updateTimer = () => {
      const diff = differenceInSeconds(endTime, new Date());
      if (diff <= 0) {
        setTimeLeft('00:00');
        return;
      }

      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex items-center space-x-2 text-2xl font-mono">
      <TimerIcon className={`w-6 h-6 ${isActive ? 'text-green-500' : 'text-red-500'}`} />
      <span>{timeLeft}</span>
    </div>
  );
};