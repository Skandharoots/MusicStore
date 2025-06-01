import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from "expo-router";
 
import axios from 'axios';
import './globals.css';

export default function RootLayout() {

  axios.defaults.baseURL = "http://localhost:8222/";
  axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  axios.defaults.headers["Access-Control-Allow-Origin"] = "http://localhost:4000";
  axios.defaults.withCredentials = true;

  return ( 
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          title: 'Fancy Strings',
          headerShown: false, // Hide the header for the tabs
          headerStyle: { backgroundColor: '#f8f8f8' },
          headerTintColor: '#333',
          headerTitleStyle: { fontWeight: 'bold' },
          headerRight: () => (
            <Ionicons name="settings-outline" size={24} color="#333" style={{ marginRight: 10 }} />
          ),
        }}
      />
    </Stack>
)
}
