import { Link } from "react-router-dom";
import { Database, Trash2, Clock } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import type { Dataset } from "@/types/Dataset";
import { formatFileSize } from "@/lib/file-parser";

interface DatasetCardProps {
    dataset: Dataset;
    onDelete: (id: string) => void;
}

export function DatasetCard({ dataset, onDelete }: DatasetCardProps) {
    return (
        <Card className="bg-card hover:bg-sidebar-accent/30 transition-colors group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Database className="h-5 w-5 text-primary" />
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
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
                                    storage.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>

                                <AlertDialogAction
                                    onClick={() => onDelete(dataset.id)}
                                    // className="text-destructive-foreground hover:bg-red-500!"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <CardTitle className="mt-3">{dataset.name}</CardTitle>
                <CardDescription>
                    {dataset.rowCount.toLocaleString()} rows
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{formatFileSize(dataset.fileSize)}</span>
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(dataset.updatedAt).toLocaleDateString()}
                    </span>
                </div>
                <Button
                    variant="outline"
                    className="w-full text-foreground hover:text-foreground/80"
                    asChild
                >
                    <Link to={`/dashboard/datasets/${dataset.id}`}>
                        Open Dataset
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
