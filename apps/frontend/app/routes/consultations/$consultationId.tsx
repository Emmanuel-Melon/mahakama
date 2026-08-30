import type { Route } from "./+types/$consultationId";
import { ConsultationDetailScreen } from "~/feature/consultations/screens/ConsultationDetailScreen";
import {
  useConsultation,
  useConsultationMutations,
} from "@mah/api/src/hooks/use-consultations";
import { authContext, userContext } from "~/middleware/context";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Consultation Details - Mahakama" },
    {
      name: "description",
      content: "View the details of a consultation request.",
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  const token = context.get(authContext)?.token || null;

  return { user, token };
}

export default function ConsultationDetailsRoute({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { user } = loaderData;
  const { consultationId } = params;
  const isLawyer = user?.role === "lawyer";

  const { data, isLoading } = useConsultation(consultationId || "");
  const { acceptConsultation, declineConsultation } =
    useConsultationMutations();

  return (
    <ConsultationDetailScreen
      consultation={data?.data}
      isLoading={isLoading}
      role={isLawyer ? "lawyer" : "customer"}
      onAccept={(id) => acceptConsultation.mutate({ consultationId: id })}
      onDecline={(id, declineReason) =>
        declineConsultation.mutate({
          consultationId: id,
          data: { declineReason },
        })
      }
      accepting={acceptConsultation.isPending}
      declining={declineConsultation.isPending}
      error={null}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
