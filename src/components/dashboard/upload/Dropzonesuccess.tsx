import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Table } from "lucide-react";
import type { UploadResult } from "./DropzoneIdle";
import { formatFileSize } from "@/lib/file-parser";
import type { Dataset } from "@/types/Dataset";
import { useAppStore } from "@/lib/store";
import { useNavigate } from "react-router-dom";

interface DropzoneSuccessProps {
    handleReset: () => void;
    result: UploadResult;
}

const DropzoneSuccess = ({ handleReset, result }: DropzoneSuccessProps) => {
    const { addDataset } = useAppStore();
    const navigate = useNavigate();

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
        navigate(`/dashboard/datasets`);
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
        navigate(`/ dashboard / datasets / ${dataset.id}`);
    };

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
                            Your file has been processed and is ready to view
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
};

export default DropzoneSuccess;
