export interface ParsedData {
    columns: string[];
    data: Record<string, unknown>[];
    rowCount: number;
}

export async function parseCSV(file: File): Promise<ParsedData> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const text = event.target?.result as string;
                const lines = text.split("\n").filter((line) => line.trim());

                if (lines.length === 0) {
                    throw new Error("File is empty");
                }

                // Parse header
                const columns = lines[0]
                    .split(",")
                    .map((col) => col.trim().replace(/^"|"$/g, ""));

                // Parse data rows
                const data: Record<string, unknown>[] = [];
                for (let i = 1; i < lines.length; i++) {
                    const values = parseCSVLine(lines[i]);
                    if (values.length === columns.length) {
                        const row: Record<string, unknown> = {};
                        columns.forEach((col, index) => {
                            const value = values[index];
                            // Try to parse numbers
                            const num = Number(value);
                            row[col] = isNaN(num) || value === "" ? value : num;
                        });
                        data.push(row);
                    }
                }

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

function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
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
