import { MapPin, Briefcase, Star, MessageSquare, UserCheck, Languages } from "lucide-react"
import { Button } from "app/components/ui/button"
import { Badge } from "app/components/ui/badge"
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
      className="border-b pb-8 mb-8 last:border-b-0 last:pb-0 last:mb-0"
    >
      <div className="grid grid-cols-[auto,1fr] gap-6 items-start">
        <div className="relative">
          <div
            className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-primary/30 text-primary font-semibold text-lg relative"
          >
            {lawyer.id}
            <div
              className="absolute inset-0 rounded-full border border-primary/30"
            />
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-accent/60 rounded-full"
                style={{
                  left: `${30 + i * 20}%`,
                  top: `${30 + i * 15}%`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="text-xl font-medium text-foreground">{lawyer.name}</h3>
                <p className="text-sm text-muted-foreground">{lawyer.specialization}</p>
              </div>
              <div className="flex items-center gap-1 rounded-md bg-accent/10 px-2 py-1 shrink-0">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-sm font-semibold text-accent">{lawyer.rating}</span>
                <span className="text-xs text-muted-foreground">({lawyer.casesHandled} cases)</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{lawyer.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{getExperienceText(lawyer.experienceYears)} experience</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-foreground text-xs"
            >
              <span className={`w-2 h-2 rounded-full ${getAvailabilityColor()}`}></span>
              {lawyer.specialization}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Languages className="w-4 h-4" />
            <span>{lawyer.languages.join(", ")}</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">{lawyer.casesHandled.toLocaleString()}</span> cases handled
          </p>

          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`border-${getAvailabilityColor().replace("bg-", "")}`}
            >
              {getAvailabilityText()}
            </Badge>
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
    </div>
  )
}
