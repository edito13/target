import React from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";
import { colors } from "@/theme";
import Input, { CurrencyInputProps } from "react-native-currency-input";

interface Props extends CurrencyInputProps {
  label: string;
}

const CurrencyInput: React.FC<Props> = ({ label, ...rest }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Input
        style={styles.input}
        placeholderTextColor={colors.gray[400]}
        delimiter="."
        separator=","
        precision={2}
        minValue={0}
        {...rest}
      />
    </View>
  );
};

export default CurrencyInput;
