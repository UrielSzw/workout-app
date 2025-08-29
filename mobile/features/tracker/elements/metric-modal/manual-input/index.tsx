import { Button, Typography } from '@/components/ui';
import { useEntryActions } from '@/features/tracker/hooks/use-tracker-store';
import { IMetricDefinition } from '@/features/tracker/types';
import { formatValue } from '@/features/tracker/utils/helpers';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Plus } from 'lucide-react-native';
import React from 'react';
import { TextInput, View } from 'react-native';

type Props = {
  selectedMetric: IMetricDefinition;
  inputValue: string;
  selectedDate: string;
  onCloseModal: () => void;
  onChangeInput: (value: string) => void;
};

export const ManualInput: React.FC<Props> = ({
  selectedMetric,
  inputValue,
  selectedDate,
  onCloseModal,
  onChangeInput,
}) => {
  const { addEntry } = useEntryActions();
  const { colors } = useColorScheme();

  const handleAddValue = () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue > 0 && selectedMetric) {
      addEntry(
        selectedMetric.id,
        numValue,
        selectedMetric.unit,
        selectedDate,
        'Manual',
      );
      onCloseModal();
    }
  };

  return (
    <View style={{ marginBottom: 32 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        Cantidad Manual
      </Typography>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 16,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            paddingVertical: 16,
            fontSize: 18,
            fontWeight: '600',
            color: colors.text,
          }}
          value={inputValue}
          onChangeText={onChangeInput}
          placeholder={`Cantidad en ${selectedMetric.unit}`}
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={handleAddValue}
        />
        <Typography variant="body2" color="textMuted" style={{ marginLeft: 8 }}>
          {selectedMetric.unit}
        </Typography>
      </View>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onPress={handleAddValue}
        disabled={
          !inputValue ||
          isNaN(parseFloat(inputValue)) ||
          parseFloat(inputValue) <= 0
        }
        style={{ marginTop: 16 }}
        icon={<Plus size={20} color="#ffffff" />}
      >
        Agregar {inputValue ? formatValue(parseFloat(inputValue) || 0) : '0'}{' '}
        {selectedMetric.unit}
      </Button>
    </View>
  );
};
