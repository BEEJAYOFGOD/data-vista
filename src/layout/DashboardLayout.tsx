import type React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/header";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";
import { Outlet } from "react-router-dom";
// import { useAppStore } from "@/lib/store";

export default function DashboardLayout() {
    // const { sidebarCollapsed } = useAppStore();

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex">
                <Sidebar />
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header with Mobile Sidebar */}
                <div className="flex items-center gap-4 border-b border-border bg-background px-4 lg:hidden">
                    <MobileSidebar />
                    <div className="flex h-16 flex-1 items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                                <span className="text-xs font-bold text-primary-foreground">
                                    DV
                                </span>
                            </div>
                            <span className="font-semibold">DataVista</span>
                        </div>
                    </div>
                </div>

                {/* Desktop Header */}
                <div className="hidden lg:block">
                    <Header />
                </div>

                {/* Page Content */}
                <main className="flex-1 overflow-auto">
                    <div className="container mx-auto p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
