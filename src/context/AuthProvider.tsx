import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { AuthContext } from "./AuthContext";
import type { AuthContextType, SignupParams, SignupResponse } from "./types";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<AuthContextType["user"]>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async ({
        email,
        password,
    }: SignupParams): SignupResponse => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (data.user) setUser(data.user);
        return { data, error };
    };

    const handleSignup = async ({
        email,
        password,
    }: SignupParams): SignupResponse => {
        const { data, error } = await supabase.auth.signUp({ email, password });

        console.log(data);
        console.log(error);
        if (data.user) setUser(data.user);
        return { data, error };
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        handleLogin,
        handleSignup,
        handleLogout,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <p>loading</p> : children}
        </AuthContext.Provider>
    );
};
