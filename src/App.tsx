import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/SIgnup";
import { Toaster } from "sonner";
import { useTheme } from "./context/ThemeContext";
import DashboardLayout from "./layout/DashboardLayout";
import ProtectedRoute from "./components/dashboard/ProtectedRoute";
import DashboardHome from "./pages/Dashboard/Overview";
import UploadPage from "./pages/Dashboard/Upload";
import VisualizationsPage from "./pages/Dashboard/Visualizations";

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
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardHome />} />
                    <Route path="upload" element={<UploadPage />} />
                    <Route
                        path="visualizations"
                        element={<VisualizationsPage />}
                    />
                    {/* <Route path="/signup" element={<SignupPage />}></Route> */}
                </Route>
            </Routes>
        </>
    );
}

export default App;
