import { MapPin, Briefcase, Star, MessageSquare, ChevronRight, Languages } from "lucide-react"
import { Button } from "app/components/ui/button"
import { HandDrawnAvatar } from "app/components/ui/hand-drawn-avatar"
import type { Lawyer } from "app/types/lawyer"

type CardVariant = 'default' | 'minimal';
type DisplayMode = 'grid' | 'list';

interface LawyerCardProps {
  lawyer: Lawyer
  /** Controls the visual style of the card */
  variant?: CardVariant;
  /** Controls the layout mode - grid (card) or list */
  displayMode?: DisplayMode;
}

export function LawyerCard({ 
  lawyer, 
  variant = 'default',
  displayMode = 'list' 
}: LawyerCardProps) {
  
  const getExperienceText = (years: number) => {
    return years === 1 ? `${years} year` : `${years} years`;
  }

  const cardClasses: Record<DisplayMode, string> = {
    grid: 'h-full border-2 border-gray-900 bg-white rounded-lg overflow-hidden hover:shadow-[4px_4px_0_0_#000] transition-all duration-200',
    list: 'relative bg-white border-2 border-gray-900 rounded-lg p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000]'
  };

  const contentPadding = displayMode === 'grid' ? 'p-6' : 'p-6';

  return (
    <div 
      className={`${cardClasses[displayMode]} ${displayMode === 'grid' ? 'flex flex-col' : ''} group`}
      style={{
        borderRadius: '8px 16px 8px 16px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <HandDrawnAvatar 
              name={lawyer.name}
              size={displayMode === 'grid' ? 'md' : 'lg'}
              color="handdrawn-yellow"
              className="flex-shrink-0"
            />
            
            <div>
              <h3 className="text-xl font-black text-gray-900 font-serif">{lawyer.name}</h3>
              <p className="text-sm text-gray-600">{lawyer.specialization}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-700">
                <MapPin className="w-4 h-4" />
                <span>{lawyer.location}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full border-2 border-gray-900"
            style={{
              boxShadow: '1px 1px 0 0 #000',
            }}
          >
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
            <span className="text-sm font-bold">{lawyer.rating}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Briefcase className="w-4 h-4" />
            <span className="font-medium">Experience:</span>
            <span>{getExperienceText(lawyer.experienceYears)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Languages className="w-4 h-4" />
            <span className="font-medium">Languages:</span>
            <span>{lawyer.languages.join(", ")}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-300">
          <Button 
            className="group flex items-center justify-between bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-4 border-2 border-gray-900"
            style={{
              borderRadius: '4px 12px 4px 12px',
              boxShadow: '2px 2px 0 0 #000',
            }}
          >
            <span>Contact {lawyer.name.split(' ')[0]}</span>
            <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
        </div>
      </div>
  )
}
