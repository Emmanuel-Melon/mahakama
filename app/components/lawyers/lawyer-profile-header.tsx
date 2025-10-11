import { MapPin, Briefcase, Star, MessageSquare, ChevronRight, Calendar, Scale } from 'lucide-react';
import { Button } from '~/components/ui/button';
import { BorderedBox } from '~/components/ui/bordered-box';
import { HandDrawnAvatar } from '~/components/ui/hand-drawn-avatar';

interface LawyerProfileHeaderProps {
    lawyer: {
        id: string;
        name: string;
        title: string;
        specialization: string;
        location: string;
        rating: number;
        casesHandled: number;
        experienceYears: number;
        isAvailable: boolean;
        [key: string]: any;
    };
    onContact?: () => void;
    onBook?: () => void;
}

export function LawyerProfileHeader({ lawyer, onContact, onBook }: LawyerProfileHeaderProps) {
    const getAvailabilityColor = () => {
        return lawyer.isAvailable ? 'bg-green-500' : 'bg-yellow-500';
    };

    const getAvailabilityText = () => {
        return lawyer.isAvailable ? 'Available now' : 'Currently unavailable';
    };

    const getExperienceText = (years: number) => {
        if (years === 1) return '1 year';
        return `${years} years`;
    };

    return (
        <BorderedBox
            className="mb-6 p-8"
            variant="decorated"
            accentColor="bg-yellow-100"
        >

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                    <HandDrawnAvatar
                        name={lawyer.name}
                        size="lg"
                        color="outline"

                    />
                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-black text-gray-900 font-serif mb-2">
                                    {lawyer.name}
                                </h1>
                                <p className="text-lg text-gray-700 font-medium mb-3">
                                    {lawyer.specialization}
                                </p>
                            </div>

                            <div
                                className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border-2 border-gray-900"
                                style={{
                                    boxShadow: "2px 2px 0 0 #000",
                                }}
                            >
                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-500" />
                                <span className="text-xl font-bold">{lawyer.rating}</span>
                                <span className="text-sm text-gray-600">/5.0</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            <div
                                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-gray-900"
                                style={{
                                    boxShadow: "2px 2px 0 0 #000",
                                }}
                            >
                                <MapPin className="w-4 h-4" />
                                <span className="font-medium">{lawyer.location}</span>
                            </div>

                            <div
                                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-gray-900"
                                style={{
                                    boxShadow: "2px 2px 0 0 #000",
                                }}
                            >
                                <Briefcase className="w-4 h-4" />
                                <span className="font-medium">{getExperienceText(lawyer.experienceYears)} experience</span>
                            </div>

                            <div
                                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-2 border-gray-900"
                                style={{
                                    boxShadow: "2px 2px 0 0 #000",
                                }}
                            >
                                <Scale className="w-4 h-4" />
                                <span className="font-medium">{lawyer.casesHandled} cases handled</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                onClick={onContact}
                                className="group flex-1 flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-3 px-6 border-2 border-gray-900"
                                style={{
                                    borderRadius: "4px 12px 4px 12px",
                                    boxShadow: "3px 3px 0 0 #000",
                                }}
                            >
                                <MessageSquare className="w-5 h-5 mr-2" />
                                <span>Chat Now</span>
                                <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </Button>

                            <Button
                                onClick={onBook}
                                className="flex-1 flex items-center justify-center bg-white hover:bg-gray-50 text-gray-900 font-bold py-3 px-6 border-2 border-gray-900"
                                style={{
                                    borderRadius: "4px 12px 4px 12px",
                                    boxShadow: "3px 3px 0 0 #000",
                                }}
                            >
                                <Calendar className="w-5 h-5 mr-2" />
                                <span>Book Consultation</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </BorderedBox>
    );
}
