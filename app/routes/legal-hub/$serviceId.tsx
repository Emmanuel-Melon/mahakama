import { ServiceDetailScreen } from "~/feature/website/screens/ServiceDetailScreen";
import { authContext } from "~/middleware/context";
import { useService } from "~/feature/website/hooks/use-services";
import { LoadingState } from "~/components/async-state/loading";
import { ErrorState } from "~/components/async-state/error";

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
    console.error("Error loading service details:", error);
    return { 
      serviceId: params.serviceId,
      token: null,
      error: error instanceof Error ? error.message : "Failed to load service details" 
    };
  }
}

export default function ServiceDetailPage({ loaderData }: { loaderData: { serviceId: string; token: string | null; error: string | null } }) {
  const { serviceId, error } = loaderData;

  const { data: service, isLoading, error: serviceError } = useService(serviceId);

  const handleBack = () => {
    // Navigate back to legal hub
    window.location.href = "/legal-hub";
  };

  if (isLoading) return <LoadingState />;
  
  const errorMessage = serviceError 
    ? (serviceError instanceof Error ? serviceError.message : "Failed to load service details")
    : error;

  if (serviceError || error) return <ErrorState error={errorMessage || "Failed to load service details"} />;
  
  if (!service) return <ErrorState error="Service not found" />;

  return (
    <ServiceDetailScreen 
      service={service}
      onBack={handleBack}
    />
  );
}
