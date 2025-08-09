import { Typography } from '@/components/ui';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IBlock } from '@/types/routine';
import { View } from 'react-native';

type Props = {
  block: IBlock;
  exerciseIndex: number;
  blockColors: {
    primary: string;
    light: string;
    border: string;
  };
};

export const BlockLine: React.FC<Props> = ({
  block,
  exerciseIndex,
  blockColors,
}) => {
  const { colors } = useColorScheme();

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor:
            block.exercises.length > 1 ? blockColors.primary : colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          borderWidth: block.exercises.length > 1 ? 2 : 0,
          borderColor: colors.background,
        }}
      >
        <Typography
          variant="caption"
          weight="bold"
          style={{
            color: block.exercises.length > 1 ? 'white' : colors.text,
          }}
        >
          {exerciseIndex + 1}
        </Typography>
      </View>
    </View>
  );
};
