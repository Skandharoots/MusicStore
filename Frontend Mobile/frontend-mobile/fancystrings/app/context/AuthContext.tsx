import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthProps {
    authState?: { 
        userName: string | null,
        userUuid: string | null
        token: string | null,
        authenticated: boolean | null,
        validUntil?: number | null,
        refreshUntil?: number | null,
        refreshToken?: string | null
    };
    onRegister?: (firstName: string, lastName: string, email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onRefresh?: (refreshToken: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = "jwt_token";
const REFRESH_TOKEN = "refresh_token";
const REFRESH_UNTIL = "refresh_until";
const VALID_UNTIL = "valid_until";
const USER_NAME = "user_name";
const UUID = "user_uuid";
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({children}: any) => {
    
    const [authState, setAuthState] = useState<{
        userName: string | null,
        userUuid: string | null,
        token: string | null,
        authenticated: boolean | null,
        validUntil?: number | null,
        refreshUntil?: number | null,
        refreshToken?: string | null,
    }>({
        userName: null,
        userUuid: null,
        token: null,
        authenticated: null,
        validUntil: null,
        refreshUntil: null,
        refreshToken: null,
    });

    useEffect(() => {
        const loadUser = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            const user = await SecureStore.getItemAsync(USER_NAME);
            const uuid = await SecureStore.getItemAsync(UUID);
            const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN);
            const valid = await SecureStore.getItemAsync(VALID_UNTIL);
            const refresh = await SecureStore.getItemAsync(REFRESH_UNTIL);
            if (token && user && uuid && refreshToken && valid && refresh) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({
                    userName: user,
                    userUuid: uuid,
                    token: token,
                    authenticated: true,
                    validUntil: parseInt(valid),
                    refreshUntil: parseInt(refresh),
                    refreshToken: refreshToken,
                })
            }
        };
        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const xsrf = await axios.get('/api/users/csrf/token');
            const result = await axios.post(`/api/users/login`, {
                email,
                password
            }, {
                headers: {
                    'X-XSRF-TOKEN': xsrf.data.token,
                }
            });

            const valid = Date.now() + (1000 * 60 * 60 * 24); // 1 day validity
            const refreshUntil = Date.now() + (1000 * 60 * 60 * 24 * 31); // 30 days validity for refresh token
            setAuthState({
                userName: result.data.firstName,
                userUuid: result.data.uuid,
                token: result.data.token,
                authenticated: true,
                validUntil: valid,
                refreshUntil: refreshUntil,
                refreshToken: result.data.refreshToken,
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;

            await SecureStore.setItemAsync(USER_NAME, result.data.firstName);
            await SecureStore.setItemAsync(UUID, result.data.uuid);
            await SecureStore.setItemAsync(VALID_UNTIL, valid.toString());
            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
            await SecureStore.setItemAsync(REFRESH_UNTIL, refreshUntil.toString());
            await SecureStore.setItemAsync(REFRESH_TOKEN, result.data.refreshToken);

            return result;
        } catch (error) {
            return { error: true, msg: (error as any).response.data.message }
        }
    };

    const register = async (firstName: string, lastName: string, email: string, password: string) => {
        try {
            const xsrf = await axios.get('/api/users/csrf/token');
            return await axios.post(`/api/users/register`, {
                firstName,
                lastName,
                email,
                password
            }, {
                headers: {
                    'X-XSRF-TOKEN': xsrf.data.token,
                }
            });
        } catch (error) {
            return { error: true, msg: (error as any).response.data.message }
        }
    }

    const refresh = async (refreshToken: string) => {
        try {
            const result = await axios.post(`/api/users/refresh-token`, {}, {
                headers: {
                    'Authorization': `Bearer ${refreshToken}`
                }
            });

            const token = result.data.token;
            const valid = Date.now() + (1000 * 60 * 60 * 24); // 1 day validity
            
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
        await SecureStore.deleteItemAsync(UUID);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN);
        await SecureStore.deleteItemAsync(VALID_UNTIL);
        await SecureStore.deleteItemAsync(REFRESH_UNTIL);

        axios.defaults.headers.common['Authorization'] = '';

        setAuthState({
            userName: null,
            userUuid: null,
            token: null,
            authenticated: null,
            validUntil: null,
            refreshUntil: null,
            refreshToken: null
        })
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

export default AuthProvider;