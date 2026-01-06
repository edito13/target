import React from "react";
import { ColorValue, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";

export interface SummaryI {
  label: string;
  value: string;
}

interface SummaryProps {
  data: SummaryI;
  icon: {
    color: ColorValue;
    name: keyof typeof MaterialIcons.glyphMap;
  };
  isRight?: boolean;
}

const Summary: React.FC<SummaryProps> = ({ data, icon, isRight = false }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.header, isRight && { justifyContent: "flex-end" }]}>
        <MaterialIcons name={icon.name} color={icon.color} size={24} />
        <Text style={styles.label}>{data.label}</Text>
      </View>
      <Text style={styles.value}>{data.value}</Text>
    </View>
  );
};

export default Summary;
