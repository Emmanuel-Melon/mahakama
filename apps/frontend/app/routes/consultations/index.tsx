import type { Route } from "./+types/index";
import { ConsultationsScreen } from "~/feature/consultations/screens/ConsultationsScreen";
import {
  useConsultations,
  useConsultationMutations,
} from "@mah/api/src/hooks/use-consultations";
import { authContext, userContext } from "~/middleware/context";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";
import { handleRouteError } from "@mah/client/errors";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Consultations" },
    {
      name: "description",
      content: "Track your consultation requests and responses.",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  const token = context.get(authContext)?.token || null;

  return { user, token };
}

export default function ConsultationsIndex({
  loaderData,
}: Route.ComponentProps) {
  const { user } = loaderData;
  const isLawyer = user?.role === "lawyer";

  const { data: consultationsPage, isLoading } = useConsultations(
    isLawyer ? { lawyerUserId: user?.id } : { customerId: user?.id },
  );

  const { acceptConsultation, declineConsultation } =
    useConsultationMutations();

  const consultations = consultationsPage?.data ?? [];

  return (
    <ConsultationsScreen
      consultations={consultations}
      isLoading={isLoading}
      role={isLawyer ? "lawyer" : "customer"}
      onAccept={(id) => acceptConsultation.mutate({ consultationId: id })}
      onDecline={(id, declineReason) =>
        declineConsultation.mutate({
          consultationId: id,
          data: { declineReason },
        })
      }
      error={null}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
