import type { Route } from "./+types/index";
import { DocumentsScreen } from "~/feature/documents/screens/DocumentsScreen";
import {
  documentsKeys,
  useDocuments,
} from "~/feature/documents/hooks/use-documents";
import { authContext, userContext } from "~/middleware/context";
import { useState } from "react";
import {
  createPrefetchLoader,
  prefetch,
} from "~/lib/react-query/react-query.utils";
import { documentsApi } from "~/lib/api/documents.api";
import { useAppError } from "~/components/errors/useAppError";
import { MahErrorBoundary } from "~/components/errors/ErrorBoundary";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Legal Database - Access South Sudan & Uganda Laws" },
    {
      name: "description",
      content:
        "Free access to comprehensive legal documents from South Sudan and Uganda. Search and browse national constitutions, criminal codes, and other essential legislation in one place.",
    },
    {
      name: "keywords",
      content:
        "South Sudan laws, Uganda legal documents, free legal texts, criminal code, constitution, labor laws, legal database, African law",
    },
    {
      name: "og:title",
      content: "Free Legal Database - South Sudan & Uganda Laws",
    },
    {
      name: "og:description",
      content:
        "Access complete legal texts from South Sudan and Uganda. Search and download official legal documents, all in one place.",
    },
    { name: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Legal Database - South Sudan & Uganda" },
    {
      name: "twitter:description",
      content:
        "Your free resource for accessing and understanding the laws of South Sudan and Uganda. Search and browse legal documents with ease.",
    },
  ];
}

const prefetchDocuments = createPrefetchLoader([
  prefetch({
    queryKey: documentsKeys.documents(),
    queryFn: () => documentsApi.getDocuments(),
    staleTime: 1000 * 60 * 5,
  }),
]);

export async function loader({ context }: Route.LoaderArgs) {
  const user = context.get(userContext);
  const token = context.get(authContext)?.token || null;
  // Uses allSettled internally, so a failed prefetch never throws the loader.
  await prefetchDocuments();

  return { user, token };
}

export default function LegalDatabase({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  const { data: documents = [], isLoading } = useDocuments();
  const [displayMode, setDisplayMode] = useState<"grid" | "list">("grid");

  return (
    <DocumentsScreen
      documents={documents}
      isLoading={isLoading}
      isAuthenticated={!!user}
      displayMode={displayMode}
      onDisplayModeChange={setDisplayMode}
    />
  );
}

export function ErrorBoundary() {
  const error = useAppError();

  return <MahErrorBoundary status={error.status} data={error.data} />;
}
