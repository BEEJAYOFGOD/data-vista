import { Link } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import { generateDummyDatasets } from "@/lib/dummy-data";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Upload, BarChart3, HardDrive, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const MAX_STORAGE_MB = 100;

export default function DashboardHome() {
    const { datasets, addDataset } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);

    const loadSampleData = () => {
        setIsLoading(true);

        // Simulate loading delay for better UX
        setTimeout(() => {
            const dummyDatasets = generateDummyDatasets();
            dummyDatasets.forEach((dataset) => addDataset(dataset));
            setIsLoading(false);
            toast.success(`Loaded ${dummyDatasets.length} sample datasets`, {
                description:
                    "Sales Report, Employee Performance, and Website Analytics",
            });
        }, 500);
    };

    const stats = useMemo(() => {
        const totalRows = datasets.reduce((acc, d) => acc + d.rowCount, 0);
        const totalBytes = datasets.reduce((acc, d) => acc + d.fileSize, 0);
        const totalMB = Math.round((totalBytes / (1024 * 1024)) * 100) / 100;

        // Count recent uploads (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentUploads = datasets.filter(
            (d) => new Date(d.createdAt) > sevenDaysAgo
        ).length;

        return [
            {
                title: "Total Datasets",
                value: datasets.length.toString(),
                description: "Saved in local storage",
                icon: Database,
            },
            {
                title: "Total Rows",
                value: totalRows.toLocaleString(),
                description: "Across all datasets",
                icon: BarChart3,
            },
            {
                title: "Storage Used",
                value: `${totalMB} MB`,
                description: `Of ${MAX_STORAGE_MB} MB available`,
                icon: HardDrive,
            },
            {
                title: "Recent Uploads",
                value: recentUploads.toString(),
                description: "In the last 7 days",
                icon: Upload,
            },
        ];
    }, [datasets]);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Welcome to DataVista
                    </h2>
                    <p className="text-muted-foreground">
                        Your offline-first analytics workspace. Upload,
                        transform, and visualize your data.
                    </p>
                </div>

                {datasets.length === 0 && (
                    <Button
                        onClick={loadSampleData}
                        disabled={isLoading}
                        variant="outline"
                        className="gap-2 bg-transparent"
                    >
                        <Sparkles className="h-4 w-4" />
                        {isLoading ? "Loading..." : "Load Sample Data"}
                    </Button>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="bg-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">
                                {stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link to="/dashboard/upload">
                    <Card className="bg-card hover:bg-sidebar-accent/50 transition-colors cursor-pointer h-full">
                        <CardHeader>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <Upload className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-foreground">
                                Upload Data
                            </CardTitle>
                            <CardDescription>
                                Import CSV or JSON files to start analyzing your
                                data
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link to="/dashboard/datasets">
                    <Card className="bg-card hover:bg-sidebar-accent/50 transition-colors cursor-pointer h-full">
                        <CardHeader>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                                <Database className="h-5 w-5 text-success" />
                            </div>
                            <CardTitle className="text-foreground">
                                View Datasets
                            </CardTitle>
                            <CardDescription>
                                Browse and manage your saved datasets
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>

                <Link to="/dashboard/visualizations">
                    <Card className="bg-card hover:bg-sidebar-accent/50 transition-colors cursor-pointer h-full">
                        <CardHeader>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                                <BarChart3 className="h-5 w-5 text-chart-3" />
                            </div>
                            <CardTitle className="text-foreground">
                                Create Visualization
                            </CardTitle>
                            <CardDescription>
                                Build interactive charts from your data
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            </div>

            {/* Getting Started */}
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle className="text-foreground">
                        Getting Started
                    </CardTitle>
                    <CardDescription>
                        Follow these steps to start analyzing your data
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-start gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                1
                            </div>
                            <div>
                                <h4 className="font-medium text-foreground">
                                    Upload your data
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Drag and drop or browse for CSV/JSON files
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                2
                            </div>
                            <div>
                                <h4 className="font-medium text-foreground">
                                    Transform & filter
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Sort, filter, and group your data with ease
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                3
                            </div>
                            <div>
                                <h4 className="font-medium text-foreground">
                                    Visualize insights
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    Create beautiful charts and export your
                                    findings
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
