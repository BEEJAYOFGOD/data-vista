export interface Dataset {
    id: string;
    name: string;
    data: Record<string, unknown>[];
    columns: string[];
    rowCount: number;
    fileSize: number;
    createdAt: Date;
    updatedAt: Date;
}
