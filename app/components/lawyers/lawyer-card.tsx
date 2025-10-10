import { MapPin, Briefcase, Star, MessageSquare, UserCheck, Languages, ChevronRight } from "lucide-react"
import { Button } from "app/components/ui/button"
import type { Lawyer } from "app/types/lawyer"

interface LawyerCardProps {
  lawyer: Lawyer
}

export function LawyerCard({ lawyer }: LawyerCardProps) {
  const getAvailabilityColor = () => {
    return lawyer.isAvailable ? "bg-green-500" : "bg-red-500";
  }

  const getAvailabilityText = () => {
    return lawyer.isAvailable ? "Available Now" : "Currently Unavailable";
  }
  
  const getExperienceText = (years: number) => {
    return years === 1 ? `${years} year` : `${years} years`;
  }

  return (
    <div 
      className="relative h-full bg-white border-2 border-gray-900 p-6 transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_0_#000]"
      style={{
        borderRadius: '8px 16px 8px 16px',
        boxShadow: '3px 3px 0 0 #000',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      }}
    >
      {/* Corner decorations */}
      <span className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900"></span>
      <span className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900"></span>
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-yellow-100 border-2 border-gray-900 flex items-center justify-center text-2xl font-bold"
                style={{
                  boxShadow: '2px 2px 0 0 #000',
                }}
              >
                {lawyer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getAvailabilityColor()}`}></div>
            </div>
            
            <div>
              <h3 className="text-xl font-black text-gray-900 font-serif">{lawyer.name}</h3>
              <p className="text-sm text-gray-600">{lawyer.specialization}</p>
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
        
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700 mb-4">
          <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border-2 border-gray-900"
            style={{
              boxShadow: '1px 1px 0 0 #000',
            }}
          >
            <MapPin className="w-4 h-4" />
            <span>{lawyer.location}</span>
          </div>
          
          <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border-2 border-gray-900"
            style={{
              boxShadow: '1px 1px 0 0 #000',
            }}
          >
            <Briefcase className="w-4 h-4" />
            <span>{getExperienceText(lawyer.experienceYears)}</span>
          </div>
          
          <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border-2 border-gray-900"
            style={{
              boxShadow: '1px 1px 0 0 #000',
            }}
          >
            <UserCheck className="w-4 h-4" />
            <span>{lawyer.casesHandled} cases</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Languages className="w-4 h-4" />
            <span className="font-medium">Languages:</span>
            <span>{lawyer.languages.join(", ")}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className={`w-2 h-2 rounded-full ${getAvailabilityColor()}`}></span>
            <span className="font-medium">{getAvailabilityText()}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t-2 border-dashed border-gray-300">
          <Button 
            className="w-full group flex items-center justify-between bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-4 border-2 border-gray-900"
            style={{
              borderRadius: '4px 12px 4px 12px',
              boxShadow: '2px 2px 0 0 #000',
            }}
          >
            <span>Contact {lawyer.name.split(' ')[0]}</span>
            <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

          <div className="flex gap-3 pt-2">
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat Now
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent text-sm">
              <UserCheck className="mr-2 h-4 w-4" />
              Request
            </Button>
          </div>
        </div>
      </div>
  )
}
