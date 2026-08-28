import { ServiceDetailScreen } from "~/feature/www/screens/ServiceDetailScreen";
import { authContext } from "~/middleware/context";
import { useService } from "@mah/api/src/hooks/use-services";
import { PageDetailsLoading } from "@mah/ui/components/molecules/PageDetailsLoading";
import { PageDetailsError } from "@mah/ui/components/molecules/PageDetailsError";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { handleRouteError } from "@mah/client/errors";

export function meta({ params }: { params: { serviceId: string } }) {
  return [
    { title: `Legal Service Details - Mahakama` },
    {
      name: "description",
      content:
        "View detailed information about legal services, including contact details, services offered, and location information.",
    },
  ];
}

export async function loader({
  context,
  params,
}: {
  context: any;
  params: { serviceId: string };
}) {
  try {
    const token = context.get(authContext)?.token || null;

    return {
      serviceId: params.serviceId,
      token: token,
      error: null,
    };
  } catch (error) {
    handleRouteError(error, "Failed to load service details");
  }
}

export default function ServiceDetailPage({
  loaderData,
}: {
  loaderData: { serviceId: string; token: string | null; error: string | null };
}) {
  const { serviceId, error } = loaderData;
  const {
    data: service,
    isLoading,
    error: serviceError,
  } = useService(serviceId);

  const handleBack = () => {
    // Navigate back to legal hub
    window.location.href = "/legal-hub";
  };

  return <ServiceDetailScreen service={service} onBack={handleBack} />;
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
