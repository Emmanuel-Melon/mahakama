import type { Route } from "./+types/$lawyerId";
import { LawyerProfileScreen } from "~/feature/lawyers/screens/LawyerProfileScreen";
import { useLawyer } from "~/feature/lawyers/hooks/use-lawyers";

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
  
  return (
    <LawyerProfileScreen lawyer={lawyer} error={error} isLoading={isLoading} />
  );
}
