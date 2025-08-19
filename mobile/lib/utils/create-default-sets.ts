import { ISet } from '@/types/routine';

export const createDefaultSets = (): ISet[] => [
  {
    id: `set_${Date.now()}_1`,
    setNumber: 1,
    weight: '',
    reps: '',
    type: 'normal',
    completed: false,
    repsType: 'reps',
  },
  {
    id: `set_${Date.now()}_2`,
    setNumber: 2,
    weight: '',
    reps: '',
    type: 'normal',
    completed: false,
    repsType: 'reps',
  },
  {
    id: `set_${Date.now()}_3`,
    setNumber: 3,
    weight: '',
    reps: '',
    type: 'normal',
    completed: false,
    repsType: 'reps',
  },
];
