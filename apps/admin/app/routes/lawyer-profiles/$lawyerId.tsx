import type { Route } from "./+types/$lawyerId";
import { useParams, useNavigate } from "react-router";
import { LawyerProfileDetailScreen } from "~/feature/lawyers/screens/LawyerProfileDetailScreen";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lawyer Profile - Mahakama Admin" },
    { name: "description", content: "Review lawyer profile details." },
  ];
}

export default function LawyerProfileDetailRoute() {
  const { lawyerId } = useParams();
  const navigate = useNavigate();

  if (!lawyerId) {
    return (
      <div className="text-center py-12 text-red-600">Missing lawyer ID.</div>
    );
  }

  return (
    <LawyerProfileDetailScreen
      lawyerId={lawyerId}
      onBack={() => navigate("/lawyer-profiles")}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
