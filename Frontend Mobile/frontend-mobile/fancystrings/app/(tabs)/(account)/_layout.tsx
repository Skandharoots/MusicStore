import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Appearance } from "react-native";
import { useAuth } from "../../context/AuthContext";

function _Layout() {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { authState, onLogout } = useAuth();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [auth, setAuth] = useState(false);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        // eslint-disable-next-line no-unused-expressions
        authState?.authenticated ? setAuth(true) : setAuth(false);
    }, [authState?.authenticated, authState])
    
    return (
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
                {authState?.authenticated !== null ? (
                    <Tabs.Screen
                    name="account"
                    options={{
                        title: 'Account',
                        }}
                />
                ) : (
                    <Tabs.Screen
                    name="login"
                    options={{
                        title: 'Login',
                        }}
                />
                )
                }
                <Tabs.Screen
                    name="register"
                    options={{
                        title: 'Register',
                    }}
                />
            </Tabs>
    )
}

export default _Layout;

