import type React from "react";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import type { Dataset } from "@/types/Dataset";
import { parseFile, formatFileSize } from "@/lib/file-parser";
import {
    Upload,
    FileText,
    CheckCircle2,
    AlertCircle,
    X,
    FileJson,
    Table,
} from "lucide-react";

type UploadState = "idle" | "hover" | "uploading" | "success" | "error";

interface UploadResult {
    fileName: string;
    fileSize: number;
    rowCount: number;
    columns: string[];
    data: Record<string, unknown>[];
}

export function FileDropzone() {
    const navigate = useNavigate();
    const { addDataset } = useAppStore();
    const [state, setState] = useState<UploadState>("idle");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<UploadResult | null>(null);
    const [abortController, setAbortController] =
        useState<AbortController | null>(null);

    const handleDragOver = useCallback(
        (e: React.DragEvent<HTMLLabelElement>) => {
            e.preventDefault();
            setState("hover");
        },
        [],
    );

    const handleDragLeave = useCallback(
        (e: React.DragEvent<HTMLLabelElement>) => {
            e.preventDefault();
            setState("idle");
        },
        [],
    );

    const processFile = async (file: File) => {
        // Validate file size (50MB max)
        const controller = new AbortController();
        setAbortController(controller);
        const maxSize = 50 * 1024 * 1024;

        if (file.size > maxSize) {
            setError("File size exceeds 50MB limit");
            setState("error");
            return;
        }

        // Validate file type
        const validTypes = [".csv", ".json"];
        const extension = "." + file.name.split(".").pop()?.toLowerCase();

        if (!validTypes.includes(extension)) {
            setError("Invalid file type. Please upload a CSV or JSON file.");
            setState("error");
            return;
        }

        setState("uploading");
        setProgress(0);
        setError(null);

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setProgress((prev) => Math.min(prev + 10, 90));
            }, 1000);

            // Parse file AND ensure at least 800ms passes for visual feedback
            const [parsed] = await Promise.all([
                parseFile(file),
                new Promise((resolve) => setTimeout(resolve, 8000)),
            ]);

            if (controller.signal.aborted) {
                clearInterval(progressInterval);
                return;
            }

            clearInterval(progressInterval);
            setProgress(100);

            // Validate row count (50,000 max)
            if (parsed.rowCount > 50000) {
                setError("Dataset exceeds 50,000 row limit");
                setState("error");
                return;
            }

            setResult({
                fileName: file.name,
                fileSize: file.size,
                rowCount: parsed.rowCount,
                columns: parsed.columns,
                data: parsed.data,
            });

            setState("success");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to parse file",
            );
            setState("error");
        }
    };

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            await processFile(file);
        }
    }, []);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await processFile(file);
        }
    };

    const handleSaveDataset = () => {
        if (!result) return;

        const dataset: Dataset = {
            id: crypto.randomUUID(),
            name: result.fileName.replace(/\.(csv|json)$/i, ""),
            data: result.data,
            columns: result.columns,
            rowCount: result.rowCount,
            fileSize: result.fileSize,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        addDataset(dataset);
        navigate(`/dashboard/datasets/${dataset.id}`);
    };

    const handleViewData = () => {
        if (!result) return;

        const dataset: Dataset = {
            id: crypto.randomUUID(),
            name: result.fileName.replace(/\.(csv|json)$/i, ""),
            data: result.data,
            columns: result.columns,
            rowCount: result.rowCount,
            fileSize: result.fileSize,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        addDataset(dataset);
        navigate(`/dashboard/datasets/${dataset.id}`);
    };

    const handleReset = () => {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
        }
        setState("idle");
        setProgress(0);
        setError(null);
        setResult(null);
    };

    // Success state
    if (state === "success" && result) {
        return (
            <Card className="bg-card border-success/50">
                <CardContent className="p-8">
                    <div className="flex flex-col items-center space-y-6 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                            <CheckCircle2 className="h-8 w-8 text-success" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-foreground">
                                Upload Successful!
                            </h3>
                            <p className="text-muted-foreground">
                                Your file has been processed and is ready to
                                view
                            </p>
                        </div>

                        <div className="grid w-full max-w-sm gap-4 rounded-lg bg-muted/50 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    File name
                                </span>
                                <span className="text-sm font-medium text-foreground">
                                    {result.fileName}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    File size
                                </span>
                                <span className="text-sm font-medium text-foreground">
                                    {formatFileSize(result.fileSize)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Row count
                                </span>
                                <span className="text-sm font-medium text-foreground">
                                    {result.rowCount.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Columns
                                </span>
                                <span className="text-sm font-medium text-foreground">
                                    {result.columns.length}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={handleViewData}>
                                <Table className="mr-2 h-4 w-4" />
                                View Data
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleSaveDataset}
                                className="bg-transparent"
                            >
                                Save Dataset
                            </Button>
                            <Button variant="ghost" onClick={handleReset}>
                                Upload Another
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Error state
    if (state === "error") {
        return (
            <Card className="bg-card border-destructive/50">
                <CardContent className="p-8">
                    <div className="flex flex-col items-center space-y-6 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-foreground">
                                Upload Failed
                            </h3>
                            <p className="text-destructive">{error}</p>
                        </div>

                        <Button
                            onClick={handleReset}
                            variant="outline"
                            className="bg-transparent"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Uploading state
    if (state === "uploading") {
        return (
            <Card className="bg-card">
                <CardContent className="p-8">
                    <div className="flex flex-col items-center space-y-6 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <FileText className="h-8 w-8 text-primary animate-pulse" />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold text-foreground">
                                Processing file...
                            </h3>
                            <p className="text-muted-foreground">
                                Please wait while we parse your data
                            </p>
                        </div>

                        <div className="w-full max-w-xs space-y-2">
                            <Progress value={progress} className="h-2" />
                            <p className="text-sm text-muted-foreground">
                                {progress}%
                            </p>
                        </div>

                        <Button variant="ghost" onClick={handleReset}>
                            Cancel
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Idle/Hover state - Dropzone
    return (
        <Card
            className={cn(
                "bg-card transition-all duration-200 cursor-pointer",
                state === "hover" && "border-primary bg-primary/5 scale-[1.01]",
            )}
        >
            <CardContent className="p-0">
                <label
                    htmlFor="file-upload"
                    className="block cursor-pointer"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div
                        className={cn(
                            "flex flex-col items-center justify-center space-y-6 rounded-lg border-2 border-dashed p-12 transition-colors",
                            state === "hover"
                                ? "border-primary"
                                : "border-muted-foreground/25",
                        )}
                        title="drop your image here"
                    >
                        <div
                            className={cn(
                                "flex h-20 w-20 items-center justify-center rounded-full transition-colors",
                                state === "hover"
                                    ? "bg-primary/10"
                                    : "bg-muted",
                            )}
                        >
                            <Upload
                                className={cn(
                                    "h-10 w-10 transition-colors",
                                    state === "hover"
                                        ? "text-primary"
                                        : "text-muted-foreground",
                                )}
                            />
                        </div>

                        <div className="space-y-2 text-center">
                            <h3 className="text-xl font-semibold text-foreground">
                                {state === "hover"
                                    ? "Drop your file here"
                                    : "Drag & drop your file here"}
                            </h3>
                            <p className="text-muted-foreground">
                                or click to browse from your computer
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    CSV
                                </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
                                <FileJson className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    JSON
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Maximum file size: 50MB | Maximum rows: 50,000
                        </p>
                    </div>

                    <input
                        id="file-upload"
                        type="file"
                        accept=".csv,.json"
                        onChange={handleFileSelect}
                        className="sr-only"
                    />
                </label>
            </CardContent>
        </Card>
    );
}
