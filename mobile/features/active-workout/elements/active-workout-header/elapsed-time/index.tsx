import { Typography } from '@/components/ui';
import { IActiveWorkout } from '@/types/active-workout';
import React, { useEffect } from 'react';

type Props = {
  elapsedTime: number;
  setElapsedTime: (time: number) => void;
  activeWorkout: IActiveWorkout | null;
  isWorkoutActive: boolean;
};

export const ElapsedTime: React.FC<Props> = ({
  elapsedTime,
  setElapsedTime,
  activeWorkout,
  isWorkoutActive,
}) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (activeWorkout && isWorkoutActive) {
      interval = setInterval(() => {
        const now = Date.now();
        const started = new Date(activeWorkout.startedAt).getTime();
        const elapsed =
          Math.floor((now - started) / 1000) -
          activeWorkout.totalPauseTimeSeconds;
        setElapsedTime(Math.max(0, elapsed));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeWorkout, isWorkoutActive, setElapsedTime]);

  return (
    <Typography variant="body2" color="textMuted">
      {formatTime(elapsedTime)}
    </Typography>
  );
};
