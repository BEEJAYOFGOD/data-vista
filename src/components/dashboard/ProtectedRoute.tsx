// ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";
import LoadingSpinner from "../ui/LoadingSpinner";

function ProtectedRoute({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <LoadingSpinner
                size={"lg"}
                color="purple"
                text="Loading your data..."
            />
        ); // Or your loading component
    }

    return user ? children : <Navigate to="/" replace />;
}

export default ProtectedRoute;
