import React, { createContext, useEffect, useReducer } from 'react';
import axios from 'axios.js';
import { MatxLoading } from 'app/components';

import api from '../../api';

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
}


const setSession = (token) => {
    if (token) {
        localStorage.setItem('accessToken', token)
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
        localStorage.removeItem('accessToken')
        delete axios.defaults.headers.common.Authorization
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT': {
            const { isAuthenticated, user } = action.payload;

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        case 'LOGIN': {
            const { user } = action.payload;

            return {
                ...state,
                isAuthenticated: true,
                user
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        case 'REGISTER': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        default: {
            return { ...state }
        }
    }
};

const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    login: () => Promise.resolve(),
    logout: () => { }
});

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const login = async (email, password) => {
        const response = await api.user.login({ email, password });

        let { token, user, permission } = response.data.data;
        localStorage.setItem('permission', JSON.stringify(permission));
        setSession(token);

        user.role = "Admin"
        dispatch({
            type: 'LOGIN',
            payload: {
                user
            },
        });
    };

    const logout = () => {
        setSession(null)
        dispatch({ type: 'LOGOUT' })
    };

    useEffect(() => {
        ; (async () => {
            try {
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: true,
                        user: null,
                    },
                })
            } catch (err) {
                console.error(err)
                dispatch({
                    type: 'INIT',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        })()
    }, []);

    if (!state.isInitialised) {
        return <MatxLoading />
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
