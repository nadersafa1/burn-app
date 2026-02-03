import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, View } from "react-native";

interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon?: keyof typeof Ionicons.glyphMap;
  className?: string;
}

export function TextInput({
  value,
  onChangeText,
  placeholder,
  icon = "mail-outline",
  keyboardType,
  autoCapitalize,
  autoComplete,
  className,
  ...props
}: TextInputProps) {
  return (
    <View
      className={`flex-row items-center bg-card border px-4 border-border rounded-lg  ${className || ""}`}
    >
      {icon && (
        <Ionicons name={icon} size={16} color="#6B6B6B" style={{ marginRight: 12 }} />
      )}
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6B6B6B"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        style={{ color: "#111111",paddingVertical: 12, flex: 1 }}
        {...props}
      />
    </View>
  );
}
