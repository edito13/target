import React from "react";
import { ColorValue, Text, View } from "react-native";
import { styles } from "./styles";

interface SeparatorProps {
  color: ColorValue;
}

const Separator: React.FC<SeparatorProps> = ({ color }) => {
  return <View style={[styles.container, { backgroundColor: color }]} />;
};

export default Separator;
