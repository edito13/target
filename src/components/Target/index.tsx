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
import { colors } from "@/theme";

export interface TargetI {
  id?: string;
  name: string;
  target: string;
  current: string;
  percentage: string;
}

interface TargetProps extends TouchableOpacityProps {
  data: TargetI;
  isAchieved?: boolean;
}

const Target: React.FC<TargetProps> = ({
  data,
  isAchieved = false,
  ...rest
}) => {
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
      {isAchieved ? (
        <Text style={{ color: colors.blue["500"] }}>Concluída</Text>
      ) : (
        <MaterialIcons name="chevron-right" size={20} />
      )}
    </TouchableOpacity>
  );
};

export default Target;
