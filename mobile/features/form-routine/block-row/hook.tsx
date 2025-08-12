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

  const formatRepsValue = (set: ISet) => {
    if (set.repsType === 'range') {
      const min = set.repsRange?.min || '';
      const max = set.repsRange?.max || '';
      if (min && max) {
        return `${min}-${max}`;
      } else if (min) {
        return min;
      } else if (max) {
        return max;
      }
      return '';
    }
    return set.reps || '';
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
    setIndex: number,
    updates: Partial<ISet>,
  ) => {
    const exercise = block.exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    // Obtener el valor anterior del set que estamos modificando para la comparación
    const currentSet = exercise.sets[setIndex];

    const updatedExercises = block.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const updatedSets = ex.sets.map((set, index) => {
          // Actualizar el set actual
          if (set.id === setId) {
            return { ...set, ...updates };
          }

          // Auto-completar sets siguientes con lógica inteligente
          if (index > setIndex) {
            const autoUpdates: Partial<ISet> = {};

            // Verificar cada campo que se está actualizando
            Object.entries(updates).forEach(([field, value]) => {
              if (value !== '' && value !== undefined && value !== null) {
                const currentFieldValue = (set as any)[field];
                const originalFieldValue = (currentSet as any)[field];

                // Auto-completar solo si:
                // 1. El campo está vacío, O
                // 2. El campo actual es exactamente igual al valor anterior del set que estoy modificando
                //    (esto permite que "1" → "10" funcione correctamente)
                if (
                  currentFieldValue === '' ||
                  currentFieldValue === undefined ||
                  currentFieldValue === null ||
                  currentFieldValue === originalFieldValue
                ) {
                  (autoUpdates as any)[field] = value;
                }
              }
            });

            // Solo aplicar auto-updates si hay campos para actualizar
            if (Object.keys(autoUpdates).length > 0) {
              return { ...set, ...autoUpdates };
            }
          }

          return set;
        });

        return { ...ex, sets: updatedSets };
      }
      return ex;
    });

    onUpdateBlock(block.id, { exercises: updatedExercises });
  };

  const updateExerciseRepsType = (
    exerciseId: string,
    newRepsType: IRepsType,
  ) => {
    const updatedExercises = block.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const updatedSets = ex.sets.map((set) => {
          const updatedSet: ISet = { ...set, repsType: newRepsType };

          // Convertir datos según el nuevo tipo
          if (newRepsType === 'range') {
            // Si cambia a rango, convertir reps actual a rango si existe
            if (set.reps && set.reps !== '') {
              updatedSet.repsRange = { min: set.reps, max: set.reps };
            } else {
              updatedSet.repsRange = { min: '', max: '' };
            }
            // Limpiar el campo reps
            updatedSet.reps = '';
          } else {
            // Si cambia de rango a otro tipo, usar el min como reps
            if (set.repsRange && set.repsRange.min !== '') {
              updatedSet.reps = set.repsRange.min;
            } else {
              updatedSet.reps = '';
            }
            // Limpiar el campo repsRange
            updatedSet.repsRange = undefined;
          }

          return updatedSet;
        });

        return { ...ex, sets: updatedSets };
      }
      return ex;
    });

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
    formatRepsValue,
    addSetToExercise,
    updateSet,
    updateExerciseRepsType,
    handleDeleteBlock,
    handleConvertToIndividual,
    handleLongPress,
    handleLongPressExercise,
  };
};
