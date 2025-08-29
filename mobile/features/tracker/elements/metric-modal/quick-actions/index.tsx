import { Button, Typography } from '@/components/ui';
import { useEntryActions } from '@/features/tracker/hooks/use-tracker-store';
import { PREDEFINED_QUICK_ACTIONS } from '@/features/tracker/mock';
import { IMetricDefinition } from '@/features/tracker/types';
import { formatValue } from '@/features/tracker/utils/helpers';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Icons from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

type Props = {
  selectedMetric: IMetricDefinition;
  selectedDate: string;
  onCloseModal: () => void;
  onClearInput: () => void;
};

export const QuickActions: React.FC<Props> = ({
  selectedMetric,
  onCloseModal,
  selectedDate,
  onClearInput,
}) => {
  const [quickActionCounts, setQuickActionCounts] = useState<{
    [index: number]: number;
  }>({});

  const { addEntry } = useEntryActions();
  const { colors } = useColorScheme();

  const quickActions = useMemo(() => {
    if (!selectedMetric || !selectedMetric.slug) return [];

    return PREDEFINED_QUICK_ACTIONS[selectedMetric.slug] || [];
  }, [selectedMetric]);

  const handleQuickActionIncrement = (actionIndex: number) => {
    setQuickActionCounts((prev) => ({
      ...prev,
      [actionIndex]: (prev[actionIndex] || 0) + 1,
    }));
  };

  const handleQuickActionDecrement = (actionIndex: number) => {
    setQuickActionCounts((prev) => ({
      ...prev,
      [actionIndex]: Math.max(0, (prev[actionIndex] || 0) - 1),
    }));
  };

  const handleConfirmQuickActions = () => {
    if (!selectedMetric || !selectedMetric) return;

    Object.entries(quickActionCounts).forEach(([indexStr, count]) => {
      const actionIndex = parseInt(indexStr);
      const action = quickActions?.[actionIndex];

      if (action && count > 0) {
        // Add each count as a separate entry
        for (let i = 0; i < count; i++) {
          addEntry(
            selectedMetric.id,
            action.value,
            action.unit,
            selectedDate,
            action.label,
          );
        }
      }
    });

    setQuickActionCounts({});
    onCloseModal();
  };

  const getTotalQuickActionValue = () => {
    if (!selectedMetric) return 0;

    return Object.entries(quickActionCounts).reduce(
      (total, [indexStr, count]) => {
        const actionIndex = parseInt(indexStr);
        const action = quickActions?.[actionIndex];
        return total + (action ? action.value * count : 0);
      },
      0,
    );
  };

  const hasQuickActionSelections = () => {
    return Object.values(quickActionCounts).some((count) => count > 0);
  };

  useEffect(() => {
    if (selectedMetric) {
      onClearInput();
      setQuickActionCounts({});
    }
  }, [selectedMetric]);

  return (
    <View style={{ marginBottom: 32 }}>
      <Typography variant="h6" weight="semibold" style={{ marginBottom: 16 }}>
        Opciones Rápidas
      </Typography>
      <View style={{ flexDirection: 'column', gap: 8 }}>
        {quickActions.map((action, index) => {
          const ActionIcon = action.icon ? (Icons as any)[action.icon] : null;
          const count = quickActionCounts[index] || 0;

          return (
            <View
              key={index}
              style={{
                backgroundColor:
                  count > 0 ? selectedMetric.color + '10' : colors.surface,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: count > 0 ? selectedMetric.color : colors.border,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* Action Info */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    flex: 1,
                  }}
                >
                  {ActionIcon && (
                    <ActionIcon size={20} color={selectedMetric.color} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      weight="medium"
                      style={{ marginBottom: 2 }}
                    >
                      {action.label}
                    </Typography>
                    <Typography variant="caption" color="textMuted">
                      +{formatValue(action.value)} {selectedMetric.unit}
                      {count > 0 &&
                        ` × ${count} = +${formatValue(action.value * count)} ${selectedMetric.unit}`}
                    </Typography>
                  </View>
                </View>

                {/* Counter Controls */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => handleQuickActionDecrement(index)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor:
                        count > 0 ? colors.gray[400] : colors.gray[100],
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    activeOpacity={0.7}
                    disabled={count === 0}
                  >
                    <Typography
                      variant="body2"
                      weight="bold"
                      style={{
                        color: count > 0 ? colors.text : colors.textMuted,
                        fontSize: 18,
                      }}
                    >
                      −
                    </Typography>
                  </TouchableOpacity>

                  <View
                    style={{
                      minWidth: 24,
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="body1"
                      weight="bold"
                      style={{
                        color:
                          count > 0 ? selectedMetric.color : colors.textMuted,
                      }}
                    >
                      {count}
                    </Typography>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleQuickActionIncrement(index)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: selectedMetric.color + '20',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    activeOpacity={0.7}
                  >
                    <Typography
                      variant="body2"
                      weight="bold"
                      style={{
                        color: selectedMetric.color,
                        fontSize: 18,
                      }}
                    >
                      +
                    </Typography>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}

        {/* Confirm Quick Actions Button */}
        {hasQuickActionSelections() && (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleConfirmQuickActions}
            style={{ marginTop: 8 }}
            icon={<Icons.Plus size={20} color="#ffffff" />}
          >
            Agregar selección (+
            {formatValue(getTotalQuickActionValue())} {selectedMetric.unit})
          </Button>
        )}
      </View>
    </View>
  );
};
