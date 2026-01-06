import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/theme";
import { TransactionTypes } from "@/types";

export interface TransactionI {
  id: string;
  value: string;
  date: string;
  description?: string;
  type: TransactionTypes;
}

interface TransationProps {
  data: TransactionI;
  onRemove: () => void;
}

const Transation: React.FC<TransationProps> = ({ data, onRemove }) => {
  return (
    <View style={styles.container}>
      <MaterialIcons
        size={20}
        name={
          data.type === TransactionTypes.Input
            ? "arrow-upward"
            : "arrow-downward"
        }
        color={
          data.type === TransactionTypes.Input
            ? colors.blue[500]
            : colors.red[400]
        }
      />
      <View style={styles.info}>
        <Text style={styles.value}>{data.value}</Text>
        <Text style={styles.description} numberOfLines={1}>
          {data.date} {data.description && `• ${data.description}`}
        </Text>
      </View>

      <TouchableOpacity activeOpacity={0.8} onPress={onRemove}>
        <MaterialIcons name="close" size={18} color={colors.gray[500]} />
      </TouchableOpacity>
    </View>
  );
};

export default Transation;
