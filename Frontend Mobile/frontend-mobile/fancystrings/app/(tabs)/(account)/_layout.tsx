import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { Appearance } from "react-native";
import { AuthProvider } from "../../context/AuthContext";

const _Layout = () => {

    
    return (
        <AuthProvider>
            <Tabs
                screenOptions={{
                    headerShown: false, 
                    tabBarActiveTintColor: Appearance.getColorScheme() === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="log-in-outline" size={24} color={color} /> 
                    ),
                    tabBarStyle: {
                       display: 'none'
                    },
                    tabBarItemStyle: {
                        display: 'none'
                    },
                    tabBarIconStyle: {
                        display: 'none'
                    },
                }}  
            >
                <Tabs.Screen
                    name="login"
                    options={{
                        title: 'Login',
                        }}
                />
                <Tabs.Screen
                    name="register"
                    options={{
                        title: 'Register',
                    }}
                />
            </Tabs>
        </AuthProvider>
    )
}

export default _Layout;

