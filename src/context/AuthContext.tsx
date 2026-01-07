import { createContext } from "react";
import { AuthError, type Session, type User } from "@supabase/supabase-js";
import type { AuthContextType } from "./types";

export type SignupParams = {
    email: string;
    password: string;
};

// type SignupResponse = Promise<{ data: any; error: any }>;

export type SignupResponse = Promise<{
    data: { user: User | null; session: Session | null };
    error: AuthError | null;
}>;

export const AuthContext = createContext<AuthContextType | null>(null);
