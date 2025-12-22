import type { Route } from "./+types/$lawyerId";
import { LawyerProfileScreen } from "~/feature/lawyers/screens/LawyerProfileScreen";
import { useLawyer } from "~/feature/lawyers/hooks/use-lawyers";
import { PageDetailsLoading } from "~/components/page-details-loading";
import { PageDetailsError } from "~/components/page-details-error";

export function meta({ params }: Route.MetaArgs) {
  const { lawyerId } = params;
  const title = lawyerId
    ? `Lawyer Profile - Mahakama`
    : "Lawyer Profile - Mahakama";

  return [
    { title },
    {
      name: "description",
      content: `View the profile of our legal expert. Contact for professional legal services.`,
    },
  ];
}

export default function LawyerProfile({ params }: Route.ComponentProps) {
  const { lawyerId } = params;
  const { data: lawyer, error, isLoading } = useLawyer(lawyerId || '');

  if (isLoading) return <PageDetailsLoading 
    title="Loading Lawyer Profile" 
    description="Please wait while we load the lawyer's information..."
    showSkeleton={false}
  />;

  if (error) return <PageDetailsError 
    error={error instanceof Error ? error : new Error(String(error))}
    title="Error Loading Profile"
    description="We couldn't load the lawyer's profile. Please try again later."
  />;

  if (!lawyer) return <PageDetailsError 
    error={new Error("Lawyer not found")}
    title="Lawyer Not Found"
    description="The requested lawyer profile could not be found. They may no longer be available."
  />;
  
  return <LawyerProfileScreen lawyer={lawyer} error={null} isLoading={false} />;
}
