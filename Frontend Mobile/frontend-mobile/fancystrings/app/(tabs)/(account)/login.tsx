import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from 'expo-router';
import React, { Fragment, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import ThemedButton from '../../components/ThemedButtonIrish';
import ThemedTextInput from '../../components/ThemedTextInput';
import { useAuth } from "../../context/AuthContext";


export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();
    const { onLogin } = useAuth();
    

    const login = async () => {
        const result = await onLogin!(email, password);
        console.info(result);
        if (result && result.error) {
            alert(result.msg);
        } else {
            router.navigate('/(tabs)');
        }
    }

    return (
        <Fragment>
            <SafeAreaView className="bg-background-light dark:bg-background-dark" />
            <SafeAreaView className="flex-1 w-['100%'] h-['100%'] bg-background-light dark:bg-background-dark items-start justify-center">
                <View className="flex-1 w-['100%'] h-['100%'] items-center justify-start bg-background-light dark:bg-background-dark " >
                    <View className="w-['95%'] h-['50%'] items-center justify-center mb-10 rounded-2xl p-8">
                        <Text className="text-4xl font-semibold text-text-light dark:text-text-dark mb-10 ">Login</Text>
                        <ThemedTextInput autoCapitalize="none" placeholder={"Email"} value={email} onChangeText={setEmail} keyboard={"email-address"}/>
                        <ThemedTextInput placeholder={"Password"} value={password} onChangeText={setPassword} secureTextEntry={true}/>
                        <ThemedButton title={"Login"} icon={<Ionicons name="log-in-outline" size={28} />} onPress={login}/>
                    </View>
                    <View className="w-['95%'] h-['40%'] items-center justify-end mb-11 rounded-2xl p-8">
                        <ThemedButton title={"Register"} icon={<Ionicons name="person-add-outline" size={28} />} onPress={() => router.navigate('/(tabs)/(account)/register')}/>
                        <Text className="text-text-light dark:text-text-dark text-center mt-4">Don&apos;t have an account? Register now!</Text>
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
        
    );


}