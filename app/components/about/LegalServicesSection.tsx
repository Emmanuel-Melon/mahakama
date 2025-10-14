import { ArrowRight, Gavel, FileText, Scale, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { IconContainer } from "../icon-container";

type Service = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

type LegalServicesSectionProps = {
  services: Service[];
  ctaText: string;
  ctaHref: string;
  className?: string;
};

export function LegalServicesSection({
  services = [],
  ctaText,
  ctaHref,
  className,
}: LegalServicesSectionProps) {
  return (
    <section
      className={cn("py-16 bg-white relative overflow-hidden", className)}
    >
      {/* Decorative background elements */}
      <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-yellow-100/50 -z-10"></div>
      <div className="absolute -left-10 bottom-10 w-32 h-32 rounded-full bg-blue-100/50 -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 space-y-4">
          <IconContainer icon={Gavel} color="handdrawn" />
          <h2 className="text-4xl font-black text-gray-900 sm:text-5xl">
            Legal Services
          </h2>
          <p className="text-lg text-gray-700 font-medium">
            Expert legal assistance when you need it most. Our network of
            verified professionals is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative p-6 bg-white border-2 border-gray-900 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-y-1"
              style={{
                borderRadius: "16px 8px 16px 8px",
                border: "2px solid #000",
                boxShadow: "4px 4px 0 0 #000",
              }}
            >
              {/* Decorative corner elements */}
              <div className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900 bg-yellow-300"></div>
              <div className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900 bg-yellow-300"></div>

              <div className="flex flex-col h-full">
                <IconContainer icon={service.icon} color="outline" />
                <h3 className="text-xl font-black text-gray-900 mb-3 relative inline-block">
                  {service.title}
                  <div className="absolute -bottom-1 left-0 right-0 h-2 bg-yellow-200/60 -rotate-1 -z-10"></div>
                </h3>

                <p className="text-gray-700 mb-6 flex-grow">
                  {service.description}
                </p>

                <a
                  href={ctaHref}
                  className="mt-auto inline-flex items-center text-sm font-bold text-gray-900 hover:text-blue-600 group transition-colors"
                >
                  Learn more
                  <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Hand-drawn underline */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200"
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)",
                }}
              ></div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href={ctaHref}
            className="relative px-6 py-3 text-sm font-bold text-gray-900 border-2 border-gray-900 bg-yellow-400 hover:bg-yellow-300 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-flex items-center"
            style={{
              borderRadius: "8px 16px 8px 16px",
              boxShadow: "3px 3px 0 0 #000",
            }}
          >
            {ctaText}
            <span className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900"></span>
            <span className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900"></span>
            <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

// Default services if none provided
LegalServicesSection.defaultProps = {
  services: [
    {
      title: "Legal Consultation",
      description:
        "Get expert advice from our network of experienced attorneys.",
      icon: Gavel,
    },
    {
      title: "Document Review",
      description: "Have your legal documents reviewed by professionals.",
      icon: FileText,
    },
    {
      title: "Case Representation",
      description: "Professional representation for your legal matters.",
      icon: Scale,
    },
  ],
};
