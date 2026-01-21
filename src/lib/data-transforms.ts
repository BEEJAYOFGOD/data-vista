export type SortDirection = "asc" | "desc";
export type FilterOperator =
    | "equals"
    | "contains"
    | "greater"
    | "less"
    | "not_equals";

export interface SortConfig {
    column: string;
    direction: SortDirection;
}

export interface FilterConfig {
    column: string;
    operator: FilterOperator;
    value: string;
}

export interface TransformState {
    sort: SortConfig | null;
    filters: FilterConfig[];
    groupBy: string | null;
}

export function applySort<T extends Record<string, unknown>>(
    data: T[],
    sort: SortConfig | null
): T[] {
    if (!sort) return data;

    return [...data].sort((a, b) => {
        const aVal = a[sort.column];
        const bVal = b[sort.column];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        let comparison: number;
        if (typeof aVal === "number" && typeof bVal === "number") {
            comparison = aVal - bVal;
        } else {
            comparison = String(aVal).localeCompare(String(bVal));
        }

        return sort.direction === "asc" ? comparison : -comparison;
    });
}

export function applyFilters<T extends Record<string, unknown>>(
    data: T[],
    filters: FilterConfig[]
): T[] {
    if (filters.length === 0) return data;

    return data.filter((row) => {
        return filters.every((filter) => {
            const value = row[filter.column];
            const filterValue = filter.value.toLowerCase();

            if (value === null || value === undefined) return false;

            switch (filter.operator) {
                case "equals":
                    return String(value).toLowerCase() === filterValue;
                case "not_equals":
                    return String(value).toLowerCase() !== filterValue;
                case "contains":
                    return String(value).toLowerCase().includes(filterValue);
                case "greater":
                    return typeof value === "number"
                        ? value > Number(filterValue)
                        : String(value) > filterValue;
                case "less":
                    return typeof value === "number"
                        ? value < Number(filterValue)
                        : String(value) < filterValue;
                default:
                    return true;
            }
        });
    });
}

export interface GroupedData {
    key: string;
    count: number;
    sum: Record<string, number>;
    avg: Record<string, number>;
    rows: Record<string, unknown>[];
}

export function applyGroupBy<T extends Record<string, unknown>>(
    data: T[],
    groupBy: string | null
): GroupedData[] {
    if (!groupBy) {
        return [
            {
                key: "All Data",
                count: data.length,
                sum: {},
                avg: {},
                rows: data,
            },
        ];
    }

    const groups = new Map<string, T[]>();

    data.forEach((row) => {
        const key = String(row[groupBy] ?? "Unknown");
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key)!.push(row);
    });

    return Array.from(groups.entries()).map(([key, rows]) => {
        const numericColumns = Object.keys(rows[0] || {}).filter(
            (col) => typeof rows[0][col] === "number"
        );

        const sum: Record<string, number> = {};
        const avg: Record<string, number> = {};

        numericColumns.forEach((col) => {
            const values = rows
                .map((r) => r[col] as number)
                .filter((v) => typeof v === "number");
            sum[col] = values.reduce((a, b) => a + b, 0);
            avg[col] = values.length > 0 ? sum[col] / values.length : 0;
        });

        return {
            key,
            count: rows.length,
            sum,
            avg,
            rows,
        };
    });
}

export function transformData<T extends Record<string, unknown>>(
    data: T[],
    state: TransformState
): T[] {
    let result = [...data];
    result = applyFilters(result, state.filters);
    result = applySort(result, state.sort);
    return result;
}
