import React from "react";
import {
  FlatList,
  FlatListProps,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { styles } from "./styles";
import Separator from "../Separator";
import { colors } from "@/theme";

interface ListProps<T> extends FlatListProps<T> {
  title: string;
  emptyMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const List = <T,>({
  title,
  data,
  renderItem,
  emptyMessage,
  containerStyle,
  ...rest
}: ListProps<T>) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <Separator color={colors.gray[200]} />}
        ListEmptyComponent={<Text style={styles.empty}>{emptyMessage}</Text>}
        {...rest}
      />
    </View>
  );
};

export default List;
