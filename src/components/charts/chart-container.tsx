import { useState, useMemo, useRef, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Bar,
    BarChart,
    Line,
    LineChart,
    Pie,
    PieChart,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { Download, ImageIcon } from "lucide-react";
import type { Dataset } from "@/lib/store";

type ChartType = "bar" | "line" | "pie";

interface ChartContainerProps {
    dataset: Dataset;
}

const CHART_COLORS = [
    "hsl(221, 83%, 53%)", // Primary blue
    "hsl(160, 84%, 39%)", // Success green
    "hsl(38, 92%, 50%)", // Warning yellow
    "hsl(280, 87%, 58%)", // Purple
    "hsl(15, 91%, 53%)", // Red/Orange
];

export function ChartVisualization({ dataset }: ChartContainerProps) {
    const chartRef = useRef<HTMLDivElement>(null);
    const [chartType, setChartType] = useState<ChartType>("bar");

    const numericColumns = useMemo(() => {
        if (dataset.data.length === 0) return [];
        return dataset.columns.filter((col) => {
            const sample = dataset.data.find(
                (row) => row[col] !== null && row[col] !== undefined
            );
            return sample && typeof sample[col] === "number";
        });
    }, [dataset]);

    const [xAxis, setXAxis] = useState<string>(() => dataset.columns[0] || "");
    const [yAxis, setYAxis] = useState<string>(() => numericColumns[0] || "");

    useEffect(() => {
        if (!xAxis && dataset.columns.length > 0) {
            setXAxis(dataset.columns[0]);
        }
        if (!yAxis && numericColumns.length > 0) {
            setYAxis(numericColumns[0]);
        }
    }, [dataset, numericColumns, xAxis, yAxis]);

    // Aggregate data for chart
    const chartData = useMemo(() => {
        if (!xAxis || !yAxis) return [];

        const aggregated = new Map<string, { sum: number; count: number }>();

        dataset.data.forEach((row) => {
            const key = String(row[xAxis] ?? "Unknown");
            const value = Number(row[yAxis]) || 0;

            if (!aggregated.has(key)) {
                aggregated.set(key, { sum: 0, count: 0 });
            }

            const current = aggregated.get(key)!;
            current.sum += value;
            current.count += 1;
        });

        return Array.from(aggregated.entries())
            .map(([name, { sum, count }]) => ({
                name,
                value: Math.round((sum / count) * 100) / 100,
            }))
            .slice(0, 20); // Limit to 20 items for readability
    }, [dataset.data, xAxis, yAxis]);

    const handleExportPNG = async () => {
        if (!chartRef.current) return;

        try {
            const html2canvas = (await import("html2canvas")).default;
            const canvas = await html2canvas(chartRef.current, {
                backgroundColor: "#1e293b",
            });
            const url = canvas.toDataURL("image/png");
            const a = document.createElement("a");
            a.href = url;
            a.download = `${dataset.name}-chart.png`;
            a.click();
        } catch (error) {
            console.error("Failed to export chart:", error);
        }
    };

    const handleExportData = () => {
        const csvContent = [
            "name,value",
            ...chartData.map((d) => `${d.name},${d.value}`),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${dataset.name}-chart-data.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const chartConfig = useMemo(
        () => ({
            value: {
                label: yAxis || "Value",
                color: CHART_COLORS[0],
            },
        }),
        [yAxis]
    );

    const renderChart = () => {
        if (chartData.length === 0) {
            return (
                <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                    Select X and Y axes to generate chart
                </div>
            );
        }

        switch (chartType) {
            case "bar":
                return (
                    <ChartContainer
                        config={chartConfig}
                        className="h-[400px] w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 60,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="hsl(var(--border))"
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{
                                        fill: "hsl(var(--muted-foreground))",
                                        fontSize: 12,
                                    }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    tick={{
                                        fill: "hsl(var(--muted-foreground))",
                                        fontSize: 12,
                                    }}
                                />
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                />
                                <Bar
                                    dataKey="value"
                                    fill={CHART_COLORS[0]}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                );

            case "line":
                return (
                    <ChartContainer
                        config={chartConfig}
                        className="h-[400px] w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={chartData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 60,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="hsl(var(--border))"
                                />
                                <XAxis
                                    dataKey="name"
                                    tick={{
                                        fill: "hsl(var(--muted-foreground))",
                                        fontSize: 12,
                                    }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis
                                    tick={{
                                        fill: "hsl(var(--muted-foreground))",
                                        fontSize: 12,
                                    }}
                                />
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={CHART_COLORS[0]}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                );

            case "pie":
                return (
                    <ChartContainer
                        config={chartConfig}
                        className="h-[400px] w-full"
                    >
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={150}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) =>
                                        `${name} (${(percent * 100).toFixed(
                                            0
                                        )}%)`
                                    }
                                >
                                    {chartData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={
                                                CHART_COLORS[
                                                    index % CHART_COLORS.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>
                                <ChartTooltip
                                    content={<ChartTooltipContent />}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Chart Configuration */}
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle className="text-foreground">
                        Chart Configuration
                    </CardTitle>
                    <CardDescription>
                        Select chart type and configure axes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <Label>Chart Type</Label>
                            <Select
                                value={chartType}
                                onValueChange={(v) =>
                                    setChartType(v as ChartType)
                                }
                            >
                                <SelectTrigger className="bg-background">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bar">
                                        Bar Chart
                                    </SelectItem>
                                    <SelectItem value="line">
                                        Line Chart
                                    </SelectItem>
                                    <SelectItem value="pie">
                                        Pie Chart
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>X-Axis (Category)</Label>
                            <Select value={xAxis} onValueChange={setXAxis}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select column" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dataset.columns.map((col) => (
                                        <SelectItem key={col} value={col}>
                                            {col}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Y-Axis (Value)</Label>
                            <Select value={yAxis} onValueChange={setYAxis}>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select column" />
                                </SelectTrigger>
                                <SelectContent>
                                    {numericColumns.length === 0 ? (
                                        <SelectItem value="" disabled>
                                            No numeric columns
                                        </SelectItem>
                                    ) : (
                                        numericColumns.map((col) => (
                                            <SelectItem key={col} value={col}>
                                                {col}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Actions</Label>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleExportPNG}
                                    className="flex-1 bg-transparent"
                                >
                                    <ImageIcon className="mr-1 h-3 w-3" />
                                    PNG
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleExportData}
                                    className="flex-1 bg-transparent"
                                >
                                    <Download className="mr-1 h-3 w-3" />
                                    CSV
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Chart Display */}
            <Card className="bg-card">
                <CardHeader>
                    <CardTitle className="text-foreground">
                        {chartType.charAt(0).toUpperCase() + chartType.slice(1)}{" "}
                        Chart
                    </CardTitle>
                    <CardDescription>
                        {xAxis && yAxis
                            ? `${yAxis} by ${xAxis}`
                            : "Configure axes to view chart"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div ref={chartRef}>{renderChart()}</div>
                </CardContent>
            </Card>
        </div>
    );
}
