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
  const [isExpanded, setIsExpanded] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  // Block styles

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
    addSetToExercise,
    updateSet,
    updateExerciseRepsType,
    handleDeleteBlock,
    handleConvertToIndividual,
    handleLongPress,
    handleLongPressExercise,
  };
};
