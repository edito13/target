import React from "react";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { styles } from "./styles";
import Separator from "../Separator";
import { MaterialIcons } from "@expo/vector-icons";

export interface TargetI {
  id?: string;
  name: string;
  target: string;
  current: string;
  percentage: string;
}

interface TargetProps extends TouchableOpacityProps {
  data: TargetI;
}

const Target: React.FC<TargetProps> = ({ data, ...rest }) => {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {data.name}
        </Text>
        <Text style={styles.status}>
          {data.percentage} • {data.current} de {data.target}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={20} />
    </TouchableOpacity>
  );
};

export default Target;
