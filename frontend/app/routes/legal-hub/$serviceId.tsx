import { ServiceDetailScreen } from "~/feature/website/screens/ServiceDetailScreen";
import { authContext } from "~/middleware/context";
import { useService } from "~/feature/website/hooks/use-services";
import { PageDetailsLoading } from "~/components/page-details-loading";
import { PageDetailsError } from "~/components/page-details-error";
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";
import { handleRouteError } from "~/lib/errors/errors.utils";

export function meta({ params }: { params: { serviceId: string } }) {
  return [
    { title: `Legal Service Details - Mahakama` },
    {
      name: "description",
      content: "View detailed information about legal services, including contact details, services offered, and location information.",
    },
  ];
}

export async function loader({ context, params }: { context: any; params: { serviceId: string } }) {
  try {
    const token = context.get(authContext)?.token || null;
    
    return { 
      serviceId: params.serviceId,
      token: token,
      error: null 
    };
  } catch (error) {
    handleRouteError(error, "Failed to load service details");
  }
}

export default function ServiceDetailPage({ loaderData }: { loaderData: { serviceId: string; token: string | null; error: string | null } }) {
  const { serviceId, error } = loaderData;
  const { data: service, isLoading, error: serviceError } = useService(serviceId);

  const handleBack = () => {
    // Navigate back to legal hub
    window.location.href = "/legal-hub";
  };

  return (
    <ServiceDetailScreen 
      service={service}
      onBack={handleBack}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return (
    <MahErrorBoundary
      status={error.status}
      data={error.data}
    />
  );
}
