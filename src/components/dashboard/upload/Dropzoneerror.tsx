import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, X } from "lucide-react";

interface DropzoneErrorProps {
    error: string | null;
    handleReset: () => void;
}

const DropzoneError = ({ error, handleReset }: DropzoneErrorProps) => {
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
};

export default DropzoneError;
