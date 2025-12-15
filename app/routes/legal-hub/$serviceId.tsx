import { ServiceDetailScreen } from "~/feature/website/screens/ServiceDetailScreen";
import { parseCookies } from "~/lib/api/utils";

export function meta({ params }: { params: { serviceId: string } }) {
  return [
    { title: `Legal Service Details - Mahakama` },
    {
      name: "description",
      content: "View detailed information about legal services, including contact details, services offered, and location information.",
    },
  ];
}

export async function loader({ request, params }: { request: Request; params: { serviceId: string } }) {
  try {
    const cookieHeader = request.headers.get("Cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;
    
    return { 
      serviceId: params.serviceId,
      token: token || null,
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
  const { serviceId, token, error } = loaderData;

  const handleBack = () => {
    // Navigate back to legal hub
    window.location.href = "/legal-hub";
  };

  return (
    <ServiceDetailScreen 
      serviceId={serviceId} 
      token={token} 
      onBack={handleBack}
    />
  );
}
