import { FileDropzone } from "@/components/dashboard/upload/FileDropzone";

export default function UploadPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Upload Data
                </h2>
                <p className="text-muted-foreground">
                    Import CSV or JSON files to start analyzing your data
                </p>
            </div>

            <FileDropzone />

            {/* Upload Tips */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-4">
                    <h4 className="font-medium text-foreground mb-2">
                        Supported Formats
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        Upload CSV or JSON files. CSV files should have headers
                        in the first row.
                    </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                    <h4 className="font-medium text-foreground mb-2">
                        Data Limits
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        Files up to 50MB and datasets up to 50,000 rows are
                        supported for optimal performance.
                    </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                    <h4 className="font-medium text-foreground mb-2">
                        Offline Storage
                    </h4>
                    <p className="text-sm text-muted-foreground">
                        Your data is stored locally in your browser and works
                        offline. Nothing is sent to our servers.
                    </p>
                </div>
            </div>
        </div>
    );
}
