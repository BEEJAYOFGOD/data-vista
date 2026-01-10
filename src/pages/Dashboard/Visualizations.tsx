import { Link } from "react-router-dom";
import { useAppStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChartVisualization } from "@/components/charts/chart-container";
import { BarChart3, Upload, Database } from "lucide-react";
import { useState } from "react";

export default function VisualizationsPage() {
    const { datasets } = useAppStore();
    const [selectedDatasetId, setSelectedDatasetId] = useState<string>("");

    const selectedDataset = datasets.find((d) => d.id === selectedDatasetId);

    if (datasets.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Visualizations
                    </h2>
                    <p className="text-muted-foreground">
                        Create interactive charts from your data
                    </p>
                </div>

                <Card className="bg-card">
                    <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                            <BarChart3 className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-semibold text-foreground">
                                No datasets available
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Upload a dataset first to start creating
                                visualizations
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
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Visualizations
                    </h2>
                    <p className="text-muted-foreground">
                        Create interactive charts from your data
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <Select
                        value={selectedDatasetId}
                        onValueChange={setSelectedDatasetId}
                    >
                        <SelectTrigger className="w-[200px] bg-background">
                            <SelectValue placeholder="Select dataset" />
                        </SelectTrigger>
                        <SelectContent>
                            {datasets.map((dataset) => (
                                <SelectItem key={dataset.id} value={dataset.id}>
                                    {dataset.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {selectedDataset ? (
                <ChartVisualization dataset={selectedDataset} />
            ) : (
                <Card className="bg-card">
                    <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <BarChart3 className="h-8 w-8 text-primary" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="font-semibold text-foreground">
                                Select a dataset
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                Choose a dataset from the dropdown above to
                                start creating visualizations
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
