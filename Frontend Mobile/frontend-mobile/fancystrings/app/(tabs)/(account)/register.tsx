import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React, { Fragment, useState } from "react";
import { Appearance, SafeAreaView, Text, View } from "react-native";
import ThemedButton from "../../components/ThemedButtonIrish";
import ThemedTextInput from "../../components/ThemedTextInput";
import { useAuth } from "../../context/AuthContext";


const Register = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const router = useRouter();
    const { onRegister } = useAuth();

    const register = async () => {
        const result = await onRegister!(firstName, lastName, email, password);
        if (result && result.error) {
            alert(result.msg);
        } else {
            router.navigate('/(tabs)');
        }
    }

    return (
        <Fragment>
            <SafeAreaView className="bg-background-light dark:bg-background-dark" />
            <SafeAreaView className="flex-1 w-['100%'] bg-background-light dark:bg-background-dark items-center justify-center">
            <View className="flex-row w-['100%'] h-['5%'] pl-4 pr-4 items-center justify-between bg-background-light dark:bg-background-dark " >
                <Text onPress={() => router.navigate('/(tabs)/(account)/login')} className="w-['33%']"><Ionicons name="arrow-back-outline" size={28} color={Appearance.getColorScheme() === 'dark' ? 'white' : 'black'}/></Text>
            </View>
            <View className="flex-1 w-['100%'] h-['100%'] mt-8 items-center justify-start bg-background-light dark:bg-background-dark " >
                <View className="w-['95%'] h-['95%'] items-center justify-start mb-10 rounded-2xl p-8">
                    <Text className="text-4xl font-semibold text-text-light dark:text-text-dark mb-10 ">Register</Text>
                    <ThemedTextInput autoCapitalize="none" placeholder={"First name"} value={firstName} onChangeText={setFirstName} keyboard={"email-address"}/>
                    <ThemedTextInput autoCapitalize="none" placeholder={"Last name"} value={lastName} onChangeText={setLastName} keyboard={"email-address"}/>
                    <ThemedTextInput autoCapitalize="none" placeholder={"Email"} value={email} onChangeText={setEmail} keyboard={"email-address"}/>
                    <ThemedTextInput placeholder={"Password"} value={password} onChangeText={setPassword} secureTextEntry={true}/>
                    <ThemedButton title={"Register"} icon={<Ionicons name="log-in-outline" size={28} />} onPress={register}/>
                </View>
            </View>
        </SafeAreaView>
        </Fragment>
        
        
    )
}

export default Register;