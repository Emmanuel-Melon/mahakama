import { Filter, ArrowDownUp } from "lucide-react"
import { Button } from "app/components/ui/button"
import { Input } from "app/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "app/components/ui/dropdown-menu"

interface ListControlsProps {
  totalItems: number
}

export function ListControls({ totalItems }: ListControlsProps) {
  return (
    <div className="relative bg-white border-2 border-gray-900 p-4 mb-6"
      style={{
        borderRadius: '8px 16px 8px 16px',
        boxShadow: '3px 3px 0 0 #000',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      {/* Corner decorations */}
      <span className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900"></span>
      <span className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900"></span>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-gray-700">
          <span className="font-bold">{totalItems}</span> {totalItems === 1 ? 'lawyer' : 'lawyers'} found
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Input
              type="text"
              placeholder="Search lawyers..."
              className="pl-10 border-2 border-gray-900 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-0"
              style={{
                boxShadow: '2px 2px 0 0 #000',
                borderRadius: '4px 8px 4px 8px',
              }}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <div className="flex gap-2">
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
                  Available Now
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Top Rated
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Most Experienced
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
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
                  <ArrowDownUp className="h-4 w-4" />
                  <span>Sort</span>
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
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Highest Rated
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Most Experienced
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
