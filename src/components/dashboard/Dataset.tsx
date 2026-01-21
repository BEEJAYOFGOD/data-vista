import { useAppStore } from "@/lib/store";
import { DataTable } from "@/components/data-table/data-table";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/file-parser";
import { ArrowLeft, Trash2, Download, Clock } from "lucide-react";
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
import { useNavigate, useParams } from "react-router-dom";

export default function DatasetPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { datasets, removeDataset } = useAppStore();

    const dataset = datasets.find((d) => d.id === id);

    if (!dataset) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-muted-foreground">Dataset not found</p>
                <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard/datasets")}
                    className="bg-transparent"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Datasets
                </Button>
            </div>
        );
    }

    const handleDelete = () => {
        removeDataset(id);
        navigate("/dashboard/datasets");
    };

    const handleExport = () => {
        const csvContent = [
            dataset.columns.join(","),
            ...dataset.data.map((row) =>
                dataset.columns
                    .map((col) => {
                        const val = row[col];
                        if (
                            typeof val === "string" &&
                            (val.includes(",") || val.includes('"'))
                        ) {
                            return `"${val.replace(/"/g, '""')}"`;
                        }
                        return val;
                    })
                    .join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${dataset.name}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/dashboard/datasets")}
                        className="h-8 w-8"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-foreground">
                            {dataset.name}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>
                                {dataset.rowCount.toLocaleString()} rows
                            </span>
                            <span>{dataset.columns.length} columns</span>
                            <span>{formatFileSize(dataset.fileSize)}</span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(
                                    dataset.updatedAt
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        className="bg-transparent"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Delete dataset?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete &quot;
                                    {dataset.name}&quot; from your local
                                    storage. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {/* Data Table */}
            <DataTable data={dataset.data} columns={dataset.columns} />
        </div>
    );
}
