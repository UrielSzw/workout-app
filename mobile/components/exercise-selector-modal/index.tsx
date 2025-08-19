import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { X, Search } from 'lucide-react-native';
import { Typography, Button } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IExercise, IExerciseMuscle } from '@/types/routine';
import { useExercises } from '@/hooks/useExercises';
import { FlashList } from '@shopify/flash-list';
import { ExerciseCard } from './exercise-card';
import { EXERCISE_CATEGORIES } from '@/data/exercises';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: IExercise) => void;
  selectedExercises: IExercise[];
  onAddAsIndividual: () => void;
  onAddAsBlock: () => void;
  onReplaceExercise: () => void;
  isReplaceMode?: boolean;
};

export const ExerciseSelectorModal: React.FC<Props> = ({
  visible,
  onClose,
  onSelectExercise,
  selectedExercises,
  onAddAsIndividual,
  onAddAsBlock,
  isReplaceMode,
  onReplaceExercise,
}) => {
  const { colors, isDarkMode } = useColorScheme();
  const { allExercises } = useExercises();

  const [selectedCategory, setSelectedCategory] =
    useState<IExerciseMuscle | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handlePressCategory = (category: IExerciseMuscle) => {
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  const filteredExercises = useMemo(() => {
    let exercisesToShow = allExercises;

    if (selectedCategory) {
      exercisesToShow = exercisesToShow.filter((exercise) =>
        exercise.muscleGroups.includes(selectedCategory),
      );
    }

    if (searchQuery) {
      exercisesToShow = exercisesToShow.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return exercisesToShow;
  }, [allExercises, selectedCategory, searchQuery]);

  const isExerciseSelected = useCallback(
    (exerciseId: string) => {
      return selectedExercises.some((ex) => ex.id === exerciseId);
    },
    [selectedExercises],
  );

  const renderExerciseCard = useCallback(
    ({ item }: { item: IExercise }) => (
      <ExerciseCard
        exercise={item}
        isSelected={isExerciseSelected(item.id)}
        onSelectExercise={onSelectExercise}
        colors={colors}
        isReplaceMode={isReplaceMode}
      />
    ),
    [isExerciseSelected, onSelectExercise, colors, isReplaceMode],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <View style={{ flex: 1 }}>
            <Typography variant="h5" weight="semibold">
              {isReplaceMode
                ? 'Reemplazar Ejercicio'
                : 'Seleccionar Ejercicios'}
            </Typography>
            {isReplaceMode ? (
              <Typography variant="body2" color="textMuted">
                {selectedExercises.length > 0
                  ? `Reemplazando ${selectedExercises.length} ejercicio`
                  : 'Selecciona un ejercicio para reemplazar'}
              </Typography>
            ) : (
              <Typography variant="body2" color="textMuted">
                {selectedExercises.length} ejercicios seleccionados
              </Typography>
            )}
          </View>

          <Button
            variant="ghost"
            size="sm"
            onPress={onClose}
            icon={<X size={20} color={colors.text} />}
          />
        </View>

        {/* Search Bar */}
        <View style={{ padding: 20, paddingBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDarkMode ? colors.gray[800] : colors.gray[100],
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Search size={20} color={colors.textMuted} />
            <TextInput
              placeholder="Buscar ejercicios..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textMuted}
              style={{
                marginLeft: 12,
                flex: 1,
                color: colors.text,
                fontSize: 16,
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Categories */}
        <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
          <FlatList
            horizontal
            data={EXERCISE_CATEGORIES}
            keyExtractor={(item) => item}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item: category }) => (
              <TouchableOpacity
                onPress={() => handlePressCategory(category)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor:
                    selectedCategory === category
                      ? colors.primary[500]
                      : isDarkMode
                        ? colors.gray[800]
                        : colors.gray[100],
                }}
              >
                <Typography
                  variant="body2"
                  weight="medium"
                  color={selectedCategory === category ? 'white' : 'text'}
                >
                  {category}
                </Typography>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Exercises List */}
        <FlashList
          data={filteredExercises}
          key={filteredExercises.length}
          keyExtractor={(item) => item.id}
          renderItem={renderExerciseCard}
          contentContainerStyle={{ paddingBottom: 40 }}
          style={{ flex: 1, paddingHorizontal: 20 }}
        />

        {/* Footer */}
        <View
          style={{
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
          }}
        >
          {!isReplaceMode && selectedExercises.length > 0 && (
            <View style={{ gap: 12 }}>
              {selectedExercises.length > 1 && (
                <Button variant="primary" fullWidth onPress={onAddAsBlock}>
                  Agregar {selectedExercises.length} ejercicios en bloque
                </Button>
              )}
              <Button variant="outline" fullWidth onPress={onAddAsIndividual}>
                Agregar {selectedExercises.length} ejercicio
                {selectedExercises.length > 1 ? 's' : ''} individual
                {selectedExercises.length > 1 ? 'es' : ''}
              </Button>
            </View>
          )}

          {isReplaceMode && selectedExercises.length > 0 && (
            <Button variant="primary" fullWidth onPress={onReplaceExercise}>
              Remplazar ejercicio
            </Button>
          )}
        </View>
      </View>
    </Modal>
  );
};
