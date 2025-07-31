# FitBlocks - Esquema de Base de Datos

## 📊 **Diseño de Tablas con Ejemplos Mock**

### **1. USERS**

```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  display_name VARCHAR,
  profile_image_url VARCHAR,
  experience_level VARCHAR DEFAULT 'beginner', -- beginner, intermediate, advanced
  preferred_units VARCHAR DEFAULT 'kg', -- kg, lbs
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Datos Mock:**

```json
[
  {
    "id": "user_001",
    "email": "uriel@email.com",
    "display_name": "Uriel",
    "profile_image_url": null,
    "experience_level": "intermediate",
    "preferred_units": "kg",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  },
  {
    "id": "user_002",
    "email": "maria@email.com",
    "display_name": "María",
    "profile_image_url": "https://avatar.url",
    "experience_level": "beginner",
    "preferred_units": "kg",
    "created_at": "2025-01-20T14:20:00Z",
    "updated_at": "2025-01-20T14:20:00Z"
  }
]
```

---

### **2. EXERCISES**

```sql
CREATE TABLE exercises (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL, -- chest, back, legs, shoulders, arms, core, cardio
  muscle_groups JSON, -- ["pectorals", "triceps"]
  equipment VARCHAR, -- barbell, dumbbell, machine, bodyweight
  instructions TEXT,
  is_custom BOOLEAN DEFAULT false,
  created_by_user_id VARCHAR REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Datos Mock:**

```json
[
  {
    "id": "exercise_001",
    "name": "Press de Banca",
    "category": "chest",
    "muscle_groups": ["pectorals", "triceps", "front_delts"],
    "equipment": "barbell",
    "instructions": "Acostado en banco, baja la barra al pecho y presiona hacia arriba",
    "is_custom": false,
    "created_by_user_id": null,
    "created_at": "2025-01-01T00:00:00Z"
  },
  {
    "id": "exercise_002",
    "name": "Remo con Barra",
    "category": "back",
    "muscle_groups": ["lats", "rhomboids", "rear_delts", "biceps"],
    "equipment": "barbell",
    "instructions": "Inclinado hacia adelante, tira la barra hacia el abdomen",
    "is_custom": false,
    "created_by_user_id": null,
    "created_at": "2025-01-01T00:00:00Z"
  },
  {
    "id": "exercise_003",
    "name": "Sentadillas",
    "category": "legs",
    "muscle_groups": ["quadriceps", "glutes", "hamstrings"],
    "equipment": "barbell",
    "instructions": "Con la barra en los hombros, baja hasta que los muslos estén paralelos al suelo",
    "is_custom": false,
    "created_by_user_id": null,
    "created_at": "2025-01-01T00:00:00Z"
  },
  {
    "id": "exercise_999",
    "name": "Mi Ejercicio Custom",
    "category": "arms",
    "muscle_groups": ["biceps"],
    "equipment": "dumbbell",
    "instructions": "Ejercicio personalizado del usuario",
    "is_custom": true,
    "created_by_user_id": "user_001",
    "created_at": "2025-01-20T16:45:00Z"
  }
]
```

---

### **3. ROUTINES**

```sql
CREATE TABLE routines (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  name VARCHAR NOT NULL,
  description TEXT,
  is_template BOOLEAN DEFAULT false,
  estimated_duration_minutes INTEGER,
  difficulty_level VARCHAR, -- beginner, intermediate, advanced
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Datos Mock:**

```json
[
  {
    "id": "routine_001",
    "user_id": "user_001",
    "name": "Push Day",
    "description": "Entrenamiento de empuje: pecho, hombros, tríceps",
    "is_template": false,
    "estimated_duration_minutes": 45,
    "difficulty_level": "intermediate",
    "created_at": "2025-01-15T11:00:00Z",
    "updated_at": "2025-01-22T09:30:00Z"
  },
  {
    "id": "routine_002",
    "user_id": "user_001",
    "name": "Pull Day",
    "description": "Entrenamiento de tracción: espalda, bíceps",
    "is_template": false,
    "estimated_duration_minutes": 50,
    "difficulty_level": "intermediate",
    "created_at": "2025-01-15T11:15:00Z",
    "updated_at": "2025-01-15T11:15:00Z"
  },
  {
    "id": "routine_template_001",
    "user_id": null,
    "name": "Starting Strength",
    "description": "Rutina clásica de fuerza para principiantes",
    "is_template": true,
    "estimated_duration_minutes": 60,
    "difficulty_level": "beginner",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-01T00:00:00Z"
  }
]
```

---

### **4. BLOCKS**

```sql
CREATE TABLE blocks (
  id VARCHAR PRIMARY KEY,
  routine_id VARCHAR REFERENCES routines(id),
  order_index INTEGER NOT NULL,
  type VARCHAR NOT NULL, -- individual, superset, circuit, dropset
  rest_time_seconds INTEGER DEFAULT 90,
  rest_between_exercises_seconds INTEGER DEFAULT 0, -- for circuits
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Datos Mock:**

```json
[
  {
    "id": "block_001",
    "routine_id": "routine_001",
    "order_index": 1,
    "type": "superset",
    "rest_time_seconds": 90,
    "rest_between_exercises_seconds": 0,
    "created_at": "2025-01-15T11:00:00Z"
  },
  {
    "id": "block_002",
    "routine_id": "routine_001",
    "order_index": 2,
    "type": "circuit",
    "rest_time_seconds": 120,
    "rest_between_exercises_seconds": 15,
    "created_at": "2025-01-15T11:00:00Z"
  },
  {
    "id": "block_003",
    "routine_id": "routine_001",
    "order_index": 3,
    "type": "individual",
    "rest_time_seconds": 60,
    "rest_between_exercises_seconds": 0,
    "created_at": "2025-01-15T11:00:00Z"
  }
]
```

---

### **5. BLOCK_EXERCISES**

```sql
CREATE TABLE block_exercises (
  id VARCHAR PRIMARY KEY,
  block_id VARCHAR REFERENCES blocks(id),
  exercise_id VARCHAR REFERENCES exercises(id),
  order_index INTEGER NOT NULL,
  sets INTEGER NOT NULL,
  reps_min INTEGER,
  reps_max INTEGER,
  duration_seconds INTEGER, -- for time-based exercises like planks
  weight_kg DECIMAL(5,2), -- suggested starting weight
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Datos Mock:**

```json
[
  {
    "id": "block_ex_001",
    "block_id": "block_001",
    "exercise_id": "exercise_001",
    "order_index": 1,
    "sets": 3,
    "reps_min": 8,
    "reps_max": 10,
    "duration_seconds": null,
    "weight_kg": 80.0,
    "notes": "Controlar la bajada",
    "created_at": "2025-01-15T11:00:00Z"
  },
  {
    "id": "block_ex_002",
    "block_id": "block_001",
    "exercise_id": "exercise_002",
    "order_index": 2,
    "sets": 3,
    "reps_min": 8,
    "reps_max": 10,
    "duration_seconds": null,
    "weight_kg": 70.0,
    "notes": "Mantener core apretado",
    "created_at": "2025-01-15T11:00:00Z"
  },
  {
    "id": "block_ex_003",
    "block_id": "block_002",
    "exercise_id": "exercise_003",
    "order_index": 1,
    "sets": 4,
    "reps_min": 12,
    "reps_max": 15,
    "duration_seconds": null,
    "weight_kg": 100.0,
    "notes": null,
    "created_at": "2025-01-15T11:00:00Z"
  },
  {
    "id": "block_ex_004",
    "block_id": "block_002",
    "exercise_id": "exercise_004",
    "order_index": 2,
    "sets": 4,
    "reps_min": null,
    "reps_max": null,
    "duration_seconds": 30,
    "weight_kg": null,
    "notes": "Mantener línea recta",
    "created_at": "2025-01-15T11:00:00Z"
  }
]
```

---

### **6. WORKOUTS**

```sql
CREATE TABLE workouts (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  routine_id VARCHAR REFERENCES routines(id),
  name VARCHAR NOT NULL,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  total_duration_seconds INTEGER,
  total_volume_kg DECIMAL(8,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Datos Mock:**

```json
[
  {
    "id": "workout_001",
    "user_id": "user_001",
    "routine_id": "routine_001",
    "name": "Push Day",
    "started_at": "2025-01-28T08:30:00Z",
    "completed_at": "2025-01-28T09:15:00Z",
    "total_duration_seconds": 2700,
    "total_volume_kg": 8420.0,
    "notes": "Buen entrenamiento, me sentí fuerte",
    "created_at": "2025-01-28T08:30:00Z"
  },
  {
    "id": "workout_002",
    "user_id": "user_001",
    "routine_id": "routine_002",
    "name": "Pull Day",
    "started_at": "2025-01-30T09:00:00Z",
    "completed_at": "2025-01-30T09:52:00Z",
    "total_duration_seconds": 3120,
    "total_volume_kg": 9180.0,
    "notes": "Dominadas más fáciles hoy",
    "created_at": "2025-01-30T09:00:00Z"
  },
  {
    "id": "workout_003",
    "user_id": "user_001",
    "routine_id": "routine_001",
    "name": "Push Day",
    "started_at": "2025-02-01T08:45:00Z",
    "completed_at": null,
    "total_duration_seconds": null,
    "total_volume_kg": null,
    "notes": null,
    "created_at": "2025-02-01T08:45:00Z"
  }
]
```

---

### **7. WORKOUT_SETS**

```sql
CREATE TABLE workout_sets (
  id VARCHAR PRIMARY KEY,
  workout_id VARCHAR REFERENCES workouts(id),
  block_exercise_id VARCHAR REFERENCES block_exercises(id),
  set_number INTEGER NOT NULL,
  weight_kg DECIMAL(5,2),
  reps INTEGER,
  duration_seconds INTEGER,
  rpe DECIMAL(2,1), -- Rate of Perceived Exertion (1-10)
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Datos Mock:**

```json
[
  {
    "id": "set_001",
    "workout_id": "workout_001",
    "block_exercise_id": "block_ex_001",
    "set_number": 1,
    "weight_kg": 80.0,
    "reps": 10,
    "duration_seconds": null,
    "rpe": 7.5,
    "completed_at": "2025-01-28T08:35:00Z",
    "notes": null,
    "created_at": "2025-01-28T08:35:00Z"
  },
  {
    "id": "set_002",
    "workout_id": "workout_001",
    "block_exercise_id": "block_ex_002",
    "set_number": 1,
    "weight_kg": 70.0,
    "reps": 9,
    "duration_seconds": null,
    "rpe": 8.0,
    "completed_at": "2025-01-28T08:37:00Z",
    "notes": "Un poco pesado",
    "created_at": "2025-01-28T08:37:00Z"
  },
  {
    "id": "set_003",
    "workout_id": "workout_001",
    "block_exercise_id": "block_ex_001",
    "set_number": 2,
    "weight_kg": 80.0,
    "reps": 8,
    "duration_seconds": null,
    "rpe": 8.5,
    "completed_at": "2025-01-28T08:40:00Z",
    "notes": null,
    "created_at": "2025-01-28T08:40:00Z"
  },
  {
    "id": "set_004",
    "workout_id": "workout_001",
    "block_exercise_id": "block_ex_004",
    "set_number": 1,
    "weight_kg": null,
    "reps": null,
    "duration_seconds": 32,
    "rpe": 6.0,
    "completed_at": "2025-01-28T08:55:00Z",
    "notes": "Plancha sólida",
    "created_at": "2025-01-28T08:55:00Z"
  }
]
```

---

### **8. PERSONAL_RECORDS**

```sql
CREATE TABLE personal_records (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR REFERENCES users(id),
  exercise_id VARCHAR REFERENCES exercises(id),
  record_type VARCHAR NOT NULL, -- max_weight, max_reps, max_volume, best_time
  value DECIMAL(8,2) NOT NULL,
  reps INTEGER, -- for max_weight records
  date_achieved DATE NOT NULL,
  workout_id VARCHAR REFERENCES workouts(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Datos Mock:**

```json
[
  {
    "id": "pr_001",
    "user_id": "user_001",
    "exercise_id": "exercise_001",
    "record_type": "max_weight",
    "value": 85.0,
    "reps": 5,
    "date_achieved": "2025-01-28",
    "workout_id": "workout_001",
    "notes": "Nuevo PR! Se sintió genial",
    "created_at": "2025-01-28T09:15:00Z"
  },
  {
    "id": "pr_002",
    "user_id": "user_001",
    "exercise_id": "exercise_002",
    "record_type": "max_reps",
    "value": 12.0,
    "reps": null,
    "date_achieved": "2025-01-30",
    "workout_id": "workout_002",
    "notes": "Con 70kg",
    "created_at": "2025-01-30T09:52:00Z"
  },
  {
    "id": "pr_003",
    "user_id": "user_001",
    "exercise_id": "exercise_004",
    "record_type": "best_time",
    "value": 65.0,
    "reps": null,
    "date_achieved": "2025-01-30",
    "workout_id": "workout_002",
    "notes": "Plancha por 1:05",
    "created_at": "2025-01-30T09:52:00Z"
  }
]
```

---

## 🔗 **Relaciones Clave**

### **Jerarquía de Datos:**

```
User
├── Routines (1:many)
│   └── Blocks (1:many)
│       └── Block_Exercises (1:many)
│           └── Exercise (many:1)
└── Workouts (1:many)
    └── Workout_Sets (1:many)
        └── Block_Exercise (many:1)
```

### **Queries Comunes:**

#### **Obtener rutina completa con bloques:**

```sql
SELECT
  r.*,
  b.*,
  be.*,
  e.name as exercise_name
FROM routines r
JOIN blocks b ON r.id = b.routine_id
JOIN block_exercises be ON b.id = be.block_id
JOIN exercises e ON be.exercise_id = e.id
WHERE r.id = 'routine_001'
ORDER BY b.order_index, be.order_index;
```

#### **Obtener historial de entrenamientos con volumen:**

```sql
SELECT
  w.*,
  SUM(ws.weight_kg * ws.reps) as total_volume
FROM workouts w
LEFT JOIN workout_sets ws ON w.id = ws.workout_id
WHERE w.user_id = 'user_001'
GROUP BY w.id
ORDER BY w.started_at DESC;
```

#### **Obtener PRs por ejercicio:**

```sql
SELECT
  e.name,
  pr.record_type,
  pr.value,
  pr.date_achieved
FROM personal_records pr
JOIN exercises e ON pr.exercise_id = e.id
WHERE pr.user_id = 'user_001'
ORDER BY pr.date_achieved DESC;
```

---

## 📱 **Consideraciones para React Native**

### **Estado Local (AsyncStorage):**

```javascript
// Para funcionalidad offline
const localStorageKeys = {
  ACTIVE_WORKOUT: "@fitblocks/active_workout",
  DRAFT_ROUTINES: "@fitblocks/draft_routines",
  USER_PREFERENCES: "@fitblocks/user_preferences",
};
```

### **Sync Strategy:**

- **Optimistic Updates**: UI se actualiza inmediatamente
- **Background Sync**: Sincroniza con servidor cuando hay conexión
- **Conflict Resolution**: Last-write-wins para datos simples

**¿Te sirve este esquema? ¿Necesitás que ajuste algo en las relaciones o agregue más tablas?**
