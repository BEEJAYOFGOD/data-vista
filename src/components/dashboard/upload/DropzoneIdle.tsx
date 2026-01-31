import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, FileJson } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

export type UploadState = "idle" | "hover" | "uploading" | "success" | "error";

export interface UploadResult {
    fileName: string;
    fileSize: number;
    rowCount: number;
    columns: string[];
    data: Record<string, unknown>[];
}

interface DropZoneIdleProps {
    state: string;
    setState: (state: UploadState) => void;
    processFile: (file: File) => Promise<void>;
}

const DropzoneIdle = ({ state, setState, processFile }: DropZoneIdleProps) => {

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            await processFile(file);
        }
    };

    const handleDragOver = useCallback(
        (e: React.DragEvent<HTMLLabelElement>) => {
            e.preventDefault();
            setState("hover");
        },

        [setState],
    );

    const handleDragLeave = useCallback(
        (e: React.DragEvent<HTMLLabelElement>) => {
            e.preventDefault();
            setState("idle");
        },
        [setState],
    );

    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
                await processFile(file);
            }
        },

        [processFile],
    );

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
};

export default DropzoneIdle;
