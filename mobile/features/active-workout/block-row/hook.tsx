import { useColorScheme } from '@/hooks/useColorScheme';
import { IActiveBlock } from '@/types/active-workout';
import { IRepsType } from '@/types/routine';
import { Link2, RotateCcw } from 'lucide-react-native';
type Params = {
  block: IActiveBlock;
};

export const useBlockRow = ({ block }: Params) => {
  const { colors } = useColorScheme();

  // Block styles
  const getBlockColors = () => {
    switch (block.type) {
      case 'superset':
        return {
          primary: '#FF6B35', // Orange
          light: '#FF6B3520',
          border: '#FF6B3530',
        };
      case 'circuit':
        return {
          primary: '#4A90E2', // Blue
          light: '#4A90E220',
          border: '#4A90E230',
        };
      default: // individual
        return {
          primary: colors.primary[500],
          light: colors.primary[500] + '20',
          border: colors.primary[500] + '30',
        };
    }
  };

  const blockColors = getBlockColors();

  const getBlockTypeLabel = () => {
    switch (block.type) {
      case 'superset':
        return 'Superserie';
      case 'circuit':
        return 'Circuito';
      default:
        return 'Individual';
    }
  };

  const getSetTypeLabel = (type: string) => {
    switch (type) {
      case 'warmup':
        return 'W';
      case 'drop':
        return 'D';
      case 'failure':
        return 'F';
      case 'cluster':
        return 'C';
      case 'rest-pause':
        return 'RP';
      case 'mechanical':
        return 'M';
      default:
        return '';
    }
  };

  const getSetTypeColor = (type: string) => {
    switch (type) {
      case 'warmup':
        return colors.warning[500];
      case 'drop':
        return colors.error[500];
      case 'failure':
        return colors.error[500];
      case 'cluster':
        return colors.info[500];
      case 'rest-pause':
        return colors.secondary[500];
      case 'mechanical':
        return colors.success[500];
      default:
        return colors.primary[500];
    }
  };

  const getBlockTypeIcon = () => {
    switch (block.type) {
      case 'superset':
        return <Link2 size={18} color={blockColors.primary} />;
      case 'circuit':
        return <RotateCcw size={18} color={blockColors.primary} />;
      default:
        return <Link2 size={18} color={blockColors.primary} />;
    }
  };

  const getRepsColumnTitle = (repsType: IRepsType) => {
    switch (repsType) {
      case 'reps':
        return 'REPS';
      case 'range':
        return 'RANGO';
      case 'time':
        return 'TIEMPO';
      case 'distance':
        return 'DIST';
      default:
        return 'REPS';
    }
  };

  const formatRestTime = (seconds: number) => {
    if (seconds === 0) return 'Sin descanso';
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0
      ? `${mins}:${secs.toString().padStart(2, '0')} min`
      : `${mins} min`;
  };

  return {
    blockColors,
    getBlockTypeLabel,
    getSetTypeLabel,
    getSetTypeColor,
    getBlockTypeIcon,
    getRepsColumnTitle,
    formatRestTime,
  };
};
