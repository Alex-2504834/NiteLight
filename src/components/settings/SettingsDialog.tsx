import { createContext, useCallback, useContext, useMemo, useState, type PropsWithChildren } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { settingsStyles } from "../../styles/settings";
import { colors } from "../../styles/theme";
import { useTheme } from "../../styles/useTheme";

export type SettingsDialogAction = {
  label: string;
  tone?: "default" | "primary" | "destructive";
  onPress?: () => void | Promise<void>;
};

export type SettingsDialogConfig = {
  title: string;
  message?: string;
  icon?: string;
  actions?: SettingsDialogAction[];
};

type SettingsDialogContextValue = {
  showDialog: (config: SettingsDialogConfig) => void;
  hideDialog: () => void;
};

const SettingsDialogContext = createContext<SettingsDialogContextValue | null>(null);

function SettingsDialogHost({
  config,
  onClose,
}: {
  config: SettingsDialogConfig | null;
  onClose: () => void;
}) {
  const { colour } = useTheme();

  const actions = config?.actions?.length
    ? config.actions
    : [{ label: "OK", tone: "primary" as const }];

  return (
    <Modal
      visible={Boolean(config)}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={settingsStyles.dialogBackdrop} onPress={onClose}>
        <Pressable
          style={[
            settingsStyles.dialogCard,
            { backgroundColor: colour.surface, borderColor: colour.border },
          ]}
          onPress={() => undefined}
        >
          {config?.icon ? (
            <View
              style={[
                settingsStyles.dialogIconWrap,
                { backgroundColor: colour.surfaceSecondary, borderColor: colour.border },
              ]}
            >
              <Ionicons name={config.icon} size={22} color={colour.primary} />
            </View>
          ) : null}

          <Text style={[settingsStyles.dialogTitle, { color: colour.text }]}>
            {config?.title}
          </Text>

          {config?.message ? (
            <Text style={[settingsStyles.dialogMessage, { color: colour.textSecondary }]}>
              {config.message}
            </Text>
          ) : null}

          <View style={settingsStyles.dialogActions}>
            {actions.map((action, index) => {
              const isPrimary = action.tone === "primary";
              const isDestructive = action.tone === "destructive";
              const labelColour = isPrimary
                ? colors.brandText
                : isDestructive
                ? colour.error
                : colour.text;

              return (
                <Pressable
                  key={`${action.label}-${index}`}
                  accessibilityRole="button"
                  onPress={() => {
                    onClose();
                    const result = action.onPress?.();
                    if (result && typeof (result as Promise<void>).catch === "function") {
                      (result as Promise<void>).catch(error => {
                        console.error("Settings dialog action failed:", error);
                      });
                    }
                  }}
                  style={({ pressed }) => [
                    settingsStyles.dialogAction,
                    isPrimary && { backgroundColor: pressed ? colour.primaryHover : colour.primary, borderColor: colour.primaryHover },
                    !isPrimary && {
                      backgroundColor: pressed ? colour.surfaceSecondary : colour.surface,
                      borderColor: isDestructive ? colour.error : colour.border,
                    },
                  ]}
                >
                  <Text style={[settingsStyles.dialogActionText, { color: labelColour }]}>
                    {action.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function SettingsDialogProvider({ children }: PropsWithChildren) {
  const [config, setConfig] = useState<SettingsDialogConfig | null>(null);

  const hideDialog = useCallback(() => setConfig(null), []);
  const showDialog = useCallback((nextConfig: SettingsDialogConfig) => {
    setConfig(nextConfig);
  }, []);

  const value = useMemo(
    () => ({ showDialog, hideDialog }),
    [showDialog, hideDialog]
  );

  return (
    <SettingsDialogContext.Provider value={value}>
      {children}
      <SettingsDialogHost config={config} onClose={hideDialog} />
    </SettingsDialogContext.Provider>
  );
}

export function useSettingsDialog() {
  const context = useContext(SettingsDialogContext);

  if (!context) {
    throw new Error("useSettingsDialog must be used within a SettingsDialogProvider");
  }

  return context;
}
