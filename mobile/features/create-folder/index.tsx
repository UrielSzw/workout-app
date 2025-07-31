import React, { useState } from "react";
import { View, SafeAreaView, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import { Typography, Button, Card } from "@/components/ui";
import { useColorScheme } from "@/hooks/useColorScheme";
import { getThemeColors } from "@/constants/Colors";
import { FolderInfoForm } from "./folder-info-form";

export const CreateFolderFeature = () => {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === "dark");

  const [folderName, setFolderName] = useState("");
  const [folderIcon, setFolderIcon] = useState("📁");
  const [folderColor, setFolderColor] = useState("#3b82f6");

  const handleSaveFolder = () => {
    if (!folderName.trim()) {
      Alert.alert("Error", "El nombre de la carpeta es obligatorio");
      return;
    }

    const newFolder = {
      id: Date.now().toString(),
      name: folderName,
      icon: folderIcon,
      color: folderColor,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Mock para cuando esté conectado el backend
    console.log("Nueva carpeta creada:", newFolder);
    Alert.alert(
      "¡Carpeta creada!",
      `La carpeta "${folderName}" se ha creado exitosamente (mock)`,
      [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onPress={() => router.back()}
          icon={<ArrowLeft size={20} color={colors.text} />}
        >
          {""}
        </Button>

        <View style={{ flex: 1, paddingHorizontal: 16 }}>
          <Typography variant="h5" weight="semibold">
            Nueva Carpeta
          </Typography>
        </View>

        <Button variant="primary" size="sm" onPress={handleSaveFolder}>
          Crear
        </Button>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
      >
        {/* Folder Info Form */}
        <FolderInfoForm
          folderName={folderName}
          folderIcon={folderIcon}
          folderColor={folderColor}
          onNameChange={setFolderName}
          onIconChange={setFolderIcon}
          onColorChange={setFolderColor}
        />

        {/* Preview Card */}
        <View style={{ marginTop: 24 }}>
          <Typography
            variant="h6"
            weight="semibold"
            style={{ marginBottom: 12 }}
          >
            Vista Previa
          </Typography>

          <Card variant="outlined" padding="md">
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: folderColor + "20",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Typography variant="h6">{folderIcon}</Typography>
              </View>

              <View style={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  weight="semibold"
                  style={{ marginBottom: 2 }}
                >
                  {folderName || "Nombre de la carpeta"}
                </Typography>
                <Typography variant="body2" color="textMuted">
                  0 rutinas
                </Typography>
              </View>
            </View>
          </Card>
        </View>

        {/* Spacer */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};
