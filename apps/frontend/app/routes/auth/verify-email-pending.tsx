import type { Route } from "./+types/verify-email-pending";
import { useAppError } from "~/components/errors/useAppError";
import { VerifyEmailPendingScreen } from "~/feature/auth/screens/VerifyEmailPendingScreen";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";
import { authPayloadContext } from "~/context";
import { useLoaderData } from "react-router";
import { createIsolatedClient } from "@mah/api/src/axios/axios.ssr";
import { UsersApiClient } from "@mah/api/src/clients/users.api";

export async function loader({ context, request }: Route.LoaderArgs) {
  const payload = context.get(authPayloadContext);
  console.log("payload", payload);
  if (!payload?.sub) return { user: null };

  const isolatedClient = createIsolatedClient(request);
  const usersApi = new UsersApiClient(isolatedClient);
  const fullUser = await usersApi.getUserById(payload.sub);

  console.log("api result", fullUser);

  return { user: fullUser.data };
}

export default function VerifyAccountPendingRoute() {
  const { user } = useLoaderData<typeof loader>();
  console.log("loader result", user);
  return <VerifyEmailPendingScreen user={user} />;
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}
