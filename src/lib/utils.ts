import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const validateField = (
    name: string,
    value: string,
    formData: { email: string; password: string; confirmPassword?: string }
): string => {
    switch (name) {
        case "firstName":
            if (!value.trim()) return "First name is required";
            if (value.trim().length < 2)
                return "First name must be at least 2 characters";
            if (!/^[a-zA-Z\s'-]+$/.test(value))
                return "First name contains invalid characters";
            return "";

        case "lastName":
            if (!value.trim()) return "Last name is required";
            if (value.trim().length < 2)
                return "Last name must be at least 2 characters";
            if (!/^[a-zA-Z\s'-]+$/.test(value))
                return "Last name contains invalid characters";
            return "";

        case "email": {
            if (!value.trim()) return "Email is required";
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) return "Invalid email address";
            return "";
        }

        case "password":
            if (!value) return "Password is required";
            if (value.length < 8)
                return "Password must be at least 8 characters";
            if (!/[A-Z]/.test(value))
                return "Password must contain an uppercase letter";
            if (!/[a-z]/.test(value))
                return "Password must contain a lowercase letter";
            if (!/\d/.test(value)) return "Password must contain a number";
            return "";

        case "confirmPassword":
            if (!value) return "Please confirm your password";
            if (value !== formData.password) return "Passwords do not match";
            return "";

        default:
            return "";
    }
};

// Get password strength color for UI
export const getPasswordStrengthColor = (
    strength: "weak" | "medium" | "strong" | "very-strong"
): string => {
    switch (strength) {
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

export const calculatePasswordStrength = (
    password: string
): {
    strength: "weak" | "medium" | "strong" | "very-strong";
    score: number;
} => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) return { strength: "weak", score };
    if (score === 2) return { strength: "medium", score };
    if (score === 3) return { strength: "strong", score };
    return { strength: "very-strong", score };
};
