import { Filter, ArrowDownUp, List, LayoutGrid } from "lucide-react"
import { Button } from "app/components/ui/button"
import { BorderedBox } from "app/components/ui/bordered-box"
import { ButtonGroup } from "app/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "app/components/ui/dropdown-menu"
import { useState, useEffect } from "react"

type ViewMode = 'list' | 'grid'

interface ListControlsProps {
  /** Total number of items being displayed */
  totalItems: number
  /** Callback when the view mode changes between 'list' and 'grid' */
  onViewModeChange?: (mode: ViewMode) => void
  /** Current display mode */
  displayMode?: ViewMode
  /** Callback when the display mode changes */
  onDisplayModeChange?: (mode: ViewMode) => void
  /** Label to display in the BorderedBox header */
  label?: string
  /** Name of the items being displayed (e.g., 'lawyer', 'document') */
  itemName?: string
  /** Additional class name for the root element */
  className?: string
}

export function ListControls({ 
  totalItems, 
  onViewModeChange, 
  onDisplayModeChange,
  displayMode: externalDisplayMode = 'list',
  label = 'Section',
  itemName = 'item',
  className = ''
}: ListControlsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(externalDisplayMode)

  const toggleViewMode = () => {
    const newMode = viewMode === 'list' ? 'grid' : 'list'
    setViewMode(newMode)
    onViewModeChange?.(newMode)
    onDisplayModeChange?.(newMode)
  }

  // Sync with external displayMode prop
  useEffect(() => {
    if (externalDisplayMode !== viewMode) {
      setViewMode(externalDisplayMode)
    }
  }, [externalDisplayMode, viewMode])

  return (
    <BorderedBox className={`mb-6 px-4 py-3 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="text-sm text-gray-700">
          <span className="font-medium">{totalItems}</span> {itemName}{totalItems !== 1 ? 's' : ''} found
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-2 border-gray-900 bg-white hover:bg-yellow-50 flex items-center gap-2"
                  style={{
                    boxShadow: '2px 2px 0 0 #000',
                    borderRadius: '4px 8px 4px 8px',
                  }}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end"
                className="border-2 border-gray-900 bg-white"
                style={{
                  boxShadow: '3px 3px 0 0 #000',
                  borderRadius: '4px 16px 4px 16px',
                }}
              >
                <DropdownMenuItem className="cursor-pointer">
                  Most Recent
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Name (Z-A)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-gray-300 mx-2"></div>

            <ButtonGroup>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                className={`border-2 border-gray-900 ${viewMode === 'grid' ? 'bg-gray-900 text-white' : 'bg-white hover:bg-yellow-50'}`}
                style={{
                  boxShadow: '2px 2px 0 0 #000',
                  borderRadius: '4px 0 0 4px',
                }}
                onClick={() => {
                  const newMode = 'grid';
                  setViewMode(newMode);
                  onViewModeChange?.(newMode);
                  onDisplayModeChange?.(newMode);
                }}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                className={`border-2 border-l-0 border-gray-900 ${viewMode === 'list' ? 'bg-gray-900 text-white' : 'bg-white hover:bg-yellow-50'}`}
                style={{
                  boxShadow: '2px 2px 0 0 #000',
                  borderRadius: '0 4px 4px 0',
                }}
                onClick={() => {
                  const newMode = 'list';
                  setViewMode(newMode);
                  onViewModeChange?.(newMode);
                  onDisplayModeChange?.(newMode);
                }}
              >
                <List className="h-4 w-4" />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </BorderedBox>
  )
}