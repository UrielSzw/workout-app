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

  const { addFolder, updateFolder, setFolderToEdit, folderToEdit } = mainStore(
    (state) => state,
  );

  const defaultFolderName = folderName || folderToEdit?.name || '';
  const defaultFolderIcon = folderIcon || folderToEdit?.icon || '📁';
  const defaultFolderColor = folderColor || folderToEdit?.color || '#3b82f6';

  const handleSaveFolder = () => {
    if (!defaultFolderName.trim()) {
      Alert.alert('Error', 'El nombre de la carpeta es obligatorio');
      return;
    }

    if (isEditMode && folderToEdit) {
      updateFolder(folderToEdit.id, {
        name: defaultFolderName,
        icon: defaultFolderIcon,
        color: defaultFolderColor,
      });
      setFolderToEdit(null);
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

  return {
    folderName: defaultFolderName,
    folderIcon: defaultFolderIcon,
    folderColor: defaultFolderColor,
    setFolderName,
    setFolderIcon,
    setFolderColor,
    handleSaveFolder,
  };
};
