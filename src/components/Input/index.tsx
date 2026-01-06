import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";
import { styles } from "./styles";
import { colors } from "@/theme";

interface InputProps extends TextInputProps {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...rest }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.gray[400]}
        {...rest}
      />
    </View>
  );
};

export default Input;
