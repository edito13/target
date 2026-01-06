import React from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "@/theme";
import { styles } from "./styles";
import Separator from "../Separator";
import Summary, { SummaryI } from "../Summary";

export interface HomeHeaderProps {
  total: string;
  input: SummaryI;
  output: SummaryI;
}

interface Props {
  data: HomeHeaderProps;
}

const HomeHeader: React.FC<Props> = ({ data }) => {
  return (
    <LinearGradient
      colors={[colors.blue[500], colors.blue[800]]}
      style={styles.container}
    >
      <View>
        <Text style={styles.label}>Total que você possui</Text>
        <Text style={styles.total}>{data.total}</Text>
      </View>

      <Separator color={colors.blue[400]} />

      <View style={styles.summary}>
        <Summary
          data={data.input}
          icon={{ name: "arrow-upward", color: colors.green[500] }}
        />
        <Summary
          data={data.output}
          icon={{ name: "arrow-downward", color: colors.red[400] }}
          isRight
        />
      </View>
    </LinearGradient>
  );
};

export default HomeHeader;
