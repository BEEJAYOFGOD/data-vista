import type { User, Session, AuthError } from "@supabase/supabase-js";

export type SignupParams = {
    email: string;
    password: string;
};

export type SignupResponse = Promise<{
    data: { user: User | null; session: Session | null };
    error: AuthError | null;
}>;

export interface AuthContextType {
    user: User | null;
    handleLogin: (params: SignupParams) => SignupResponse;
    handleSignup: (params: SignupParams) => SignupResponse;
    handleLogout: () => Promise<void>;
    loading: boolean;
}
