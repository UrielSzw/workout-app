import { mainStore } from '@/store/main-store';
import { IFolder } from '@/types/routine';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

type Params = {
  isEditMode?: boolean;
};

export const useFormFolder = ({ isEditMode }: Params) => {
  const [folderName, setFolderName] = useState('');
  const [folderIcon, setFolderIcon] = useState('');
  const [folderColor, setFolderColor] = useState('');

  const {
    addFolder,
    updateFolder,
    setSelectedFolder,
    selectedFolder,
    deleteFolder,
  } = mainStore((state) => state);

  const defaultFolderName = folderName || selectedFolder?.name || '';
  const defaultFolderIcon = folderIcon || selectedFolder?.icon || '';
  const defaultFolderColor = folderColor || selectedFolder?.color || '#3b82f6';

  const handleSaveFolder = () => {
    if (!defaultFolderName.trim()) {
      Alert.alert('Error', 'El nombre de la carpeta es obligatorio');
      return;
    }

    if (isEditMode && selectedFolder) {
      const updatedFolder: IFolder = {
        ...selectedFolder,
        name: defaultFolderName,
        icon: defaultFolderIcon,
        color: defaultFolderColor,
        updatedAt: new Date().toISOString(),
      };

      updateFolder(selectedFolder.id, updatedFolder);
      setSelectedFolder(updatedFolder);
    } else {
      const newFolder: IFolder = {
        id: Date.now().toString(),
        name: defaultFolderName,
        icon: defaultFolderIcon,
        color: defaultFolderColor,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addFolder(newFolder);
    }

    router.back();
  };

  const handleDeleteFolder = () => {
    if (selectedFolder) {
      Alert.alert(
        'Eliminar Carpeta',
        '¿Estás seguro de que deseas eliminar esta carpeta?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => {
              // Call the deleteFolder function from the store
              deleteFolder(selectedFolder.id);
              setSelectedFolder(null);
              router.back();
            },
          },
        ],
      );
    }
  };

  return {
    folderName: defaultFolderName,
    folderIcon: defaultFolderIcon,
    folderColor: defaultFolderColor,
    setFolderName,
    setFolderIcon,
    setFolderColor,
    handleSaveFolder,
    handleDeleteFolder,
  };
};
