# FitBlocks - Especificación Técnica de la App

## 🎯 **Concepto General**

App de tracking de gimnasio con sistema revolucionario de **"Bloques Inteligentes"** que permite manejar circuitos, superseries y entrenamientos complejos de manera intuitiva.

---

## 📱 **Arquitectura de Pantallas**

### **1. Auth Stack**

- `LoginScreen` - Login con Google/Apple + email
- `OnboardingScreen` - Intro + selección de nivel de experiencia

### **2. Main Tab Navigator**

- **Home Tab** - Dashboard principal
- **Workouts Tab** - Lista de rutinas
- **History Tab** - Historial de entrenamientos
- **Profile Tab** - Configuración del usuario

### **3. Core Screens**

#### **HomeScreen**

```
┌─────────────────────────────┐
│ 👋 Hola Uriel              │
│                             │
│ 🎯 Próximo Entrenamiento    │
│ ┌─────────────────────────┐ │
│ │ 💪 Push Day             │ │
│ │ 5 ejercicios • 45min    │ │
│ │ [Empezar Entrenamiento] │ │
│ └─────────────────────────┘ │
│                             │
│ 📊 Esta Semana             │
│ • 3 entrenamientos         │
│ • 12,450kg volumen total   │
│                             │
│ 🏆 Logros Recientes        │
│ • Nuevo PR: Press Banca    │
│ • 7 días consecutivos      │
└─────────────────────────────┘
```

#### **WorkoutsScreen**

```
┌─────────────────────────────┐
│ Mis Rutinas            [+]  │
│                             │
│ 📋 Push/Pull/Legs          │
│ │   6 rutinas             │ │
│                             │
│ 🏋️ Upper/Lower             │
│ │   4 rutinas             │ │
│                             │
│ 💪 Full Body               │
│ │   3 rutinas             │ │
│                             │
│ [+ Crear Nueva Rutina]      │
│                             │
│ 📚 Templates Populares      │
│ • Starting Strength        │
│ • 5/3/1 Beginner          │
│ • Reddit PPL              │
└─────────────────────────────┘
```

#### **ActiveWorkoutScreen** (Pantalla más importante)

```
┌─────────────────────────────┐
│ ← Push Day      ⏱️ 23:45   │
│                             │
│ 🔥 SUPERSERIE - Ronda 2/3   │
│ ┌─────────────────────────┐ │
│ │ ✅ A1. Press Banca      │ │
│ │    Set 2: 80kg x 8 ✓    │ │
│ │                         │ │
│ │ ▶️  A2. Remo con Barra   │ │
│ │    Set 2: [70kg] [__]   │ │
│ │    [Completar Set]      │ │
│ │                         │ │
│ │ ⏱️ Próximo: Descanso 90s │ │
│ └─────────────────────────┘ │
│                             │
│ Progreso: [██░░░] 2/5       │
│                             │
│ [Finalizar Entrenamiento]   │
└─────────────────────────────┘
```

#### **WorkoutBuilderScreen**

```
┌─────────────────────────────┐
│ ← Nueva Rutina              │
│                             │
│ 📝 Nombre: "Mi Push Day"    │
│                             │
│ 🧱 BLOQUES CREADOS:         │
│ ┌─────────────────────────┐ │
│ │ BLOQUE 1: Superserie    │ │
│ │ • Press Banca 3x8       │ │
│ │ • Remo 3x8              │ │
│ │ Descanso: 90seg         │ │
│ └─────────────────────────┘ │
│                             │
│ [+ Agregar Bloque]          │
│                             │
│ 💪 EJERCICIOS DISPONIBLES:  │
│ 🔍 [Buscar ejercicios...]   │
│ • Press Banca              │
│ • Press Inclinado          │
│ • Remo con Barra           │
│ • Dominadas                │
└─────────────────────────────┘
```

#### **BlockConfigScreen**

```
┌─────────────────────────────┐
│ ← Configurar Bloque         │
│                             │
│ 🏷️ Tipo de Bloque:          │
│ ○ Individual               │
│ ● Superserie               │
│ ○ Circuito                 │
│ ○ Drop Set                 │
│                             │
│ 💪 Ejercicios en el Bloque: │
│ 1. Press Banca             │
│    Sets: [3] Reps: [8-10]  │
│                             │
│ 2. Remo con Barra          │
│    Sets: [3] Reps: [8-10]  │
│                             │
│ ⏱️ Descanso entre bloques:   │
│ [90] segundos              │
│                             │
│ [Guardar Bloque]            │
└─────────────────────────────┘
```

#### **HistoryScreen**

```
┌─────────────────────────────┐
│ Historial de Entrenamientos │
│                             │
│ 🗓️ Esta Semana              │
│ ┌─────────────────────────┐ │
│ │ Lun 28/7 • Push Day     │ │
│ │ 45min • 8,420kg         │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Mié 30/7 • Pull Day     │ │
│ │ 52min • 9,180kg         │ │
│ └─────────────────────────┘ │
│                             │
│ 📊 Ver Estadísticas         │
│                             │
│ 🗓️ Semana Pasada            │
│ • 4 entrenamientos         │
│ • 31,240kg volumen total   │
└─────────────────────────────┘
```

---

## 🧱 **Sistema de Bloques - Explicación Detallada**

### **Concepto Core**

Un **Bloque** es una unidad lógica de entrenamiento que agrupa ejercicios con una estructura específica de ejecución.

### **Tipos de Bloques**

#### **1. Bloque Individual**

```javascript
{
  type: 'individual',
  exercises: [
    { id: 'press_banca', sets: 3, reps: '8-10', restTime: 90 }
  ],
  logic: 'Set → Rest → Set → Rest → Set'
}
```

#### **2. Bloque Superserie**

```javascript
{
  type: 'superset',
  exercises: [
    { id: 'press_banca', sets: 3, reps: '8-10' },
    { id: 'remo_barra', sets: 3, reps: '8-10' }
  ],
  restTime: 90,
  logic: 'A1 → A2 → Rest → A1 → A2 → Rest → A1 → A2'
}
```

#### **3. Bloque Circuito**

```javascript
{
  type: 'circuit',
  exercises: [
    { id: 'sentadillas', sets: 4, reps: 12 },
    { id: 'push_ups', sets: 4, reps: 15 },
    { id: 'plancha', sets: 4, duration: 30 }
  ],
  restBetweenExercises: 0,
  restBetweenRounds: 120,
  logic: 'A1 → A2 → A3 → Rest 2min → Repeat'
}
```

#### **4. Bloque Drop Set**

```javascript
{
  type: 'dropset',
  exercises: [
    {
      id: 'curl_biceps',
      drops: [
        { weight: 20, reps: 8 },
        { weight: 15, reps: 'max' },
        { weight: 10, reps: 'max' }
      ]
    }
  ],
  restTime: 60,
  logic: 'Set1 → immediate Drop1 → immediate Drop2 → Rest'
}
```

### **Lógica de Ejecución Durante Entrenamiento**

#### **Estado del Entrenamiento**

```javascript
{
  activeWorkout: {
    id: 'workout_123',
    currentBlockIndex: 0,
    currentExerciseIndex: 0,
    currentSetIndex: 0,
    blocks: [
      {
        type: 'superset',
        currentRound: 2,
        totalRounds: 3,
        exercises: [...]
      }
    ]
  }
}
```

#### **Timer Inteligente**

```javascript
// Para Superserie
if (blockType === "superset") {
  if (isLastExerciseInRound) {
    startTimer(block.restTime); // 90 segundos
  } else {
    moveToNextExercise(); // Sin timer
  }
}

// Para Circuito
if (blockType === "circuit") {
  if (isLastExerciseInRound) {
    startTimer(block.restBetweenRounds); // 2 minutos
  } else {
    startTimer(block.restBetweenExercises); // 0-15 segundos
  }
}
```

### **Interface Components**

#### **BlockCard Component**

```jsx
<BlockCard
  type="superset"
  currentRound={2}
  totalRounds={3}
  exercises={[
    { name: "Press Banca", current: true, completed: true },
    { name: "Remo", current: false, completed: false },
  ]}
  nextAction="Descanso 90s"
/>
```

#### **ExerciseInput Component**

```jsx
<ExerciseInput
  exercise="Press Banca"
  currentSet={2}
  previousWeight={75}
  previousReps={8}
  onComplete={(weight, reps) => completeSet(weight, reps)}
/>
```

---

## 🔄 **Estados y Navegación**

### **State Management (Redux/Zustand)**

```javascript
// Stores principales
- authStore: { user, isAuthenticated }
- workoutStore: { routines, activeWorkout, history }
- exerciseStore: { exercises, categories }
- timerStore: { isActive, timeRemaining, type }
```

### **Navigation Structure**

```
AuthStack
├── LoginScreen
└── OnboardingScreen

MainStack
├── TabNavigator
│   ├── HomeTab
│   ├── WorkoutsTab
│   ├── HistoryTab
│   └── ProfileTab
├── ActiveWorkoutScreen (Modal)
├── WorkoutBuilderStack
│   ├── WorkoutBuilderScreen
│   ├── BlockConfigScreen
│   └── ExercisePickerScreen
└── SettingsStack
```

---

## 🎨 **Componentes Reutilizables**

### **Core Components**

- `BlockCard` - Representa un bloque durante entrenamiento
- `ExerciseItem` - Item individual de ejercicio
- `TimerCircle` - Timer circular animado
- `ProgressBar` - Barra de progreso del entrenamiento
- `WeightInput` - Input optimizado para peso/reps
- `ExercisePicker` - Selector de ejercicios con búsqueda

### **Block-Specific Components**

- `SupersetView` - Vista para superseries
- `CircuitView` - Vista para circuitos
- `DropsetView` - Vista para drop sets
- `IndividualView` - Vista para ejercicios individuales

---

## 🚀 **Features Principales del MVP**

### **Funcionalidades Core**

✅ **Crear rutinas con sistema de bloques**
✅ **Ejecutar entrenamientos con timer inteligente**
✅ **Guardar y ver historial**
✅ **Templates de rutinas populares**
✅ **Base de datos de 100+ ejercicios**
✅ **Sync automático en la nube**

### **Diferenciadores Clave**

🎯 **Rutinas ilimitadas gratis**
🎯 **Superseries y circuitos intuitivos**
🎯 **Timer que entiende el contexto**
🎯 **Interface optimizada para el gym**

---

**¿Te parece clara esta especificación? ¿Necesitás que detalle más alguna parte específica?**
