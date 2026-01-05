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

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

            <Card className="w-full max-w-md glass border-white/10 relative z-10">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-mono tracking-tight text-primary">
                        DataVista AI
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Enter your credentials to access your analytics
                        dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            className="bg-white/5 border-white/10 focus:border-primary transition-colors"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/forgot-password"
                                className="text-xs text-primary hover:underline transition-all"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            className="bg-white/5 border-white/10 focus:border-primary transition-colors"
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="remember"
                            className="border-white/20 data-[state=checked]:bg-primary"
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
                    <Link href="/dashboard" className="w-full">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                            Sign In
                        </Button>
                    </Link>
                    <div className="text-center text-sm">
                        {"Don't have an account? "}
                        <Link
                            href="/signup"
                            className="text-primary hover:underline transition-all"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
