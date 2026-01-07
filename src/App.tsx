import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SIgnup";
import { Toaster } from "sonner";
import { useTheme } from "./context/ThemeContext";

function App() {
    const { theme } = useTheme();

    return (
        <>
            <Toaster
                position="top-right"
                richColors
                closeButton
                expand={false}
                duration={4000}
                theme={theme!}
            />
            <Routes>
                <Route path="/" element={<LoginPage />}></Route>
                <Route path="/signup" element={<SignupPage />}></Route>
            </Routes>
        </>
    );
}

export default App;
