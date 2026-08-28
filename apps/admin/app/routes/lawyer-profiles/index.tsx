import type { Route } from "./+types/index";
import { useSearchParams, useNavigate } from "react-router";
import { LawyerProfilesScreen } from "~/feature/lawyers/screens/LawyerProfilesScreen";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lawyer Profiles - Mahakama Admin" },
    {
      name: "description",
      content: "Review and manage lawyer profile submissions.",
    },
  ];
}

export default function LawyerProfilesRoute() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const statusFilter = searchParams.get("status");

  function handleStatusChange(status: string | null) {
    if (status) {
      setSearchParams({ status });
    } else {
      setSearchParams({});
    }
  }

  function handleSelectLawyer(lawyer: { id: string }) {
    navigate(`/lawyer-profiles/${lawyer.id}`);
  }

  return (
    <LawyerProfilesScreen
      statusFilter={statusFilter}
      onStatusChange={handleStatusChange}
      onSelectLawyer={handleSelectLawyer}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
