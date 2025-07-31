import { Exercise, Routine, Folder } from "@/store/useAppStore";

// Mock Exercises Database
export const mockExercises: Exercise[] = [
  // Chest
  {
    id: "ex_001",
    name: "Press de Banca",
    category: "chest",
    muscleGroups: ["pectorals", "triceps", "front_delts"],
    equipment: "barbell",
    instructions:
      "Acostado en banco, baja la barra al pecho y presiona hacia arriba controladamente.",
  },
  {
    id: "ex_002",
    name: "Press Inclinado con Mancuernas",
    category: "chest",
    muscleGroups: ["upper_pectorals", "triceps", "front_delts"],
    equipment: "dumbbell",
    instructions:
      "En banco inclinado, presiona las mancuernas desde el pecho hacia arriba.",
  },
  {
    id: "ex_003",
    name: "Fondos en Paralelas",
    category: "chest",
    muscleGroups: ["lower_pectorals", "triceps"],
    equipment: "bodyweight",
    instructions:
      "Suspendido en paralelas, baja el cuerpo y empuja hacia arriba.",
  },
  {
    id: "ex_004",
    name: "Flexiones de Pecho",
    category: "chest",
    muscleGroups: ["pectorals", "triceps", "front_delts"],
    equipment: "bodyweight",
    instructions:
      "En posición de plancha, baja el pecho al suelo y empuja hacia arriba.",
  },

  // Back
  {
    id: "ex_005",
    name: "Remo con Barra",
    category: "back",
    muscleGroups: ["lats", "rhomboids", "rear_delts", "biceps"],
    equipment: "barbell",
    instructions:
      "Inclinado hacia adelante, tira la barra hacia el abdomen manteniendo la espalda recta.",
  },
  {
    id: "ex_006",
    name: "Dominadas",
    category: "back",
    muscleGroups: ["lats", "rhomboids", "biceps"],
    equipment: "bodyweight",
    instructions:
      "Colgado de una barra, tira el cuerpo hacia arriba hasta que el mentón pase la barra.",
  },
  {
    id: "ex_007",
    name: "Remo con Mancuerna",
    category: "back",
    muscleGroups: ["lats", "rhomboids", "rear_delts", "biceps"],
    equipment: "dumbbell",
    instructions: "Apoyado en banco, tira la mancuerna hacia la cadera.",
  },
  {
    id: "ex_008",
    name: "Jalones al Pecho",
    category: "back",
    muscleGroups: ["lats", "rhomboids", "biceps"],
    equipment: "machine",
    instructions: "Sentado en máquina, tira la barra hacia el pecho.",
  },

  // Legs
  {
    id: "ex_009",
    name: "Sentadillas",
    category: "legs",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    equipment: "barbell",
    instructions:
      "Con la barra en los hombros, baja hasta que los muslos estén paralelos al suelo.",
  },
  {
    id: "ex_010",
    name: "Peso Muerto",
    category: "legs",
    muscleGroups: ["hamstrings", "glutes", "erector_spinae"],
    equipment: "barbell",
    instructions:
      "Levanta la barra desde el suelo manteniendo la espalda recta.",
  },
  {
    id: "ex_011",
    name: "Prensa de Piernas",
    category: "legs",
    muscleGroups: ["quadriceps", "glutes"],
    equipment: "machine",
    instructions: "En máquina de prensa, empuja el peso con las piernas.",
  },
  {
    id: "ex_012",
    name: "Zancadas",
    category: "legs",
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    equipment: "dumbbell",
    instructions:
      "Da un paso hacia adelante y baja hasta que ambas rodillas estén a 90 grados.",
  },

  // Shoulders
  {
    id: "ex_013",
    name: "Press Militar",
    category: "shoulders",
    muscleGroups: ["front_delts", "side_delts", "triceps"],
    equipment: "barbell",
    instructions: "De pie, presiona la barra desde los hombros hacia arriba.",
  },
  {
    id: "ex_014",
    name: "Elevaciones Laterales",
    category: "shoulders",
    muscleGroups: ["side_delts"],
    equipment: "dumbbell",
    instructions:
      "Con mancuernas a los lados, eleva los brazos hasta la altura de los hombros.",
  },
  {
    id: "ex_015",
    name: "Pájaros",
    category: "shoulders",
    muscleGroups: ["rear_delts"],
    equipment: "dumbbell",
    instructions: "Inclinado hacia adelante, abre los brazos hacia los lados.",
  },

  // Arms
  {
    id: "ex_016",
    name: "Curl de Bíceps",
    category: "arms",
    muscleGroups: ["biceps"],
    equipment: "dumbbell",
    instructions:
      "Con mancuernas, flexiona los codos llevando el peso hacia los hombros.",
  },
  {
    id: "ex_017",
    name: "Extensiones de Tríceps",
    category: "arms",
    muscleGroups: ["triceps"],
    equipment: "dumbbell",
    instructions: "Con mancuerna sobre la cabeza, extiende los brazos.",
  },
  {
    id: "ex_018",
    name: "Fondos en Banco",
    category: "arms",
    muscleGroups: ["triceps"],
    equipment: "bodyweight",
    instructions: "Apoyado en banco por detrás, baja y sube el cuerpo.",
  },

  // Core
  {
    id: "ex_019",
    name: "Plancha",
    category: "core",
    muscleGroups: ["abs", "core"],
    equipment: "bodyweight",
    instructions: "Mantén el cuerpo recto apoyado en antebrazos y pies.",
  },
  {
    id: "ex_020",
    name: "Abdominales",
    category: "core",
    muscleGroups: ["abs"],
    equipment: "bodyweight",
    instructions: "Acostado, lleva el torso hacia las rodillas.",
  },
];

// Mock Folders
export const mockFolders: Folder[] = [
  {
    id: "folder_001",
    name: "Push/Pull/Legs",
    color: "#0ea5e9",
    icon: "💪",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "folder_002",
    name: "Upper/Lower",
    color: "#f97316",
    icon: "🏋️",
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "folder_003",
    name: "Full Body",
    color: "#22c55e",
    icon: "🔥",
    createdAt: "2025-01-15T10:00:00Z",
  },
];

// Mock Routines
export const mockRoutines: Routine[] = [
  {
    id: "routine_001",
    name: "Push Day - Pecho y Hombros",
    description: "Entrenamiento de empuje enfocado en pecho, hombros y tríceps",
    folderId: "folder_001",
    estimatedDurationMinutes: 60,
    difficultyLevel: "intermediate",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z",
    blocks: [
      {
        id: "block_001",
        orderIndex: 1,
        type: "superset",
        restTimeSeconds: 90,
        exercises: [
          {
            id: "block_ex_001",
            exerciseId: "ex_001",
            orderIndex: 1,
            sets: 4,
            repsMin: 6,
            repsMax: 8,
            weightKg: 80,
            notes: "Peso pesado, controlar la bajada",
          },
          {
            id: "block_ex_002",
            exerciseId: "ex_005",
            orderIndex: 2,
            sets: 4,
            repsMin: 8,
            repsMax: 10,
            weightKg: 70,
            notes: "Mantener core apretado",
          },
        ],
      },
      {
        id: "block_002",
        orderIndex: 2,
        type: "circuit",
        restTimeSeconds: 120,
        restBetweenExercisesSeconds: 15,
        exercises: [
          {
            id: "block_ex_003",
            exerciseId: "ex_002",
            orderIndex: 1,
            sets: 3,
            repsMin: 10,
            repsMax: 12,
            weightKg: 25,
          },
          {
            id: "block_ex_004",
            exerciseId: "ex_014",
            orderIndex: 2,
            sets: 3,
            repsMin: 12,
            repsMax: 15,
            weightKg: 12,
          },
          {
            id: "block_ex_005",
            exerciseId: "ex_017",
            orderIndex: 3,
            sets: 3,
            repsMin: 10,
            repsMax: 12,
            weightKg: 15,
          },
        ],
      },
      {
        id: "block_003",
        orderIndex: 3,
        type: "individual",
        restTimeSeconds: 60,
        exercises: [
          {
            id: "block_ex_006",
            exerciseId: "ex_019",
            orderIndex: 1,
            sets: 3,
            durationSeconds: 45,
            notes: "Mantener línea recta del cuerpo",
          },
        ],
      },
    ],
  },
  {
    id: "routine_002",
    name: "Pull Day - Espalda y Bíceps",
    description: "Entrenamiento de tracción para espalda y bíceps",
    folderId: "folder_001",
    estimatedDurationMinutes: 55,
    difficultyLevel: "intermediate",
    createdAt: "2025-01-16T10:00:00Z",
    updatedAt: "2025-01-16T10:00:00Z",
    blocks: [
      {
        id: "block_004",
        orderIndex: 1,
        type: "individual",
        restTimeSeconds: 120,
        exercises: [
          {
            id: "block_ex_007",
            exerciseId: "ex_006",
            orderIndex: 1,
            sets: 4,
            repsMin: 5,
            repsMax: 8,
            notes: "Si no puedes hacer dominadas, usa asistencia",
          },
        ],
      },
      {
        id: "block_005",
        orderIndex: 2,
        type: "superset",
        restTimeSeconds: 90,
        exercises: [
          {
            id: "block_ex_008",
            exerciseId: "ex_008",
            orderIndex: 1,
            sets: 3,
            repsMin: 8,
            repsMax: 10,
            weightKg: 60,
          },
          {
            id: "block_ex_009",
            exerciseId: "ex_016",
            orderIndex: 2,
            sets: 3,
            repsMin: 10,
            repsMax: 12,
            weightKg: 15,
          },
        ],
      },
    ],
  },
  {
    id: "routine_003",
    name: "Leg Day - Piernas Completas",
    description: "Entrenamiento completo de piernas",
    folderId: "folder_001",
    estimatedDurationMinutes: 70,
    difficultyLevel: "advanced",
    createdAt: "2025-01-17T10:00:00Z",
    updatedAt: "2025-01-17T10:00:00Z",
    blocks: [
      {
        id: "block_006",
        orderIndex: 1,
        type: "individual",
        restTimeSeconds: 180,
        exercises: [
          {
            id: "block_ex_010",
            exerciseId: "ex_009",
            orderIndex: 1,
            sets: 5,
            repsMin: 5,
            repsMax: 6,
            weightKg: 100,
            notes: "Calentar bien antes. Peso máximo.",
          },
        ],
      },
      {
        id: "block_007",
        orderIndex: 2,
        type: "superset",
        restTimeSeconds: 90,
        exercises: [
          {
            id: "block_ex_011",
            exerciseId: "ex_011",
            orderIndex: 1,
            sets: 4,
            repsMin: 12,
            repsMax: 15,
            weightKg: 120,
          },
          {
            id: "block_ex_012",
            exerciseId: "ex_012",
            orderIndex: 2,
            sets: 4,
            repsMin: 10,
            repsMax: 12,
            weightKg: 20,
          },
        ],
      },
    ],
  },
  {
    id: "routine_004",
    name: "Upper Body Power",
    description: "Entrenamiento de fuerza para tren superior",
    folderId: "folder_002",
    estimatedDurationMinutes: 50,
    difficultyLevel: "intermediate",
    createdAt: "2025-01-18T10:00:00Z",
    updatedAt: "2025-01-18T10:00:00Z",
    blocks: [
      {
        id: "block_008",
        orderIndex: 1,
        type: "superset",
        restTimeSeconds: 120,
        exercises: [
          {
            id: "block_ex_013",
            exerciseId: "ex_001",
            orderIndex: 1,
            sets: 4,
            repsMin: 4,
            repsMax: 6,
            weightKg: 85,
          },
          {
            id: "block_ex_014",
            exerciseId: "ex_005",
            orderIndex: 2,
            sets: 4,
            repsMin: 6,
            repsMax: 8,
            weightKg: 75,
          },
        ],
      },
    ],
  },
  {
    id: "routine_005",
    name: "Full Body Beginner",
    description: "Rutina completa para principiantes",
    folderId: "folder_003",
    estimatedDurationMinutes: 45,
    difficultyLevel: "beginner",
    createdAt: "2025-01-19T10:00:00Z",
    updatedAt: "2025-01-19T10:00:00Z",
    blocks: [
      {
        id: "block_009",
        orderIndex: 1,
        type: "circuit",
        restTimeSeconds: 60,
        restBetweenExercisesSeconds: 10,
        exercises: [
          {
            id: "block_ex_015",
            exerciseId: "ex_004",
            orderIndex: 1,
            sets: 3,
            repsMin: 8,
            repsMax: 12,
          },
          {
            id: "block_ex_016",
            exerciseId: "ex_009",
            orderIndex: 2,
            sets: 3,
            repsMin: 10,
            repsMax: 15,
            weightKg: 40,
          },
          {
            id: "block_ex_017",
            exerciseId: "ex_019",
            orderIndex: 3,
            sets: 3,
            durationSeconds: 30,
          },
        ],
      },
    ],
  },
  {
    id: "routine_006",
    name: "HIIT Cardio Blast",
    description: "Entrenamiento de alta intensidad",
    estimatedDurationMinutes: 25,
    difficultyLevel: "intermediate",
    createdAt: "2025-01-20T10:00:00Z",
    updatedAt: "2025-01-20T10:00:00Z",
    blocks: [
      {
        id: "block_010",
        orderIndex: 1,
        type: "circuit",
        restTimeSeconds: 60,
        restBetweenExercisesSeconds: 0,
        exercises: [
          {
            id: "block_ex_018",
            exerciseId: "ex_004",
            orderIndex: 1,
            sets: 5,
            durationSeconds: 30,
            notes: "Máxima intensidad",
          },
          {
            id: "block_ex_019",
            exerciseId: "ex_009",
            orderIndex: 2,
            sets: 5,
            durationSeconds: 30,
            notes: "Solo peso corporal",
          },
        ],
      },
    ],
  },
];

// Mock API functions
export const mockApi = {
  getExercises: (): Promise<Exercise[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockExercises), 500);
    });
  },

  getRoutines: (): Promise<Routine[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockRoutines), 300);
    });
  },

  getFolders: (): Promise<Folder[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFolders), 200);
    });
  },

  createRoutine: (routine: Routine): Promise<Routine> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(routine), 500);
    });
  },

  updateRoutine: (id: string, updates: Partial<Routine>): Promise<Routine> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const routine = mockRoutines.find((r) => r.id === id);
        if (routine) {
          const updated = { ...routine, ...updates };
          resolve(updated);
        }
      }, 300);
    });
  },

  deleteRoutine: (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  },
};
