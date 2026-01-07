import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";

export const useAuth = () => {
    const userContext = useContext(AuthContext);

    if (!userContext) {
        throw new Error("useTheme must be used within ThemeProvider");
    }

    return userContext;
};
