
import Papa from "papaparse";

export interface ParsedData {
    columns: string[];
    data: Record<string, unknown>[];
    rowCount: number;
}



export async function parseCSV(file: File): Promise<ParsedData> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function (results) {

                if (results.data.length === 0) {
                    reject(new Error("File is empty"));
                    return;
                }

                console.log(results);


                console.log(results.meta.fields, "columns");

                resolve({
                    columns: results.meta.fields || [],
                    data: results.data as Record<string, unknown>[],
                    rowCount: results.data.length,
                });
            },
            error: function (error) {
                reject(new Error(error.message));
            },
        });
    });
}



export async function parseJSON(file: File): Promise<ParsedData> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const json = JSON.parse(text);

                let data: Record<string, unknown>[];

                if (Array.isArray(json)) {
                    data = json;
                } else if (typeof json === "object" && json !== null) {
                    // If it's an object with a data array property
                    if (Array.isArray(json.data)) {
                        data = json.data;
                    } else {
                        // Wrap single object in array
                        data = [json];
                    }
                } else {
                    throw new Error("Invalid JSON format");
                }

                if (data.length === 0) {
                    throw new Error("No data found in JSON file");
                }

                // Extract columns from first row
                const columns = Object.keys(data[0]);

                resolve({
                    columns,
                    data,
                    rowCount: data.length,
                });
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsText(file);
    });
}

export async function parseFile(file: File): Promise<ParsedData> {
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "csv") {
        return parseCSV(file);
    } else if (extension === "json") {
        return parseJSON(file);
    } else {
        throw new Error(
            "Unsupported file format. Please upload a CSV or JSON file."
        );
    }
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
        Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
}
