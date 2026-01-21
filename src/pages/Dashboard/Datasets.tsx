import { Link } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Upload } from "lucide-react";
import { DatasetCard } from "@/components/dashboard/DatasetCard";

export default function DatasetsPage() {
    const { datasets, removeDataset } = useAppStore();

    const handleDelete = (id: string) => {
        removeDataset(id);
    };

    if (datasets.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        My Datasets
                    </h2>
                    <p className="text-muted-foreground">
                        Browse and manage your saved datasets
                    </p>
                </div>

                <Card className="bg-card">
                    <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <Database className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-semibold text-foreground">
                                No datasets saved yet
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Upload a CSV or JSON file to get started with
                                your data analysis
                            </p>
                        </div>
                        <Link to="/dashboard/upload">
                            <Button>
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Data
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        My Datasets
                    </h2>
                    <p className="text-muted-foreground">
                        Browse and manage your saved datasets
                    </p>
                </div>
                <Link to="/dashboard/upload">
                    <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Data
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {datasets.map((dataset) => (
                    <DatasetCard
                        key={dataset.id}
                        dataset={dataset}
                        onDelete={handleDelete}
                    />
                ))}
            </div>
        </div>
    );
}
