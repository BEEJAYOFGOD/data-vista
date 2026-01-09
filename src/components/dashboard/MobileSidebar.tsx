import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    Upload,
    Database,
    BarChart3,
    Settings,
    Menu,
    LayoutDashboard,
} from "lucide-react";

const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Upload Data", href: "/dashboard/upload", icon: Upload },
    { name: "My Datasets", href: "/dashboard/datasets", icon: Database },
    {
        name: "Visualizations",
        href: "/dashboard/visualizations",
        icon: BarChart3,
    },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function MobileSidebar() {
    const [open, setOpen] = useState(false);
    const { pathname } = useLocation();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-border px-4">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2"
                        onClick={() => setOpen(false)}
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <BarChart3 className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-semibold">DataVista</span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1 p-4">
                    {navigation.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" &&
                                pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                onClick={() => setOpen(false)}
                            >
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3",
                                        isActive && "bg-accent"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
