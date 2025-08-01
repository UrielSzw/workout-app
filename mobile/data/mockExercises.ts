// Mock data for exercises
export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  instructions: string[];
  imageUrl?: string;
}

export const exerciseCategories = [
  { id: "chest", name: "Pecho", icon: "💪" },
  { id: "back", name: "Espalda", icon: "🔙" },
  { id: "shoulders", name: "Hombros", icon: "🤝" },
  { id: "arms", name: "Brazos", icon: "💪" },
  { id: "legs", name: "Piernas", icon: "🦵" },
  { id: "core", name: "Core", icon: "🎯" },
  { id: "cardio", name: "Cardio", icon: "❤️" },
  { id: "functional", name: "Funcional", icon: "⚡" },
];

export const mockExercises: Exercise[] = [
  // Pecho
  {
    id: "1",
    name: "Press de Banca",
    category: "chest",
    muscleGroups: ["Pectorales", "Tríceps", "Deltoides anterior"],
    equipment: "Barra",
    difficulty: "intermediate",
    instructions: [
      "Acuéstate en el banco con los pies firmes en el suelo",
      "Agarra la barra con un agarre ligeramente más ancho que los hombros",
      "Baja la barra hasta el pecho de forma controlada",
      "Empuja la barra hacia arriba hasta extender completamente los brazos",
    ],
  },
  {
    id: "2",
    name: "Flexiones de Pecho",
    category: "chest",
    muscleGroups: ["Pectorales", "Tríceps", "Core"],
    equipment: "Peso corporal",
    difficulty: "beginner",
    instructions: [
      "Colócate en posición de plancha con las manos a la altura de los hombros",
      "Mantén el cuerpo recto desde la cabeza hasta los talones",
      "Baja el pecho hacia el suelo doblando los codos",
      "Empuja hacia arriba hasta la posición inicial",
    ],
  },
  {
    id: "3",
    name: "Press Inclinado con Mancuernas",
    category: "chest",
    muscleGroups: ["Pectorales superior", "Deltoides anterior"],
    equipment: "Mancuernas",
    difficulty: "intermediate",
    instructions: [
      "Ajusta el banco a 30-45 grados de inclinación",
      "Sostén las mancuernas con un agarre neutral",
      "Baja las mancuernas hasta sentir el estiramiento en el pecho",
      "Empuja hacia arriba contrayendo los pectorales",
    ],
  },

  // Espalda
  {
    id: "4",
    name: "Dominadas",
    category: "back",
    muscleGroups: ["Dorsal ancho", "Romboides", "Bíceps"],
    equipment: "Barra de dominadas",
    difficulty: "advanced",
    instructions: [
      "Cuelga de la barra con un agarre pronado más ancho que los hombros",
      "Inicia el movimiento tirando de los codos hacia abajo",
      "Eleva el cuerpo hasta que la barbilla supere la barra",
      "Baja de forma controlada hasta la posición inicial",
    ],
  },
  {
    id: "5",
    name: "Remo con Barra",
    category: "back",
    muscleGroups: ["Dorsal ancho", "Romboides", "Trapecio medio"],
    equipment: "Barra",
    difficulty: "intermediate",
    instructions: [
      "Sostén la barra con un agarre pronado",
      "Inclínate hacia adelante manteniendo la espalda recta",
      "Tira de la barra hacia el abdomen",
      "Baja la barra de forma controlada",
    ],
  },
  {
    id: "6",
    name: "Remo con Mancuerna a Una Mano",
    category: "back",
    muscleGroups: ["Dorsal ancho", "Romboides"],
    equipment: "Mancuerna",
    difficulty: "beginner",
    instructions: [
      "Apoya una rodilla y mano en el banco",
      "Sostén la mancuerna con el brazo libre",
      "Tira de la mancuerna hacia la cadera",
      "Baja de forma controlada y repite",
    ],
  },

  // Hombros
  {
    id: "7",
    name: "Press Militar",
    category: "shoulders",
    muscleGroups: ["Deltoides anterior", "Deltoides medio", "Tríceps"],
    equipment: "Barra",
    difficulty: "intermediate",
    instructions: [
      "Sostén la barra a la altura de los hombros",
      "Mantén los pies a la anchura de los hombros",
      "Empuja la barra hacia arriba hasta extender los brazos",
      "Baja de forma controlada hasta la posición inicial",
    ],
  },
  {
    id: "8",
    name: "Elevaciones Laterales",
    category: "shoulders",
    muscleGroups: ["Deltoides medio"],
    equipment: "Mancuernas",
    difficulty: "beginner",
    instructions: [
      "Sostén las mancuernas a los lados del cuerpo",
      "Eleva los brazos hacia los lados hasta la altura de los hombros",
      "Pausa brevemente en la parte superior",
      "Baja de forma controlada",
    ],
  },

  // Brazos
  {
    id: "9",
    name: "Curl de Bíceps con Barra",
    category: "arms",
    muscleGroups: ["Bíceps braquial", "Braquial anterior"],
    equipment: "Barra",
    difficulty: "beginner",
    instructions: [
      "Sostén la barra con un agarre supino",
      "Mantén los codos pegados al cuerpo",
      "Flexiona los codos levantando la barra",
      "Baja de forma controlada",
    ],
  },
  {
    id: "10",
    name: "Extensiones de Tríceps en Polea",
    category: "arms",
    muscleGroups: ["Tríceps braquial"],
    equipment: "Polea",
    difficulty: "beginner",
    instructions: [
      "Agarra la cuerda o barra de la polea alta",
      "Mantén los codos pegados al cuerpo",
      "Extiende los brazos hacia abajo",
      "Regresa de forma controlada",
    ],
  },

  // Piernas
  {
    id: "11",
    name: "Sentadillas",
    category: "legs",
    muscleGroups: ["Cuádriceps", "Glúteos", "Isquiotibiales"],
    equipment: "Peso corporal",
    difficulty: "beginner",
    instructions: [
      "Coloca los pies a la anchura de los hombros",
      "Baja como si te fueras a sentar en una silla",
      "Mantén el pecho erguido y las rodillas alineadas",
      "Empuja con los talones para subir",
    ],
  },
  {
    id: "12",
    name: "Peso Muerto",
    category: "legs",
    muscleGroups: ["Isquiotibiales", "Glúteos", "Erector espinal"],
    equipment: "Barra",
    difficulty: "advanced",
    instructions: [
      "Coloca la barra cerca de las espinillas",
      "Agarra la barra con las manos a la anchura de los hombros",
      "Levanta la barra manteniendo la espalda recta",
      "Extiende las caderas y rodillas simultáneamente",
    ],
  },
  {
    id: "13",
    name: "Zancadas",
    category: "legs",
    muscleGroups: ["Cuádriceps", "Glúteos"],
    equipment: "Peso corporal",
    difficulty: "beginner",
    instructions: [
      "Da un paso grande hacia adelante",
      "Baja hasta que ambas rodillas estén en 90 grados",
      "Empuja con el pie delantero para volver",
      "Alterna las piernas",
    ],
  },

  // Core
  {
    id: "14",
    name: "Plancha",
    category: "core",
    muscleGroups: ["Recto abdominal", "Transverso del abdomen"],
    equipment: "Peso corporal",
    difficulty: "beginner",
    instructions: [
      "Colócate en posición de flexión sobre los antebrazos",
      "Mantén el cuerpo recto desde la cabeza hasta los talones",
      "Contrae el core manteniendo la respiración normal",
      "Mantén la posición durante el tiempo indicado",
    ],
  },
  {
    id: "15",
    name: "Abdominales",
    category: "core",
    muscleGroups: ["Recto abdominal"],
    equipment: "Peso corporal",
    difficulty: "beginner",
    instructions: [
      "Acuéstate boca arriba con las rodillas dobladas",
      "Coloca las manos detrás de la cabeza",
      "Eleva el torso contrayendo los abdominales",
      "Baja de forma controlada",
    ],
  },

  // Cardio
  {
    id: "16",
    name: "Burpees",
    category: "cardio",
    muscleGroups: ["Cuerpo completo"],
    equipment: "Peso corporal",
    difficulty: "intermediate",
    instructions: [
      "Comienza de pie con los pies a la anchura de los hombros",
      "Baja a posición de cuclillas y coloca las manos en el suelo",
      "Salta hacia atrás a posición de plancha",
      "Haz una flexión, salta hacia adelante y salta hacia arriba",
    ],
  },
  {
    id: "17",
    name: "Mountain Climbers",
    category: "cardio",
    muscleGroups: ["Core", "Hombros", "Piernas"],
    equipment: "Peso corporal",
    difficulty: "intermediate",
    instructions: [
      "Comienza en posición de plancha",
      "Lleva una rodilla hacia el pecho",
      "Regresa a la posición inicial",
      "Alterna rápidamente las piernas",
    ],
  },

  // Funcional
  {
    id: "18",
    name: "Thrusters",
    category: "functional",
    muscleGroups: ["Piernas", "Hombros", "Core"],
    equipment: "Mancuernas",
    difficulty: "intermediate",
    instructions: [
      "Sostén las mancuernas a la altura de los hombros",
      "Haz una sentadilla completa",
      "Al subir, empuja las mancuernas sobre la cabeza",
      "Baja las mancuernas mientras haces la siguiente sentadilla",
    ],
  },
  {
    id: "19",
    name: "Swing con Kettlebell",
    category: "functional",
    muscleGroups: ["Glúteos", "Isquiotibiales", "Core"],
    equipment: "Kettlebell",
    difficulty: "intermediate",
    instructions: [
      "Sostén la kettlebell con ambas manos",
      "Inclínate hacia adelante desde las caderas",
      "Empuja las caderas hacia adelante para balancear la kettlebell",
      "Controla el descenso con los glúteos e isquiotibiales",
    ],
  },
  {
    id: "20",
    name: "Turkish Get-Up",
    category: "functional",
    muscleGroups: ["Cuerpo completo"],
    equipment: "Kettlebell",
    difficulty: "advanced",
    instructions: [
      "Acuéstate con la kettlebell extendida sobre un brazo",
      "Levántate paso a paso manteniendo el brazo extendido",
      "Llega a la posición de pie",
      "Regresa paso a paso a la posición inicial",
    ],
  },
];

export const getExercisesByCategory = (categoryId: string): Exercise[] => {
  return mockExercises.filter((exercise) => exercise.category === categoryId);
};

export const getAllExercises = (): Exercise[] => {
  return mockExercises;
};
