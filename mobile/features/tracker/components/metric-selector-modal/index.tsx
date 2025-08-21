import React from 'react';
import { Modal, View, TouchableOpacity, ScrollView } from 'react-native';
import { X, Plus } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';

import { Typography, Button } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTrackerStore } from '../../hooks/useTrackerStore';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const MetricSelectorModal: React.FC<Props> = ({ visible, onClose }) => {
  const { colors } = useColorScheme();
  const { availableMetrics, activeMetrics, toggleMetricActive } =
    useTrackerStore();

  const inactiveMetrics = availableMetrics.filter(
    (metric) => !activeMetrics.includes(metric.id),
  );

  const handleToggleMetric = (metricId: string) => {
    toggleMetricActive(metricId);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
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
          <Typography variant="h6" weight="semibold">
            Agregar Métricas
          </Typography>
          <TouchableOpacity onPress={onClose} style={{ padding: 8 }}>
            <X size={24} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1, padding: 20 }}>
          {/* Available Metrics */}
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Métricas Disponibles
          </Typography>

          <View style={{ gap: 12 }}>
            {inactiveMetrics.map((metric) => {
              const IconComponent = (Icons as any)[metric.icon];

              return (
                <TouchableOpacity
                  key={metric.id}
                  onPress={() => handleToggleMetric(metric.id)}
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: colors.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: metric.color + '20',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {IconComponent && (
                      <IconComponent size={20} color={metric.color} />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Typography
                      variant="body1"
                      weight="medium"
                      style={{ marginBottom: 2 }}
                    >
                      {metric.label}
                    </Typography>
                    <Typography variant="caption" color="textMuted">
                      {metric.dailyGoal
                        ? `Meta: ${metric.dailyGoal} ${metric.unit}`
                        : `Unidad: ${metric.unit}`}
                    </Typography>
                  </View>

                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: colors.border,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Plus size={16} color={colors.textMuted} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {inactiveMetrics.length === 0 && (
            <View
              style={{
                alignItems: 'center',
                paddingVertical: 40,
                backgroundColor: colors.gray[50],
                borderRadius: 12,
                marginTop: 16,
              }}
            >
              <Typography variant="body2" color="textMuted" align="center">
                Todas las métricas disponibles están activas
              </Typography>
            </View>
          )}

          {/* Create Custom Metric Button */}
          <View style={{ marginTop: 32, marginBottom: 32 }}>
            <Typography
              variant="h6"
              weight="semibold"
              style={{ marginBottom: 16 }}
            >
              Métrica Personalizada
            </Typography>

            <Button
              variant="outline"
              fullWidth
              onPress={() => {
                // TODO: Abrir creador de métrica personalizada
                console.log('Create custom metric');
              }}
              icon={<Plus size={20} color={colors.primary[500]} />}
            >
              Crear Métrica Personalizada
            </Button>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};
