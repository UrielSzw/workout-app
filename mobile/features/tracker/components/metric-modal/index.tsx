import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Plus, Trash2, Clock } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';

import { Typography, Button } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTrackerStore } from '../../hooks/useTrackerStore';

export const MetricModal: React.FC = () => {
  const { colors } = useColorScheme();
  const {
    metricModalVisible,
    selectedMetricId,
    hideMetricModal,
    selectedDate,
    availableMetrics,
    addMetricValue,
    logs,
    getDayEntries,
    removeEntry,
  } = useTrackerStore();

  const [inputValue, setInputValue] = useState('');
  const [quickActionCounts, setQuickActionCounts] = useState<{
    [index: number]: number;
  }>({});

  const selectedMetric = availableMetrics.find(
    (m) => m.id === selectedMetricId,
  );
  const currentValue = selectedMetricId
    ? (() => {
        const dayLog = logs.find((log) => log.date === selectedDate);
        return dayLog?.metrics[selectedMetricId] || 0;
      })()
    : 0;

  // Get today's entries for this metric
  const todaysEntries = selectedMetricId
    ? getDayEntries(selectedDate, selectedMetricId)
    : [];

  const handleRemoveEntry = (entryId: string) => {
    removeEntry(selectedDate, entryId);
  };

  const formatValue = (value: number): string => {
    // Round to 2 decimal places and remove unnecessary trailing zeros
    const rounded = Math.round(value * 100) / 100;
    return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    if (metricModalVisible && selectedMetric) {
      setInputValue('');
      setQuickActionCounts({});
    }
  }, [metricModalVisible, selectedMetric]);

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
    if (!selectedMetric || !selectedMetricId) return;

    Object.entries(quickActionCounts).forEach(([indexStr, count]) => {
      const actionIndex = parseInt(indexStr);
      const action = selectedMetric.quickActions?.[actionIndex];

      if (action && count > 0) {
        // Add each count as a separate entry
        for (let i = 0; i < count; i++) {
          addMetricValue(
            selectedDate,
            selectedMetricId,
            action.value,
            action.label,
          );
        }
      }
    });

    setQuickActionCounts({});
    hideMetricModal();
  };

  const getTotalQuickActionValue = () => {
    if (!selectedMetric) return 0;

    return Object.entries(quickActionCounts).reduce(
      (total, [indexStr, count]) => {
        const actionIndex = parseInt(indexStr);
        const action = selectedMetric.quickActions?.[actionIndex];
        return total + (action ? action.value * count : 0);
      },
      0,
    );
  };

  const hasQuickActionSelections = () => {
    return Object.values(quickActionCounts).some((count) => count > 0);
  };

  const handleAddValue = () => {
    const numValue = parseFloat(inputValue);
    if (!isNaN(numValue) && numValue > 0 && selectedMetricId) {
      addMetricValue(selectedDate, selectedMetricId, numValue, 'Manual');
      hideMetricModal();
    }
  };

  if (!selectedMetric) return null;

  const IconComponent = (Icons as any)[selectedMetric.icon];

  return (
    <Modal
      visible={metricModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={hideMetricModal}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: selectedMetric.color + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {IconComponent && (
                  <IconComponent size={20} color={selectedMetric.color} />
                )}
              </View>
              <View>
                <Typography variant="h6" weight="semibold">
                  {selectedMetric.label}
                </Typography>
                <Typography variant="caption" color="textMuted">
                  Actual: {formatValue(currentValue)} {selectedMetric.unit}
                </Typography>
              </View>
            </View>
            <TouchableOpacity onPress={hideMetricModal} style={{ padding: 8 }}>
              <X size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ flex: 1, padding: 20 }}
            contentContainerStyle={{
              paddingBottom: 120,
            }}
          >
            {/* Quick Actions */}
            {selectedMetric.quickActions &&
              selectedMetric.quickActions.length > 0 && (
                <View style={{ marginBottom: 32 }}>
                  <Typography
                    variant="h6"
                    weight="semibold"
                    style={{ marginBottom: 16 }}
                  >
                    Opciones Rápidas
                  </Typography>
                  <View style={{ flexDirection: 'column', gap: 8 }}>
                    {selectedMetric.quickActions.map((action, index) => {
                      const ActionIcon = action.icon
                        ? (Icons as any)[action.icon]
                        : null;
                      const count = quickActionCounts[index] || 0;

                      return (
                        <View
                          key={index}
                          style={{
                            backgroundColor:
                              count > 0
                                ? selectedMetric.color + '10'
                                : colors.surface,
                            borderRadius: 12,
                            padding: 16,
                            borderWidth: 1,
                            borderColor:
                              count > 0 ? selectedMetric.color : colors.border,
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
                                <ActionIcon
                                  size={20}
                                  color={selectedMetric.color}
                                />
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
                                  +{formatValue(action.value)}{' '}
                                  {selectedMetric.unit}
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
                                onPress={() =>
                                  handleQuickActionDecrement(index)
                                }
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 16,
                                  backgroundColor:
                                    count > 0
                                      ? colors.gray[400]
                                      : colors.gray[100],
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
                                    color:
                                      count > 0
                                        ? colors.text
                                        : colors.textMuted,
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
                                      count > 0
                                        ? selectedMetric.color
                                        : colors.textMuted,
                                  }}
                                >
                                  {count}
                                </Typography>
                              </View>

                              <TouchableOpacity
                                onPress={() =>
                                  handleQuickActionIncrement(index)
                                }
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
                        icon={<Plus size={20} color="#ffffff" />}
                      >
                        Agregar selección (+
                        {formatValue(getTotalQuickActionValue())}{' '}
                        {selectedMetric.unit})
                      </Button>
                    )}
                  </View>
                </View>
              )}

            {/* Manual Input */}
            <View style={{ marginBottom: 32 }}>
              <Typography
                variant="h6"
                weight="semibold"
                style={{ marginBottom: 16 }}
              >
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
                  onChangeText={setInputValue}
                  placeholder={`Cantidad en ${selectedMetric.unit}`}
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  returnKeyType="done"
                  onSubmitEditing={handleAddValue}
                />
                <Typography
                  variant="body2"
                  color="textMuted"
                  style={{ marginLeft: 8 }}
                >
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
                Agregar{' '}
                {inputValue ? formatValue(parseFloat(inputValue) || 0) : '0'}{' '}
                {selectedMetric.unit}
              </Button>
            </View>

            {/* Historial del Día */}
            {todaysEntries.length > 0 && (
              <View style={{ marginBottom: 32 }}>
                <Typography
                  variant="h6"
                  weight="semibold"
                  style={{ marginBottom: 16 }}
                >
                  Historial de Hoy
                </Typography>
                <View
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    overflow: 'hidden',
                  }}
                >
                  {todaysEntries.map((entry, index) => (
                    <View
                      key={entry.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 16,
                        borderBottomWidth:
                          index < todaysEntries.length - 1 ? 1 : 0,
                        borderBottomColor: colors.border,
                      }}
                    >
                      {/* Entry Info */}
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            marginBottom: 4,
                          }}
                        >
                          <Clock size={12} color={colors.textMuted} />
                          <Typography variant="caption" color="textMuted">
                            {formatTime(entry.timestamp)}
                          </Typography>
                        </View>
                        <Typography
                          variant="body2"
                          weight="medium"
                          style={{ marginBottom: 2 }}
                        >
                          +{formatValue(entry.value)} {selectedMetric.unit}
                        </Typography>
                        {entry.description && (
                          <Typography variant="caption" color="textMuted">
                            {entry.description}
                          </Typography>
                        )}
                      </View>

                      {/* Delete Button */}
                      <TouchableOpacity
                        onPress={() => handleRemoveEntry(entry.id)}
                        style={{
                          padding: 8,
                          borderRadius: 8,
                          backgroundColor: colors.error[50],
                        }}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={16} color={colors.error[500]} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Daily Summary */}
            {selectedMetric.dailyGoal && (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Typography
                  variant="h6"
                  weight="semibold"
                  style={{ marginBottom: 12 }}
                >
                  Progreso del Día
                </Typography>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <Typography variant="body2" color="textMuted">
                    Actual
                  </Typography>
                  <Typography variant="body2" weight="medium">
                    {formatValue(currentValue)} {selectedMetric.unit}
                  </Typography>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                  }}
                >
                  <Typography variant="body2" color="textMuted">
                    Meta
                  </Typography>
                  <Typography variant="body2" weight="medium">
                    {formatValue(selectedMetric.dailyGoal)}{' '}
                    {selectedMetric.unit}
                  </Typography>
                </View>

                {/* Progress Bar */}
                <View
                  style={{
                    height: 8,
                    backgroundColor: colors.gray[200],
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      height: '100%',
                      backgroundColor: selectedMetric.color,
                      width: `${Math.min((currentValue / selectedMetric.dailyGoal) * 100, 100)}%`,
                    }}
                  />
                </View>

                <Typography
                  variant="caption"
                  color="textMuted"
                  style={{ marginTop: 8, textAlign: 'center' }}
                >
                  {Math.round((currentValue / selectedMetric.dailyGoal) * 100)}%
                  completado
                </Typography>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
