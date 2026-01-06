import React from "react";
import { Text, View } from "react-native";
import { styles } from "./styles";
import { TransactionTypes } from "@/types";
import Option from "./option";
import { colors } from "@/theme";

interface TransactionTypeProps {
  selected: TransactionTypes;
  onChange: (type: TransactionTypes) => void;
}

const TransactionType: React.FC<TransactionTypeProps> = ({
  selected,
  onChange,
}) => {
  return (
    <View style={styles.container}>
      <Option
        title="Guardar"
        icon="arrow-upward"
        selectedColor={colors.blue[500]}
        isSelected={selected === TransactionTypes.Input}
        onPress={() => onChange(TransactionTypes.Input)}
      />

      <Option
        title="Resgatar"
        icon="arrow-downward"
        selectedColor={colors.red[400]}
        isSelected={selected === TransactionTypes.Output}
        onPress={() => onChange(TransactionTypes.Output)}
      />
    </View>
  );
};

export default TransactionType;
