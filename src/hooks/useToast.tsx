import { toast as sonnerToast } from "sonner";

export const useToast = () => {
    return {
        success: (message: string, description?: string) => {
            sonnerToast.success(message, {
                description,
            });
        },
        error: (message: string, description?: string) => {
            sonnerToast.error(message, {
                description,
            });
        },
        info: (message: string, description?: string) => {
            sonnerToast.info(message, {
                description,
            });
        },
        warning: (message: string, description?: string) => {
            sonnerToast.warning(message, {
                description,
            });
        },
        promise: <T,>(
            promise: Promise<T>,
            messages: {
                loading: string;
                success: string | ((data: T) => string);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                error: string | ((error: any) => string);
            }
        ) => {
            return sonnerToast.promise(promise, messages);
        },
    };
};
