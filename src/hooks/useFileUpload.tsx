// hooks/useFileUpload.ts
import { useState, useCallback } from "react";
import { parseFile } from "@/lib/file-parser";
import type { UploadState } from "@/components/dashboard/upload/DropzoneIdle";
import type { UploadResult } from "@/components/dashboard/upload/DropzoneIdle";
import { toast } from "sonner";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_ROWS = 50000;
const VALID_TYPES = [".csv", ".json"];

export function useFileUpload() {
    const [state, setState] = useState<UploadState>("idle");
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<UploadResult | null>(null);

    const [abortController, setAbortController] =
        useState<AbortController | null>(null);

    const validateFile = (file: File): string | null => {
        if (file.size > MAX_FILE_SIZE) {
            return "File size exceeds 50MB limit";
        }

        const extension = "." + file.name.split(".").pop()?.toLowerCase();

        if (!VALID_TYPES.includes(extension)) {
            return "Invalid file type. Please upload a CSV or JSON file.";
        }

        return null;
    };

    const processFile = useCallback(async (file: File) => {
        const validationError = validateFile(file);

        if (validationError) {
            setError(validationError);
            setState("error");
            return;
        }

        const controller = new AbortController();
        setAbortController(controller);
        setState("uploading");
        setProgress(0);
        setError(null);

        const progressInterval = setInterval(() => {
            if (controller.signal.aborted) {
                clearInterval(progressInterval);
                return;
            }
            setProgress((prev) => Math.min(prev + 10, 90));
        }, 1000);

        try {
            const [parsed] = await Promise.all([
                parseFile(file),
            ]);

            clearInterval(progressInterval);
            setProgress(100);

            if (parsed.rowCount > MAX_ROWS) {
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
            if (!controller.signal.aborted) {
                setError(
                    err instanceof Error ? err.message : "Failed to parse file",
                );
                setState("error");
            }

            toast.error(error);
        }
    }, []);

    const reset = useCallback(() => {
        if (abortController) {
            abortController.abort();
            setAbortController(null);
        }

        setState("idle");
        setProgress(0);
        setError(null);
        setResult(null);
    }, [abortController]);

    return {
        state,
        progress,
        error,
        result,
        processFile,
        reset,
        setState,
    };
}
