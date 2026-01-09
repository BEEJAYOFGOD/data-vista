"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!email) {
            setError("Please enter your email address");
            setIsLoading(false);
            return;
        }

        if (!email.includes("@")) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        // Success
        setSuccess(true);
        setIsLoading(false);
    };

    if (success) {
        return (
            <Card className="w-full max-w-md bg-card">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                            <CheckCircle2 className="h-6 w-6 text-success" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold text-foreground">
                                Check your email
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                We&apos;ve sent a password reset link to{" "}
                                <strong>{email}</strong>
                            </p>
                        </div>
                        <Link href="/login">
                            <Button
                                variant="outline"
                                className="mt-4 bg-transparent"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to login
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md bg-card">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-foreground">
                    Reset password
                </CardTitle>
                <CardDescription>
                    Enter your email address and we&apos;ll send you a link to
                    reset your password
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            autoComplete="email"
                        />
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Send reset link
                    </Button>
                    <Link href="/login" className="w-full">
                        <Button variant="ghost" className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to login
                        </Button>
                    </Link>
                </CardFooter>
            </form>
        </Card>
    );
}
