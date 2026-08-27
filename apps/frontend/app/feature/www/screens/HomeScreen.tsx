import { HeroSection } from "@mah/ui";
import { DiagonalSeparator } from "~/components/atoms/diagnoal-separator";
import { SupportedCountries } from "~/components/molecules/countries";
import { CallToAction } from "~/components/molecules/call-to-action";
import { MahakamaFeatures } from "~/feature/www/components/features";
import { Scale } from "lucide-react";

export const HomeScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 max-w-7xl mx-auto space-y-8 ">
      <HeroSection
        title={
          <>
            Legal Knowledge and{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Access</span>
              <span className="absolute bottom-0 left-0 right-0 h-3 bg-yellow-200/60 -rotate-1 -z-0"></span>
            </span>{" "}
            for Everyone
          </>
        }
        description="Free, easy-to-understand legal information for South Sudan and Uganda."
        icon={Scale}
      />
      <MahakamaFeatures />
      <SupportedCountries />
      <CallToAction />
    </div>
  );
};
