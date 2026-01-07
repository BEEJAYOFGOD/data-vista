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
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { validateField, calculatePasswordStrength } from "@/lib/utils";
import { EyeIcon, EyeOff } from "lucide-react";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const { handleSignup } = useAuth();
    const toast = useToast();

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<{
        strength: "weak" | "medium" | "strong" | "very-strong";
        score: number;
    }>({ strength: "weak", score: 0 });
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

        // Update password strength in real-time
        if (name === "password") {
            setPasswordStrength(calculatePasswordStrength(value));
        }

        // Validate confirm password when password changes
        if (name === "password" && formData.confirmPassword) {
            const confirmError = validateField(
                "confirmPassword",
                formData.confirmPassword,
                formData
            );

            if (confirmError) {
                setErrors((prev) => ({
                    ...prev,
                    confirmPassword: confirmError,
                }));
            } else {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.confirmPassword;
                    return newErrors;
                });
            }
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
                formData
            );
            if (error) newErrors[key] = error;
        });

        if (!termsAccepted) {
            newErrors.terms = "You must accept the terms and conditions";
        }

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

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await handleSignup({
                email: formData.email.trim(),
                password: formData.password,
            });

            toast.success("Account created successfully! Check your email.");

            // Reset form on success
            setFormData({
                email: "",
                password: "",
                confirmPassword: "",
            });

            setTermsAccepted(false);
            setPasswordStrength({ strength: "weak", score: 0 });
        } catch (error: any) {
            console.log(error);
            toast.error(error.message || "Failed to create account");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get password strength color
    const getStrengthColor = () => {
        switch (passwordStrength.strength) {
            case "weak":
                return "bg-red-500";
            case "medium":
                return "bg-yellow-500";
            case "strong":
                return "bg-blue-500";
            case "very-strong":
                return "bg-green-500";
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            <Card className="w-full max-w-md md:max-w-lg glass border-white/10 relative z-10">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-mono tracking-tight text-primary">
                        DataVista
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Create an account to start analyzing your data
                    </CardDescription>
                </CardHeader>
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
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
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
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <EyeIcon className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 mb-2">
                                    {errors.password}
                                </p>
                            )}

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <>
                                    <div className="flex gap-1 mt-2">
                                        {[...Array(4)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all ${
                                                    i < passwordStrength.score
                                                        ? getStrengthColor()
                                                        : "bg-primary/20"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground capitalize">
                                        Password strength:{" "}
                                        {passwordStrength.strength}
                                    </p>
                                </>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirm Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="bg-white/5 border-white/10 pr-10"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <EyeIcon className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center mb-2 space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={termsAccepted}
                                    onCheckedChange={(checked) =>
                                        setTermsAccepted(checked as boolean)
                                    }
                                    className="border-white/20 data-[state=checked]:bg-primary"
                                    disabled={isSubmitting}
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    I agree to the{" "}
                                    <Link
                                        to="/terms"
                                        className="text-primary hover:underline transition-all"
                                    >
                                        terms and conditions
                                    </Link>
                                </label>
                            </div>
                            {errors.terms && (
                                <p className="text-xs text-red-500">
                                    {errors.terms}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? "Creating Account..."
                                : "Create Account"}
                        </Button>

                        <div className="text-center text-sm">
                            Already have an account?{" "}
                            <Link
                                to="/"
                                className="text-primary hover:underline transition-all"
                            >
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
