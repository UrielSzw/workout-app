import { useColorScheme } from '@/hooks/useColorScheme';
import { IBlock, IRepsType, ISet } from '@/types/routine';
import { Link2, RotateCcw } from 'lucide-react-native';
import { useState } from 'react';
import { Vibration } from 'react-native';

type Params = {
  block: IBlock;
  onUpdateBlock: (blockId: string, updatedData: Partial<IBlock>) => void;
  onDeleteBlock: (blockId: string) => void;
  onLongPressReorderExercises?: (block: IBlock) => void;
  onLongPressReorder?: () => void;
  onConvertToIndividual: (blockId: string) => void;
};

export const useBlockRow = ({
  block,
  onUpdateBlock,
  onDeleteBlock,
  onLongPressReorderExercises,
  onConvertToIndividual,
  onLongPressReorder,
}: Params) => {
  const { colors } = useColorScheme();

  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

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

  // Inner block functions
  const addSetToExercise = (exerciseId: string) => {
    const exercise = block.exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    const newSet: ISet = {
      id: Date.now().toString() + Math.random(),
      setNumber: exercise.sets.length + 1,
      weight:
        exercise.sets.length > 0
          ? exercise.sets[exercise.sets.length - 1].weight
          : '',
      reps:
        exercise.sets.length > 0
          ? exercise.sets[exercise.sets.length - 1].reps
          : '',
      type: 'normal',
      completed: false,
      repsType: 'reps',
    };

    const updatedExercises = block.exercises.map((ex) =>
      ex.id === exerciseId ? { ...ex, sets: [...ex.sets, newSet] } : ex,
    );

    onUpdateBlock(block.id, { exercises: updatedExercises });
  };

  const updateSet = (
    exerciseId: string,
    setId: string,
    updates: Partial<ISet>,
  ) => {
    const updatedExercises = block.exercises.map((ex) =>
      ex.id === exerciseId
        ? {
            ...ex,
            sets: ex.sets.map((set) =>
              set.id === setId ? { ...set, ...updates } : set,
            ),
          }
        : ex,
    );

    onUpdateBlock(block.id, { exercises: updatedExercises });
  };

  const handleDeleteBlock = () => {
    setShowMenu(false);
    // Add confirmation logic here if needed
    onDeleteBlock(block.id);
  };

  const handleConvertToIndividual = () => {
    setShowMenu(false);
    onConvertToIndividual(block.id);
  };

  const handleLongPress = () => {
    if (onLongPressReorder) {
      Vibration.vibrate(50); // Haptic feedback
      onLongPressReorder();
    }
  };

  const handleLongPressExercise = () => {
    // Solo permitir reordenamiento si hay más de 1 ejercicio
    if (onLongPressReorderExercises && block.exercises.length > 1) {
      Vibration.vibrate(50); // Haptic feedback
      onLongPressReorderExercises(block);
    }
  };

  return {
    isExpanded,
    setIsExpanded,
    showMenu,
    setShowMenu,
    blockColors,
    getBlockTypeLabel,
    getSetTypeLabel,
    getSetTypeColor,
    getBlockTypeIcon,
    getRepsColumnTitle,
    formatRestTime,
    addSetToExercise,
    updateSet,
    handleDeleteBlock,
    handleConvertToIndividual,
    handleLongPress,
    handleLongPressExercise,
  };
};
