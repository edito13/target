import { MaterialIcons } from "@expo/vector-icons";
import { ColorValue, Pressable, PressableProps, Text } from "react-native";
import { styles } from "./styles";
import { colors } from "@/theme";

interface OptionProps extends PressableProps {
  title: string;
  isSelected: boolean;
  selectedColor: ColorValue;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const Option: React.FC<OptionProps> = ({
  title,
  icon,
  isSelected,
  selectedColor,
  ...rest
}) => {
  return (
    <Pressable
      style={[styles.option, isSelected && { backgroundColor: selectedColor }]}
      {...rest}
    >
      <MaterialIcons
        name={icon}
        size={24}
        color={isSelected ? colors.white : colors.gray[500]}
      />
      <Text style={[styles.title, isSelected && { color: colors.white  }]}>
        {title}
      </Text>
    </Pressable>
  );
};

export default Option;
