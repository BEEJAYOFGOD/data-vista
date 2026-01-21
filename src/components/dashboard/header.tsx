import { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/lib/store";
import { Moon, Sun, LogOut, User, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
    const { toggleTheme } = useTheme();
    const { isOnline, setOnlineStatus } = useAppStore();

    const { user, handleLogout } = useAuth();

    useEffect(() => {
        const updateOnlineStatus = () => {
            setOnlineStatus(navigator.onLine);
        };

        window.addEventListener("online", updateOnlineStatus);
        window.addEventListener("offline", updateOnlineStatus);

        updateOnlineStatus();

        return () => {
            window.removeEventListener("online", updateOnlineStatus);
            window.removeEventListener("offline", updateOnlineStatus);
        };
    }, [setOnlineStatus]);

    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
            <div className="flex items-center gap-4">
                <h1 className="text-lg font-medium text-foreground">
                    Dashboard
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {/* Online/Offline Indicator */}
                <div
                    className={cn(
                        "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium",
                        isOnline
                            ? "bg-green-500/80 text-success"
                            : "bg-warning/10 text-warning",
                    )}
                >
                    {isOnline ? (
                        <>
                            <Wifi className="h-3 w-3" />
                            <span>Connected</span>
                        </>
                    ) : (
                        <>
                            <WifiOff className="h-3 w-3" />
                            <span>Offline</span>
                        </>
                    )}
                </div>

                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="relative h-9 w-9 rounded-full"
                        >
                            <Avatar className="h-9 w-9">
                                <AvatarImage
                                    src="/diverse-user-avatars.png"
                                    alt="User"
                                />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {user?.email?.[0]?.toLocaleUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56"
                        align="end"
                        forceMount
                    >
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    John Doe
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    john@example.com
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-destructive focus:text-destructive"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
