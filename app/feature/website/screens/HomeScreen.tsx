import { HeroSection } from "~/layouts/HeroSection";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import { SupportedCountries } from "~/components/countries";
import { CallToAction } from "~/components/call-to-action";
import { MahakamaFeatures } from "~/feature/website/components/features";
import { Scale } from "lucide-react";

export const HomeScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 max-w-7xl mx-auto ">
      <HeroSection
        title={
          <>
            Legal Knowledge and{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Access</span>
              <span className="absolute bottom-0 left-0 right-0 h-3 bg-yellow-200/60 -rotate-1 -z-0"></span>
            </span>{' '}
            for Everyone
          </>
        }
        description="Free, easy-to-understand legal information for South Sudan and Uganda."
        icon={Scale}
      />
      <DiagonalSeparator />
      <SupportedCountries />
      <MahakamaFeatures />
      <CallToAction />
    </div>
  );
}
