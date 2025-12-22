import { ServiceDetailScreen } from "~/feature/website/screens/ServiceDetailScreen";
import { authContext } from "~/middleware/context";
import { useService } from "~/feature/website/hooks/use-services";
import { PageDetailsLoading } from "~/components/page-details-loading";
import { PageDetailsError } from "~/components/page-details-error";

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

  if (isLoading) return <PageDetailsLoading 
    title="Loading Service Details" 
    description="Please wait while we load the service information..."
    showSkeleton={false}
  />;
  
  const errorMessage = serviceError 
    ? (serviceError instanceof Error ? serviceError.message : "Failed to load service details")
    : error;

  if (serviceError || error) return <PageDetailsError 
    error={errorMessage || "Failed to load service details"}
    title="Error Loading Service"
    description="We couldn't load the service details. Please try again later."
  />;
  
  if (!service) return <PageDetailsError 
    error="Service not found"
    title="Service Not Found"
    description="The requested service could not be found. It may have been moved or is no longer available."
  />;

  return (
    <ServiceDetailScreen 
      service={service}
      onBack={handleBack}
    />
  );
}
