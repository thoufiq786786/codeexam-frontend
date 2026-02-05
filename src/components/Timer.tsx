import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  startTime: number;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, startTime, className }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      return remaining;
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, startTime, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 300; // Less than 5 minutes
  const isCritical = timeLeft < 60; // Less than 1 minute

  return (
    <div className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg transition-colors",
      isLowTime ? (isCritical ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning") : "bg-secondary text-secondary-foreground",
      isCritical && "animate-pulse",
      className
    )}>
      <Clock className="w-5 h-5" />
      <span className="font-semibold">{formatTime(timeLeft)}</span>
    </div>
  );
};
