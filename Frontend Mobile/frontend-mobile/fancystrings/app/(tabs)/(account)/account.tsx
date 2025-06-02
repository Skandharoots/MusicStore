import ThemedButtonIrish from "@/app/components/ThemedButtonIrish";
import { useAuth } from "@/app/context/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Fragment } from "react";
import { SafeAreaView, Text, View } from "react-native";


const Account = () => {

    const { onLogout } = useAuth();
    const router = useRouter();

    const items = [
        'Orders',
        'Basket',
        'Favorites',
        'Settings',
    ];

    const logout = async () => {
        if (onLogout) {
            onLogout();
            router.navigate('/(tabs)/(account)/login');
        }
    }

    return (
        <Fragment>
            <SafeAreaView className="bg-background-light dark:bg-background-dark" />
            <SafeAreaView className="flex-1 w-['100%'] h-['100%'] bg-background-light dark:bg-background-dark items-start justify-start">
                <View className="flex-1 w-['100%'] h-['100%'] items-center justify-start bg-background-light dark:bg-background-dark " >
                    <View className="w-['95%'] h-['50%'] items-center justify-start mb-10 rounded-2xl p-8">
                            <View className="w-['100%'] flex-row h-fit pl-8 pr-8 pb-2 pt-2 mt-4 mb-4 rounded-2xl border border-shadowLink-light dark:border-shadowLink-dark">
                                <Text className="text-2xl text-text-light dark:text-text-dark font-semibold">Orders</Text>
                            </View>
                            <View className="w-['100%'] flex-row h-fit pl-8 pr-8 pb-2 pt-2 mt-4 mb-4 rounded-2xl border border-shadowLink-light dark:border-shadowLink-dark">
                                <Text className="text-2xl text-text-light dark:text-text-dark font-semibold">Basket</Text>
                            </View>
                            <View className="w-['100%'] flex-row h-fit pl-8 pr-8 pb-2 pt-2 mt-4 mb-4 rounded-2xl border border-shadowLink-light dark:border-shadowLink-dark">
                                <Text className="text-2xl text-text-light dark:text-text-dark font-semibold">Favorites</Text>
                            </View>
                            <View className="w-['100%'] flex-row h-fit pl-8 pr-8 pb-2 pt-2 mt-4 mb-4 rounded-2xl border border-shadowLink-light dark:border-shadowLink-dark">
                                <Text className="text-2xl text-text-light dark:text-text-dark font-semibold">Settings</Text>
                            </View>
                            <View className="w-['100%'] h-['100%'] items-end justify-end">
                                <ThemedButtonIrish title="Logout" icon={<Ionicons name="log-out-outline"/>} onPress={logout} />
                            </View>
                    </View>
                </View>
            </SafeAreaView>
        </Fragment>
    )
}

export default Account;