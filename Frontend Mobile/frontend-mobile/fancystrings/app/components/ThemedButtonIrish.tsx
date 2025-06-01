import { Pressable, Text } from "react-native";


const ThemedButtonIrish = ({ title, icon, onPress }) => {
  return (
    <Pressable onPress={onPress} className="w-['100%'] text-center items-center justify-center bg-irish-main hover:bg-irish-light text-text-dark rounded-2xl p-2">
      <Text className="text-text-dark leading-none text-2xl items-center justify-center text-center">{title}{' '}</Text>
    </Pressable>
  );
}

export default ThemedButtonIrish;