import { Appearance, TextInput } from "react-native";


const ThemedTextInput = ({ ...props }) => {
    return (
        <TextInput placeholderTextColor={Appearance.getColorScheme() === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'} className="w-['100%'] text-2xl text-text-light text-center dark:text-text-dark rounded-2xl border border-text-light dark:border-text-dark p-2 mb-4" {...props}/>
    );
}

export default ThemedTextInput;