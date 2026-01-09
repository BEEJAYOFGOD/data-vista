import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/lib/store";
import {
    Upload,
    Database,
    BarChart3,
    Settings,
    ChevronLeft,
    ChevronRight,
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

export function Sidebar() {
    const { pathname } = useLocation();
    const { sidebarCollapsed, toggleSidebar } = useAppStore();

    return (
        <aside
            className={cn(
                "relative flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
                sidebarCollapsed ? "w-16" : "w-64"
            )}
        >
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-sidebar-border px-4">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <BarChart3 className="h-4 w-4 text-primary-foreground" />
                    </div>
                    {!sidebarCollapsed && (
                        <span className="text-lg font-semibold text-sidebar-foreground">
                            DataVista
                        </span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 py-4">
                <nav className="flex flex-col gap-1 px-2">
                    {navigation.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/dashboard" &&
                                pathname.startsWith("/dashboard"));
                        // const isActive = true;

                        return (
                            <Link key={item.name} to={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                        isActive &&
                                            "bg-sidebar-accent text-sidebar-accent-foreground",
                                        sidebarCollapsed &&
                                            "justify-center px-2"
                                    )}
                                >
                                    <item.icon className="h-4 w-4 shrink-0" />
                                    {!sidebarCollapsed && (
                                        <span>{item.name}</span>
                                    )}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            {/* Collapse Button */}
            <div className="border-t border-sidebar-border p-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className={cn(
                        "w-full text-sidebar-foreground hover:bg-sidebar-accent",
                        sidebarCollapsed && "justify-center"
                    )}
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                    ) : (
                        <>
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            <span>Collapse</span>
                        </>
                    )}
                </Button>
            </div>
        </aside>
    );
}
