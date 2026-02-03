import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, TouchableOpacity, View } from "react-native";

interface PasswordInputProps extends Omit<RNTextInputProps, "style" | "secureTextEntry"> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon?: keyof typeof Ionicons.glyphMap;
  className?: string;
}

export function PasswordInput({
  value,
  onChangeText,
  placeholder,
  icon = "lock-closed-outline",
  autoComplete,
  className,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View
      className={`flex-row items-center bg-card border border-border rounded-lg px-4 ${className || ""}`}
    >
      {icon && (
        <Ionicons name={icon} size={16} color="#6B6B6B" style={{ marginRight: 12 }} />
      )}
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6B6B6B"
        secureTextEntry={!isVisible}
        autoComplete={autoComplete}
        autoCapitalize="none"
        // className="flex-1 text-ink text-base"
        style={{ color: "#111111",paddingVertical: 12,flex: 1 }}
        {...props}
      />
      <TouchableOpacity
        onPress={() => setIsVisible(!isVisible)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={{ marginLeft: 12 }}
      >
        <Ionicons
          name={isVisible ? "eye-outline" : "eye-off-outline"}
          size={16}
          color="#6B6B6B"
        />
      </TouchableOpacity>
    </View>
  );
}
