import type { Route } from "./+types/$lawyerId";
import { getForwardHeaders } from "~/lib/api/utils";
import { lawyersApi } from "~/lib/api/lawyers.api";
import { LawyerProfileScreen } from "~/feature/lawyers/screens/LawyerProfileScreen";

export function meta({ loaderData }: Route.MetaArgs) {
  const { lawyer } = loaderData;
  const title = lawyer
    ? `${lawyer.name}'s Profile - Mahakama`
    : "Lawyer Profile - Mahakama";

  return [
    { title },
    {
      name: "description",
      content: `View the profile of ${lawyer?.name || "our legal expert"}. Contact for professional legal services.`,
    },
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  try {
    const { lawyerId } = params;
    const originalHeaders = getForwardHeaders(request);
    if (!lawyerId) {
      throw new Error("Lawyer ID is required");
    }

    const lawyer = await lawyersApi.getLawyerById(lawyerId, {
      headers: originalHeaders,
    });
    
    if (!lawyer.id || !lawyer.name) {
      throw new Error("Incomplete lawyer data received from the server");
    }

    return { lawyer };
  } catch (error) {
    console.error("Error loading lawyer profile:", error);
    return {
      lawyer: null,
      error:
        error instanceof Error
          ? error.message
          : "Failed to load lawyer profile",
    };
  }
}

export default function LawyerProfile({ loaderData }: Route.ComponentProps) {
  const { lawyer, error } = loaderData;
  return (
    <LawyerProfileScreen lawyer={lawyer} error={error} />
  );
}
