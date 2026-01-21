/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { validateField } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { EyeIcon, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { handleLogin } = useAuth();
    const toast = useToast();

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value, formData);

        if (error) {
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    // Validate entire form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        Object.keys(formData).forEach((key) => {
            const error = validateField(
                key,
                formData[key as keyof typeof formData],
                formData,
            );
            if (error) newErrors[key] = error;
        });

        setErrors(newErrors);

        // Show toast for validation errors
        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fix the errors in the form");
        }

        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Add validation check BEFORE attempting login
        if (!formData.email.trim() || !formData.password) {
            toast.error("Please enter both email and password");
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await handleLogin({
                email: formData.email.trim(),
                password: formData.password,
            });

            toast.success("Log in successful");

            navigate("/dashboard", { replace: true });

            // Reset form on success
            setFormData({
                email: "",
                password: "",
            });
        } catch (error: any) {
            console.log(error);
            toast.error(error.message || "Failed to Log in");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex w-screen min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            <Card className="w-full max-w-md glass border-white/10 relative z-10">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-mono tracking-tight text-primary">
                        DataVista
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter your credentials to access your analytics
                        dashboard
                    </CardDescription>
                </CardHeader>

                {/* FIXED: Wrapped in form element */}
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>

                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                className="bg-white/5 border-white/10"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                disabled={isSubmitting}
                                required
                                autoComplete="email"
                            />

                            {errors.email && (
                                <p className="text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    to="/forgot-password"
                                    className="text-xs text-primary hover:underline transition-all"
                                    tabIndex={-1}
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    className="bg-white/5 border-white/10 pr-10"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    disabled={isSubmitting}
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <EyeIcon className="h-4 w-4" />
                                    )}
                                </button>
                            </div>

                            {errors.password && (
                                <p className="text-xs text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                className="border-white/20 data-[state=checked]:bg-red-500"
                            />
                            <label
                                htmlFor="remember"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                Remember me
                            </label>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing in..." : "Sign In"}
                        </Button>

                        <div className="text-center text-sm">
                            {"Don't have an account? "}
                            <Link
                                to="/signup"
                                className="text-primary hover:underline transition-all"
                            >
                                Sign up
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
