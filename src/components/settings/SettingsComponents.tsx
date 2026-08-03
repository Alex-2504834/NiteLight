import type { PropsWithChildren, ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import { settingsStyles } from "../../styles/settings";
import { useTheme } from "../../styles/useTheme";

type SettingsPageProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  onBack?: () => void;
}>;

type SettingsSectionProps = PropsWithChildren<{
  title?: string;
}>;

type SettingsRowProps = {
  title: string;
  description?: string;
  icon: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
  destructive?: boolean;
  right?: ReactNode;
  disabled?: boolean;
};

type SettingsMenuRowProps = Pick<
  SettingsRowProps,
  "title" | "description" | "icon" | "onPress" | "isLast"
>;

type SettingsDetailRowProps = {
  label: string;
  value: string;
  isLast?: boolean;
};

type SettingsSwitchRowProps = Omit<
  SettingsRowProps,
  "right" | "value" | "onPress"
> & {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function SettingsPage({
  title,
  subtitle,
  onBack,
  children,
}: SettingsPageProps) {
  const { colour } = useTheme();

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[settingsStyles.safeArea, { backgroundColor: colour.background }]}
    >
      <ScrollView
        style={settingsStyles.page}
        contentContainerStyle={settingsStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={settingsStyles.header}>
          {onBack ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={onBack}
              hitSlop={8}
              style={({ pressed }) => [
                settingsStyles.backButton,
                pressed && { opacity: 0.55 },
              ]}
            >
              <Ionicons name="arrow-back" size={20} color={colour.text} />
              <Text style={[settingsStyles.backButtonText, { color: colour.text }]}>
                Back
              </Text>
            </Pressable>
          ) : null}

          <View style={settingsStyles.headerCopy}>
            <Text style={[settingsStyles.title, { color: colour.text }]}>
              {title}
            </Text>
            <View
              style={[
                settingsStyles.titleRule,
                { backgroundColor: colour.primary },
              ]}
            />
            {subtitle ? (
              <Text
                style={[
                  settingsStyles.subtitle,
                  { color: colour.textSecondary },
                ]}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function SettingsMenuRow({
  title,
  description,
  icon,
  onPress,
  isLast = false,
}: SettingsMenuRowProps) {
  const { colour } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        settingsStyles.menuRow,
        {
          backgroundColor: pressed ? colour.surfaceSecondary : colour.surface,
        },
        !isLast && [
          settingsStyles.rowBorder,
          { borderBottomColor: colour.border },
        ],
      ]}
    >
      <View style={settingsStyles.menuRowIcon}>
        <Ionicons name={icon} size={24} color={colour.primary} />
      </View>

      <View style={settingsStyles.menuRowCopy}>
        <Text style={[settingsStyles.menuRowTitle, { color: colour.text }]}>
          {title}
        </Text>
        {description ? (
          <Text
            style={[
              settingsStyles.menuRowDescription,
              { color: colour.textSecondary },
            ]}
          >
            {description}
          </Text>
        ) : null}
      </View>

      <Ionicons name="chevron-forward" size={19} color={colour.textSecondary} />
    </Pressable>
  );
}

export function SettingsSection({ title, children }: SettingsSectionProps) {
  const { colour } = useTheme();

  return (
    <View style={settingsStyles.section}>
      {title ? (
        <View
          style={[
            settingsStyles.sectionHeader,
            {
              backgroundColor: colour.surfaceSecondary,
              borderColor: colour.border,
              borderLeftColor: colour.primary,
            },
          ]}
        >
          <Text style={[settingsStyles.sectionTitle, { color: colour.text }]}>
            {title}
          </Text>
        </View>
      ) : null}
      <View
        style={[
          settingsStyles.card,
          title && settingsStyles.cardWithHeader,
          {
            backgroundColor: colour.surface,
            borderColor: colour.border,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

export function SettingsDetailRow({
  label,
  value,
  isLast = false,
}: SettingsDetailRowProps) {
  const { colour } = useTheme();

  return (
    <View
      style={[
        settingsStyles.detailRow,
        !isLast && [
          settingsStyles.rowBorder,
          { borderBottomColor: colour.border },
        ],
      ]}
    >
      <Text style={[settingsStyles.detailLabel, { color: colour.textSecondary }]}>
        {label}
      </Text>
      <Text selectable style={[settingsStyles.detailValue, { color: colour.text }]}>
        {value}
      </Text>
    </View>
  );
}

export function SettingsRow({
  title,
  description,
  icon,
  value,
  onPress,
  isLast = false,
  destructive = false,
  right,
  disabled = false,
}: SettingsRowProps) {
  const { colour } = useTheme();
  const rowTextColour = destructive ? colour.error : colour.text;

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      disabled={!onPress || disabled}
      onPress={onPress}
      style={({ pressed }) => [
        settingsStyles.row,
        {
          backgroundColor:
            pressed && onPress ? colour.surfaceSecondary : colour.surface,
        },
        !isLast && [
          settingsStyles.rowBorder,
          { borderBottomColor: colour.border },
        ],
        disabled && { opacity: 0.5 },
      ]}
    >
      <View style={settingsStyles.rowIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={destructive ? colour.error : colour.primary}
        />
      </View>

      <View style={settingsStyles.rowCopy}>
        <Text style={[settingsStyles.rowTitle, { color: rowTextColour }]}>
          {title}
        </Text>
        {description ? (
          <Text
            style={[
              settingsStyles.rowDescription,
              { color: colour.textSecondary },
            ]}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {right ??
        (value ? (
          <Text
            numberOfLines={1}
            style={[settingsStyles.rowValue, { color: colour.textSecondary }]}
          >
            {value}
          </Text>
        ) : onPress ? (
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colour.textSecondary}
          />
        ) : null)}
    </Pressable>
  );
}

export function SettingsSwitchRow({
  value,
  onValueChange,
  isLast = false,
  title,
  description,
  icon,
  disabled = false,
}: SettingsSwitchRowProps) {
  const { colour } = useTheme();
  const toggle = () => onValueChange(!value);

  return (
    <View
      style={[
        settingsStyles.switchRow,
        { backgroundColor: colour.surface },
        !isLast && [
          settingsStyles.rowBorder,
          { borderBottomColor: colour.border },
        ],
        disabled && { opacity: 0.5 },
      ]}
    >
      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: value, disabled }}
        disabled={disabled}
        onPress={toggle}
        style={({ pressed }) => [
          settingsStyles.switchLabelPressable,
          pressed && { backgroundColor: colour.surfaceSecondary },
        ]}
      >
        <View style={settingsStyles.rowIcon}>
          <Ionicons name={icon} size={20} color={colour.primary} />
        </View>

        <View style={settingsStyles.rowCopy}>
          <Text style={[settingsStyles.rowTitle, { color: colour.text }]}>
            {title}
          </Text>
          {description ? (
            <Text
              style={[
                settingsStyles.rowDescription,
                { color: colour.textSecondary },
              ]}
            >
              {description}
            </Text>
          ) : null}
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="switch"
        accessibilityLabel={title}
        accessibilityState={{ checked: value, disabled }}
        disabled={disabled}
        hitSlop={6}
        onPress={toggle}
        style={({ pressed }) => [
          settingsStyles.switchControlPressable,
          pressed && { backgroundColor: colour.surfaceSecondary },
        ]}
      >
        <Switch
          pointerEvents="none"
          value={value}
          trackColor={{ false: colour.border, true: colour.primary }}
          thumbColor={value ? colour.text : colour.surface}
          ios_backgroundColor={colour.border}
        />
      </Pressable>
    </View>
  );
}
