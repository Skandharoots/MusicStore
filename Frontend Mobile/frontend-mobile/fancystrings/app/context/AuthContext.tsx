import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useState } from "react";

interface AuthProps {
    authState?: { 
        userName: string | null, 
        token: string | null, 
        authenticated: boolean | null, 
        validUntil?: number | null, 
        refreshUntil?: number | null, 
        refreshToken?: string | null 
    };
    onRegister?: (firstName: string, lastName: string, email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "jwt_token";
const REFRESH_TOKEN = "refresh_token";
const REFRESH_UNTIL = "refresh_until";
const VALID_UNTIL = "valid_until";
const USER_NAME = "user_name";
export const API_URL = "http://localhost:8222";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}: any) => {
    const [authState, setAuthState] = useState<{
        userName: string | null,
        token: string | null,
        authenticated: boolean | null,
        validUntil?: number | null,
        refreshUntil?: number | null,
        refreshToken?: string | null,
    }>({
        userName: null,
        token: null,
        authenticated: null,
        validUntil: null,
        refreshUntil: null,
        refreshToken: null
    });

    const login = async (email: string, password: string) => {
        try {
            const result = await axios.post(`${API_URL}/api/users/login`, {
                email,
                password
            });
            console.info(result);
            const userName = result.data.firstName;
            const token = result.data.token;
            const refreshToken = result.data.refreshToken;
            const valid = new Date().getTime() + 1000 * 60 * 60 * 24; // 1 day validity
            const refreshUntil = new Date().getTime() + 1000 * 60 * 60 * 24 * 31; // 30 days validity for refresh token
            setAuthState({
                userName,
                token,
                authenticated: true,
                validUntil: valid,
                refreshUntil: refreshUntil,
                refreshToken: refreshToken
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            await SecureStore.setItemAsync(USER_NAME, userName);
            await SecureStore.setItemAsync(VALID_UNTIL, valid.toString());
            await SecureStore.setItemAsync(TOKEN_KEY, token);
            await SecureStore.setItemAsync(REFRESH_UNTIL, refreshUntil.toString());
            await SecureStore.setItemAsync(REFRESH_TOKEN, refreshToken);

        } catch (error) {
            return { error: true, msg: (error as any).response.data.message }
        }
    };

    const register = async (firstName: string, lastName: string, email: string, password: string) => {
        try {
            return await axios.post(`${API_URL}/api/users/register`, {
                firstName,
                lastName,
                email,
                password
            });
        } catch (error) {
            return { error: true, msg: (error as any).response.data.message }
        }
    }

    const refresh = async (refreshToken: string) => {
        try {
            const result = await axios.post(`${API_URL}/api/users/refresh-token`, {}, {
                headers: {
                    'Authorization': `Bearer ${refreshToken}`
                }
            });

            const token = result.data.token;
            const valid = new Date().getTime() + 1000 * 60 * 60 * 24; // 1 day validity
            
            setAuthState((prevState) => ({
                ...prevState,
                token,
                validUntil: valid
            }));

        } catch (error) {
            return { error: true, msg: (error as any).response.data.message }
        }
        
    }

    const checkActive = async () => {
        const valid = await SecureStore.getItemAsync(VALID_UNTIL);
        const refreshUntil = await SecureStore.getItemAsync(REFRESH_UNTIL);
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN);
        let now = new Date().getTime();

        if (refreshUntil && parseInt(refreshUntil) < now) {
            logout();
        } else {
            if (valid && parseInt(valid) < now && refreshToken) {
                await refresh(refreshToken);
            }
        }

    }

    const logout = async () => {

        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(USER_NAME);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN);
        await SecureStore.deleteItemAsync(VALID_UNTIL);
        await SecureStore.deleteItemAsync(REFRESH_UNTIL);

        axios.defaults.headers.common['Authorization'] = '';

        setAuthState({
            userName: null,
            token: null,
            authenticated: null,
            validUntil: null,
            refreshUntil: null,
            refreshToken: null
        });
    }

    const value = {
        onRegister: register,
        onLogin: login,
        onRefresh: checkActive,
        onLogout: logout,
        authState
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};