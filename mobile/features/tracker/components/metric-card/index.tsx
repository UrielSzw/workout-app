import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MetricDefinition } from '../../hooks/useTrackerStore';
import { useMetricValue } from '../../hooks/useTrackerHooks';
import * as Icons from 'lucide-react-native';

type Props = {
  metric: MetricDefinition;
  date: string;
  onPress: () => void;
};

export const MetricCard: React.FC<Props> = ({ metric, date, onPress }) => {
  const { colors } = useColorScheme();
  const currentValue = useMetricValue(metric.id, date);

  // Dynamic icon rendering
  const IconComponent = (Icons as any)[metric.icon];

  const formatValue = (value: number): string => {
    // Round to 2 decimal places and remove unnecessary trailing zeros
    const rounded = Math.round(value * 100) / 100;
    return rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(2);
  };

  const getProgressPercentage = () => {
    if (!metric.dailyGoal) return null;
    return Math.min((currentValue / metric.dailyGoal) * 100, 100);
  };

  const progressPercentage = getProgressPercentage();
  const isCompleted = progressPercentage === 100;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '48%', // 2 columns with gap
        aspectRatio: 1, // Square cards
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: isCompleted ? 2 : 1,
        borderColor: isCompleted ? colors.secondary[300] : colors.border,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        position: 'relative',
      }}
      activeOpacity={0.7}
    >
      {/* Achievement Badge */}
      {isCompleted && (
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 24,
            height: 24,
            backgroundColor: colors.secondary[300],
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <Icons.PartyPopper size={16} color={colors.text} />
        </View>
      )}

      {/* Metric Label */}
      <Typography
        variant="caption"
        weight="medium"
        color="textMuted"
        style={{ marginBottom: 8 }}
        numberOfLines={1}
      >
        {metric.label}
      </Typography>

      {/* Icon and Progress Ring */}
      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: metric.color + '20',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Background ring */}
          {progressPercentage !== null && (
            <View
              style={{
                position: 'absolute',
                width: 52,
                height: 52,
                borderRadius: 26,
                borderWidth: 3,
                borderColor: colors.gray[200],
                top: -2,
                left: -2,
              }}
            />
          )}

          {/* Progress ring */}
          {progressPercentage !== null && progressPercentage > 0 && (
            <View
              style={{
                position: 'absolute',
                width: 52,
                height: 52,
                borderRadius: 26,
                borderWidth: 3,
                borderColor: 'transparent',
                top: -2,
                left: -2,
                transform: [{ rotate: '-90deg' }],
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: 26,
                  borderWidth: 3,
                  borderColor: 'transparent',
                  borderTopColor: metric.color,
                  borderRightColor:
                    progressPercentage > 25 ? metric.color : 'transparent',
                  borderBottomColor:
                    progressPercentage > 50 ? metric.color : 'transparent',
                  borderLeftColor:
                    progressPercentage > 75 ? metric.color : 'transparent',
                }}
              />
              {/* Complete the circle at 100% */}
              {progressPercentage === 100 && (
                <View
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    borderRadius: 26,
                    borderWidth: 3,
                    borderColor: metric.color,
                  }}
                />
              )}
            </View>
          )}

          {IconComponent && <IconComponent size={24} color={metric.color} />}
        </View>
      </View>

      {/* Value and Unit */}
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
          <Typography
            variant="h4"
            weight="bold"
            style={{ color: metric.color }}
          >
            {formatValue(currentValue)}
          </Typography>
          <Typography variant="body2" color="textMuted">
            {metric.unit}
          </Typography>
        </View>

        {/* Goal info - only show if not completed and has goal */}
        {metric.dailyGoal && !isCompleted && (
          <Typography
            variant="caption"
            color="textMuted"
            style={{ marginTop: 4 }}
          >
            / {formatValue(metric.dailyGoal)}
          </Typography>
        )}
      </View>
    </TouchableOpacity>
  );
};
