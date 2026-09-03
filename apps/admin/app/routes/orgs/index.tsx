import type { Route } from "./+types/index";
import { OrgsScreen } from "~/feature/orgs/screens/OrgsScreen";
import { useAppError } from "~/lib/errors/errors.registry";
import { MahErrorBoundary } from "~/components/RootErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Organizations - Mahakama Admin" },
    {
      name: "description",
      content: "Manage organizations",
    },
  ];
}

export default function OrgsRoute() {
  return <OrgsScreen />;
}

export function ErrorBoundary() {
  const error = useAppError();
  return <MahErrorBoundary status={error.status} data={error.data} />;
}