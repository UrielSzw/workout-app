# 🏋️ Workout App - Nuevas Funcionalidades de Gestión de Carpetas y Rutinas

## ✨ Funcionalidades Implementadas

### 1. 🎯 Drag & Drop para Reordenar Carpetas

- **Funcionalidad**: Mantén presionada una carpeta y arrástrala para cambiar su orden
- **Feedback Visual**:
  - Escalado y opacidad al arrastrar
  - Sombras dinámicas para crear sensación de profundidad
  - Feedback háptico al iniciar y completar el movimiento
- **Animaciones**: Suaves transiciones con `react-native-reanimated`

### 2. 📱 Sistema de Gestión de Rutinas en Carpetas

- **Long Press en Rutinas**: Mantén presionada cualquier rutina para abrir opciones de movimiento
- **Modal Inteligente**: Se adapta según el contexto:
  - **Desde página principal**: Muestra lista de carpetas disponibles
  - **Desde carpeta**: Opciones para sacar de carpeta o mover a otra
- **Feedback Háptico**: Respuesta táctil en todas las interacciones

### 3. 🔄 Store Actualizado

- **Nuevas funciones**:
  - `moveRoutineToFolder(routineId, folderId?)`: Mover rutinas entre carpetas
  - `reorderFolders(folders)`: Reordenar carpetas manteniendo persistencia
- **Persistencia automática**: Todos los cambios se guardan en AsyncStorage

## 🎨 Componentes Creados

### `DraggableFolderList`

```tsx
// Lista de carpetas con funcionalidad drag & drop
<DraggableFolderList
  folders={folders}
  getRoutinesInFolder={getRoutinesInFolder}
  onFolderPress={onFolderPress}
  onEditFolder={onEditFolder}
  onDeleteFolder={onDeleteFolder}
  onReorderFolders={onReorderFolders}
/>
```

### `MoveRoutineModal`

```tsx
// Modal para mover rutinas entre carpetas
<MoveRoutineModal
  visible={moveRoutineModalVisible}
  onClose={() => setMoveRoutineModalVisible(false)}
  routine={selectedRoutine}
  folders={folders}
  onMoveToFolder={handleMoveRoutine}
  currentFolderId={routine?.folderId}
/>
```

### `RoutineCard` (Mejorado)

```tsx
// Tarjeta de rutina con long press
<RoutineCard
  routine={routine}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onStart={handleStart}
  onLongPress={handleLongPress} // 🆕 Nueva prop
/>
```

## 🛠️ Dependencias Utilizadas

- `react-native-reanimated`: Animaciones fluidas
- `react-native-gesture-handler`: Gestos de drag & drop
- `expo-haptics`: Feedback táctil

## 🎮 Cómo Usar

### Reordenar Carpetas:

1. Mantén presionada una carpeta por ~500ms
2. Arrástrala hacia arriba o abajo
3. Suéltala en la nueva posición
4. ¡Feedback háptico confirmará el cambio!

### Mover Rutinas:

1. Mantén presionada cualquier rutina
2. Se abre el modal de opciones
3. Selecciona carpeta destino o "Sacar de carpeta"
4. Confirma el movimiento

## 🔮 Próximas Mejoras Sugeridas

- [ ] Animaciones de inserción al soltar carpetas
- [ ] Indicador visual de zona de drop
- [ ] Drag & drop también para rutinas
- [ ] Ordenamiento por diferentes criterios
- [ ] Búsqueda y filtros avanzados

## 💡 Detalles Técnicos

### Animaciones:

- `useSharedValue` para valores animados
- `useAnimatedGestureHandler` para gestos complejos
- `withSpring` para transiciones naturales

### Gestión de Estado:

- Zustand store para estado global
- AsyncStorage para persistencia
- React hooks para estado local del UI

### UX/UI:

- Feedback háptico en todas las interacciones importantes
- Sombras y escalado para profundidad visual
- Modales con presentación nativa
- Diseño consistente con el resto de la app

¡Disfruta las nuevas funcionalidades! 🚀
