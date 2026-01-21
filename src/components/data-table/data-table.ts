import { useState, useMemo, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTableToolbar } from "./data-table-toolbar"
import { transformData, type TransformState, type FilterConfig, type SortConfig } from "@/lib/data-transforms"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataTableProps {
  data: Record<string, unknown>[]
  columns: string[]
}

const PAGE_SIZE_OPTIONS = [50, 100, 500]

export function DataTable({ data, columns }: DataTableProps) {
  const [transformState, setTransformState] = useState<TransformState>({
    sort: null,
    filters: [],
    groupBy: null,
  })
  const [history, setHistory] = useState<TransformState[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const pushToHistory = useCallback(
    (newState: TransformState) => {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(transformState)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
      setTransformState(newState)
      setCurrentPage(1)
    },
    [history, historyIndex, transformState],
  )

  const handleUndo = useCallback(() => {
    if (historyIndex >= 0) {
      setTransformState(history[historyIndex])
      setHistoryIndex(historyIndex - 1)
      setCurrentPage(1)
    }
  }, [history, historyIndex])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setTransformState(history[historyIndex + 1])
      setCurrentPage(1)
    }
  }, [history, historyIndex])

  const handleReset = useCallback(() => {
    pushToHistory({
      sort: null,
      filters: [],
      groupBy: null,
    })
  }, [pushToHistory])

  const handleSortChange = useCallback(
    (sort: SortConfig | null) => {
      pushToHistory({ ...transformState, sort })
    },
    [pushToHistory, transformState],
  )

  const handleColumnSort = useCallback(
    (column: string) => {
      const currentSort = transformState.sort
      let newSort: SortConfig | null

      if (currentSort?.column === column) {
        if (currentSort.direction === "asc") {
          newSort = { column, direction: "desc" }
        } else {
          newSort = null
        }
      } else {
        newSort = { column, direction: "asc" }
      }

      pushToHistory({ ...transformState, sort: newSort })
    },
    [pushToHistory, transformState],
  )

  const handleAddFilter = useCallback(
    (filter: FilterConfig) => {
      pushToHistory({
        ...transformState,
        filters: [...transformState.filters, filter],
      })
    },
    [pushToHistory, transformState],
  )

  const handleRemoveFilter = useCallback(
    (index: number) => {
      pushToHistory({
        ...transformState,
        filters: transformState.filters.filter((_, i) => i !== index),
      })
    },
    [pushToHistory, transformState],
  )

  const transformedData = useMemo(() => {
    return transformData(data, transformState)
  }, [data, transformState])

  const totalPages = Math.ceil(transformedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedData = transformedData.slice(startIndex, endIndex)

  const getSortIcon = (column: string) => {
    if (transformState.sort?.column !== column) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    }
    return transformState.sort.direction === "asc" ? (
      <ArrowUp className="h-4 w-4 text-primary" />
    ) : (
      <ArrowDown className="h-4 w-4 text-primary" />
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <DataTableToolbar
        columns={columns}
        sort={transformState.sort}
        filters={transformState.filters}
        onSortChange={handleSortChange}
        onAddFilter={handleAddFilter}
        onRemoveFilter={handleRemoveFilter}
        onReset={handleReset}
        canUndo={historyIndex >= 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {startIndex + 1}-{Math.min(endIndex, transformedData.length)} of{" "}
          {transformedData.length.toLocaleString()} rows
          {transformState.filters.length > 0 && ` (filtered from ${data.length.toLocaleString()})`}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                {columns.map((column) => (
                  <TableHead
                    key={column}
                    className="cursor-pointer select-none whitespace-nowrap"
                    onClick={() => handleColumnSort(column)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column}</span>
                      {getSortIcon(column)}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className={cn(rowIndex % 2 === 0 ? "bg-background" : "bg-muted/30")}>
                    {columns.map((column) => (
                      <TableCell key={column} className="whitespace-nowrap">
                        {row[column] !== null && row[column] !== undefined ? String(row[column]) : "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[80px] h-8 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages || 1}
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
