import React from 'react';
import { View } from 'react-native';
import { IActiveBlock } from '@/types/active-workout';
import { IRepsType, ISetType } from '@/types/routine';
import { ActiveBlockCard } from './active-block-card';

type Props = {
  blocks: IActiveBlock[];
  onCompleteSet: (
    exerciseId: string,
    setId: string,
    completionData: {
      actualWeight?: string;
      actualReps?: string;
      actualRpe?: number;
    },
  ) => void;
  onUncompleteSet: (exerciseId: string, setId: string) => void;
  onUpdateSetValue: (
    exerciseId: string,
    setId: string,
    field: string,
    value: string,
  ) => void;
  onShowRepsTypeSheet: (
    exerciseId: string,
    setId: string,
    current: IRepsType,
  ) => void;
  onShowSetTypeSheet: (
    exerciseId: string,
    setId: string,
    current: ISetType,
  ) => void;
  onAddSet: (exerciseId: string) => void;
};

export const BlockList: React.FC<Props> = ({
  blocks,
  onCompleteSet,
  onUncompleteSet,
  onUpdateSetValue,
  onShowRepsTypeSheet,
  onShowSetTypeSheet,
  onAddSet,
}) => {
  return (
    <View style={{ padding: 16, gap: 16 }}>
      {blocks.map((block, index) => (
        <ActiveBlockCard
          key={block.id}
          block={block}
          blockIndex={index}
          onCompleteSet={onCompleteSet}
          onUncompleteSet={onUncompleteSet}
          onUpdateSetValue={onUpdateSetValue}
          onShowRepsTypeSheet={onShowRepsTypeSheet}
          onShowSetTypeSheet={onShowSetTypeSheet}
          onAddSet={onAddSet}
        />
      ))}
    </View>
  );
};
