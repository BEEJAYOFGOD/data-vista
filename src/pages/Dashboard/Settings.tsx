import { useState, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAppStore } from "@/lib/store";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Moon,
    Sun,
    Monitor,
    Trash2,
    Download,
    HardDrive,
    Database,
} from "lucide-react";

const MAX_STORAGE_MB = 100;

export default function SettingsPage() {
    const { theme, toggleTheme } = useTheme();
    const { datasets } = useAppStore();
    const [chartAnimations, setChartAnimations] = useState(true);
    const [autoSave, setAutoSave] = useState(true);

    // Calculate storage usage
    const storageUsage = useMemo(() => {
        const totalBytes = datasets.reduce((acc, dataset) => {
            return acc + JSON.stringify(dataset.data).length * 2; // Approximate UTF-16 encoding
        }, 0);
        const totalMB = totalBytes / (1024 * 1024);
        return {
            usedMB: Math.round(totalMB * 100) / 100,
            percentage: Math.min((totalMB / MAX_STORAGE_MB) * 100, 100),
        };
    }, [datasets]);

    const handleClearAllData = () => {
        localStorage.removeItem("datavista-storage");
        window.location.reload();
    };

    const handleExportAllData = () => {
        const exportData = {
            exportedAt: new Date().toISOString(),
            datasets: datasets.map((d) => ({
                name: d.name,
                columns: d.columns,
                data: d.data,
                rowCount: d.rowCount,
                createdAt: d.createdAt,
                updatedAt: d.updatedAt,
            })),
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: "application/json",
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `datavista-export-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <main className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Settings
                </h2>
                <p className="text-muted-foreground">
                    Manage your preferences and data
                </p>
            </div>

            <div className="grid gap-6">
                {/* Appearance */}
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-foreground">
                            Appearance
                        </CardTitle>
                        <CardDescription>
                            Customize how DataVista looks on your device
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <Label>Theme</Label>
                            <div className="grid grid-cols-3 gap-3">
                                <Button
                                    variant={
                                        theme === "dark" ? "outline" : "default"
                                    }
                                    className={
                                        theme !== "light"
                                            ? "bg-transparent hover:text-white"
                                            : ""
                                    }
                                    onClick={() => toggleTheme()}
                                >
                                    <Sun className="mr-2 h-4 w-4" />
                                    Light
                                </Button>
                                <Button
                                    variant={
                                        theme === "dark" ? "default" : "outline"
                                    }
                                    className={
                                        theme !== "dark" ? "bg-transparent" : ""
                                    }
                                    onClick={() => toggleTheme()}
                                >
                                    <Moon className="mr-2 h-4 w-4" />
                                    Dark
                                </Button>
                                <Button
                                    variant={
                                        theme === "dark" ? "default" : "outline"
                                    }
                                    className={
                                        theme !== "dark" ? "bg-transparent" : ""
                                    }
                                    onClick={() => toggleTheme()}
                                >
                                    <Monitor className="mr-2 h-4 w-4" />
                                    System
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance */}
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-foreground">
                            Performance
                        </CardTitle>
                        <CardDescription>
                            Configure performance-related settings
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="chart-animations">
                                    Chart Animations
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Enable smooth animations in charts
                                </p>
                            </div>
                            <Switch
                                id="chart-animations"
                                checked={chartAnimations}
                                onCheckedChange={setChartAnimations}
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="auto-save">Auto-save</Label>
                                <p className="text-sm text-muted-foreground">
                                    Automatically save changes to local storage
                                </p>
                            </div>
                            <Switch
                                id="auto-save"
                                checked={autoSave}
                                onCheckedChange={setAutoSave}
                            />
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <Label>Default Rows Per Page</Label>
                            <Select defaultValue="50">
                                <SelectTrigger className="w-[200px] bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="50">50 rows</SelectItem>
                                    <SelectItem value="100">
                                        100 rows
                                    </SelectItem>
                                    <SelectItem value="500">
                                        500 rows
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Data Management */}
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-foreground">
                            Data Management
                        </CardTitle>
                        <CardDescription>
                            Manage your stored datasets and local storage
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Storage Usage */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                                    <Label>Storage Usage</Label>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    {storageUsage.usedMB} MB of {MAX_STORAGE_MB}{" "}
                                    MB
                                </span>
                            </div>
                            <Progress
                                value={storageUsage.percentage}
                                className="h-2"
                            />
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Database className="h-4 w-4" />
                                <span>
                                    {datasets.length} dataset
                                    {datasets.length !== 1 ? "s" : ""} saved
                                </span>
                            </div>
                        </div>

                        <Separator />

                        {/* Actions */}
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                variant="outline"
                                onClick={handleExportAllData}
                                disabled={datasets.length === 0}
                                className="bg-transparent"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Export All Data
                            </Button>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="destructive"
                                        disabled={datasets.length === 0}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Clear All Data
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Clear all data?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently delete all
                                            your saved datasets and settings.
                                            This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-transparent">
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleClearAllData}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                            Clear All Data
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>

                {/* About */}
                <Card className="bg-card">
                    <CardHeader>
                        <CardTitle className="text-foreground">
                            About DataVista
                        </CardTitle>
                        <CardDescription>
                            Offline-First Analytics Workspace
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm text-muted-foreground">
                            <p>
                                DataVista is a high-performance web application
                                that allows you to upload, transform, visualize,
                                and analyze datasets entirely in the browser
                                with full offline capabilities.
                            </p>
                            <div className="grid gap-2">
                                <div className="flex justify-between">
                                    <span>Version</span>
                                    <span className="text-foreground">
                                        1.0.0
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Max File Size</span>
                                    <span className="text-foreground">
                                        50 MB
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Max Rows</span>
                                    <span className="text-foreground">
                                        50,000
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Supported Formats</span>
                                    <span className="text-foreground">
                                        CSV, JSON
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
