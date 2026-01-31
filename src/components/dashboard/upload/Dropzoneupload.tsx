import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface DropzoneUploadProps {
    progress: number;
    handleReset: () => void;
}

const DropzoneUpload = ({ progress, handleReset }: DropzoneUploadProps) => {
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
};

export default DropzoneUpload;
