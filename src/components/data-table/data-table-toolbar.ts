import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type {
    FilterConfig,
    FilterOperator,
    SortConfig,
    SortDirection,
} from "@/lib/data-transforms";
import { Undo2, Redo2, RotateCcw, Plus, X } from "lucide-react";

interface DataTableToolbarProps {
    columns: string[];
    sort: SortConfig | null;
    filters: FilterConfig[];
    onSortChange: (sort: SortConfig | null) => void;
    onAddFilter: (filter: FilterConfig) => void;
    onRemoveFilter: (index: number) => void;
    onReset: () => void;
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
}

export function DataTableToolbar({
    columns,
    sort,
    filters,
    onSortChange,
    onAddFilter,
    onRemoveFilter,
    onReset,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
}: DataTableToolbarProps) {
    const handleAddFilter = () => {
        if (columns.length > 0) {
            onAddFilter({
                column: columns[0],
                operator: "contains",
                value: "",
            });
        }
    };

    return (
        <div className="space-y-4 rounded-lg border border-border bg-card p-4">
            {/* Filter Controls */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-foreground">
                        Filters
                    </Label>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddFilter}
                        className="h-8 bg-transparent"
                    >
                        <Plus className="mr-1 h-3 w-3" />
                        Add Filter
                    </Button>
                </div>

                {filters.map((filter, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Select
                            value={filter.column}
                            onValueChange={(value) => {
                                const newFilters = [...filters];
                                newFilters[index] = {
                                    ...filter,
                                    column: value,
                                };
                                onRemoveFilter(index);
                                onAddFilter(newFilters[index]);
                            }}
                        >
                            <SelectTrigger className="w-[140px] h-8 bg-background">
                                <SelectValue placeholder="Column" />
                            </SelectTrigger>
                            <SelectContent>
                                {columns.map((col) => (
                                    <SelectItem key={col} value={col}>
                                        {col}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={filter.operator}
                            onValueChange={(value) => {
                                const newFilters = [...filters];
                                newFilters[index] = {
                                    ...filter,
                                    operator: value as FilterOperator,
                                };
                                onRemoveFilter(index);
                                onAddFilter(newFilters[index]);
                            }}
                        >
                            <SelectTrigger className="w-[120px] h-8 bg-background">
                                <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="contains">
                                    Contains
                                </SelectItem>
                                <SelectItem value="equals">Equals</SelectItem>
                                <SelectItem value="not_equals">
                                    Not equals
                                </SelectItem>
                                <SelectItem value="greater">
                                    Greater than
                                </SelectItem>
                                <SelectItem value="less">Less than</SelectItem>
                            </SelectContent>
                        </Select>

                        <Input
                            placeholder="Value"
                            value={filter.value}
                            onChange={(e) => {
                                const newFilters = [...filters];
                                newFilters[index] = {
                                    ...filter,
                                    value: e.target.value,
                                };
                                onRemoveFilter(index);
                                onAddFilter(newFilters[index]);
                            }}
                            className="h-8 w-[140px]"
                        />

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onRemoveFilter(index)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                {filters.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        No filters applied
                    </p>
                )}
            </div>

            {/* Sort and Actions */}
            <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4">
                <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground">
                        Sort by:
                    </Label>
                    <Select
                        value={sort?.column || "none"}
                        onValueChange={(value) => {
                            if (value === "none") {
                                onSortChange(null);
                            } else {
                                onSortChange({
                                    column: value,
                                    direction: sort?.direction || "asc",
                                });
                            }
                        }}
                    >
                        <SelectTrigger className="w-[140px] h-8 bg-background">
                            <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {columns.map((col) => (
                                <SelectItem key={col} value={col}>
                                    {col}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {sort && (
                        <Select
                            value={sort.direction}
                            onValueChange={(value) => {
                                onSortChange({
                                    ...sort,
                                    direction: value as SortDirection,
                                });
                            }}
                        >
                            <SelectTrigger className="w-[100px] h-8 bg-background">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="asc">Ascending</SelectItem>
                                <SelectItem value="desc">Descending</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onUndo}
                        disabled={!canUndo}
                        className="h-8 bg-transparent"
                    >
                        <Undo2 className="mr-1 h-3 w-3" />
                        Undo
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRedo}
                        disabled={!canRedo}
                        className="h-8 bg-transparent"
                    >
                        <Redo2 className="mr-1 h-3 w-3" />
                        Redo
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onReset}
                        className="h-8 bg-transparent"
                    >
                        <RotateCcw className="mr-1 h-3 w-3" />
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
}
