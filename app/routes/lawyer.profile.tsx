import { MapPin, Briefcase, Star, Mail, Phone, CheckCircle2, Clock, GraduationCap, Award, Languages } from "lucide-react";
import type { MetaArgs, LoaderArgs, ComponentProps, LoaderData } from "./+types/lawyer.profile";
import { HandDrawnAvatar } from "~/components/ui/hand-drawn-avatar";
import { Button } from "~/components/ui/button";

export function meta({ loaderData }: MetaArgs) {
  const { lawyer } = loaderData;
  const title = lawyer ? `${lawyer.name}'s Profile - Mahakama` : 'Lawyer Profile - Mahakama';
  
  return [
    { title },
    { name: "description", content: `View the profile of ${lawyer?.name || 'our legal expert'}. Contact for professional legal services.` },
  ];
}

export async function loader({ params }: LoaderArgs): Promise<LoaderData> {
  try {
    const { lawyerId } = params;
    const mockLawyer = {
      id: lawyerId,
      name: 'John Doe',
      title: 'Senior Attorney',
      specialization: 'Corporate Law',
      bio: 'Experienced attorney with over 10 years of practice in corporate law and intellectual property. Specializing in mergers and acquisitions, corporate governance, and regulatory compliance. Committed to providing exceptional legal services tailored to each client\'s unique needs.',
      rating: 4.8,
      location: 'Nairobi, Kenya',
      experienceYears: 10,
      casesHandled: 245,
      languages: ['English', 'Kiswahili', 'French'],
      isAvailable: true,
      education: [
        { degree: 'LL.M in Corporate Law', institution: 'Harvard Law School', year: 2015 },
        { degree: 'Juris Doctor (JD)', institution: 'University of Nairobi', year: 2010 },
      ],
      certifications: [
        { name: 'Certified Corporate Governance Professional', issuingOrganization: 'ICPAK', year: 2017 },
        { name: 'Arbitration & Mediation Certification', issuingOrganization: 'CIArb', year: 2016 },
      ],
      email: 'john.doe@lawfirm.co.ke',
      phone: '+254 700 123456',
    };

    return { lawyer: mockLawyer };
  } catch (error) {
    console.error('Error loading lawyer profile:', error);
    return { lawyer: null, error: 'Failed to load lawyer profile' };
  }
}

export default function LawyerProfile({ loaderData }: ComponentProps) {
  const { lawyer, error } = loaderData;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-6 max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground">We couldn't find the lawyer profile you're looking for.</p>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-center">
          <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4"></div>
          <div className="h-6 w-48 bg-muted rounded mx-auto mb-2"></div>
          <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  const availabilityBadge = lawyer.isAvailable ? (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
      <CheckCircle2 className="w-4 h-4 mr-1" /> Available
    </span>
  ) : (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
      <Clock className="w-4 h-4 mr-1" /> Unavailable
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <HandDrawnAvatar
                name={lawyer.name}
                size="lg"
                className="w-40 h-40 text-5xl border-4 border-white shadow-md"
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{lawyer.name}</h1>
                  <p className="text-lg text-gray-600 mt-1">{lawyer.title} • {lawyer.specialization}</p>
                  <div className="flex items-center mt-2 text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{lawyer.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-400 mr-1" />
                    <span className="font-bold">{lawyer.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({lawyer.casesHandled} cases)</span>
                  </div>
                  {availabilityBadge}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Button variant="outline" className="gap-2">
                  <Mail className="w-4 h-4" />
                  Send Message
                </Button>
                <Button variant="outline" className="gap-2">
                  <Phone className="w-4 h-4" />
                  Call Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}