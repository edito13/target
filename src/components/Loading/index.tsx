import React from "react";
import { ActivityIndicator } from "react-native";

import { colors } from "@/theme";
import { styles } from "./styles";

interface LoadingProps {}

const Loading: React.FC<LoadingProps> = () => {
  return (
    <ActivityIndicator color={colors.blue[500]} style={styles.container} />
  );
};

export default Loading;
