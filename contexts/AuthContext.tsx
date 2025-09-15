import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { logEvent } from '../services/analyticsService';

interface LocalUser {
    name: string;
    sub: string; // Unique, persistent, anonymous ID
}

interface AuthContextType {
    user: LocalUser | null;
    signIn: () => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_SESSION_KEY = 'local-auth-user-session';
const ANONYMOUS_USER_ID_KEY = 'anonymous-user-id-v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<LocalUser | null>(null);

    useEffect(() => {
        const storedUserJSON = sessionStorage.getItem(USER_SESSION_KEY);
        if (storedUserJSON) {
            try {
                setUser(JSON.parse(storedUserJSON));
            } catch (error) {
                console.error("Could not parse stored user:", error);
                sessionStorage.removeItem(USER_SESSION_KEY);
            }
        }
    }, []);
    
    const signIn = useCallback(() => {
        try {
            let anonymousId = localStorage.getItem(ANONYMOUS_USER_ID_KEY);
            if (!anonymousId) {
                anonymousId = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
                localStorage.setItem(ANONYMOUS_USER_ID_KEY, anonymousId);
            }

            const newUser: LocalUser = {
                sub: anonymousId,
                name: 'Gebruiker',
            };

            sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(newUser));
            setUser(newUser);
            logEvent('user_login', { userId: newUser.sub });
        } catch (error) {
            console.error("Sign in failed:", error);
        }
    }, []);

    const signOut = useCallback(() => {
        if (user) {
            sessionStorage.removeItem(USER_SESSION_KEY);
            setUser(null);
            logEvent('user_logout', { userId: user.sub });
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};