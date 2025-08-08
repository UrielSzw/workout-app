import { create } from 'zustand';
import { IBlock } from '@/types/routine';

type CreateRoutineStore = {
  blocks: IBlock[];
  setBlocks: (blocks: IBlock[]) => void;
  reorderedBlock: IBlock | null;
  setReorderedBlock: (block: IBlock | null) => void;
};

export const createRoutineStore = create<CreateRoutineStore>((set) => ({
  blocks: [],
  setBlocks: (blocks) => {
    set({ blocks });
  },
  reorderedBlock: null,
  setReorderedBlock: (block) => set({ reorderedBlock: block }),
}));
