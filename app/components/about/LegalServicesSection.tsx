import { ArrowRight, Gavel, FileText, Scale } from "lucide-react";
import { cn } from '~/lib/utils';

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
  services, 
  ctaText, 
  ctaHref, 
  className 
}: LegalServicesSectionProps) {
  return (
    <section className={cn("py-16 bg-white", className)}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Legal Services
          </h2>
          <p className="text-lg text-gray-600">
            Expert legal assistance when you need it most. Our network of verified professionals is here to help.
          </p>
        </div>

        <div className="space-y-0 divide-y divide-gray-200">
          {services.map((service, index) => (
            <div key={index} className="py-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <service.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-gray-600">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href={ctaHref}
            className="inline-flex items-center text-primary font-medium hover:text-primary/90"
          >
            {ctaText}
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
      description: "Get expert advice from our network of experienced attorneys.",
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
