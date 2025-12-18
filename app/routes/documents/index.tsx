import type { Route } from "./+types/index";
import { DocumentsScreen } from "~/feature/documents/screens/DocumentsScreen";
import { useDocuments } from "~/feature/documents/hooks/use-documents";
import { authContext, userContext } from "~/middleware/context";
import { ErrorState } from "~/components/async-state/error";

export function meta({ }: Route.MetaArgs) {
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

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const user = context.get(userContext);
    const token = context.get(authContext)?.token || null;
    return { user, token, error: null };
  } catch (error) {
    console.error("Error loading documents route:", error);
    return { 
      user: null, 
      token: null, 
      error: error instanceof Error ? error.message : "Failed to load user data" 
    };
  }
}

export default function LegalDatabase({ loaderData }: Route.ComponentProps) {
  const { user, token, error } = loaderData;
  if (error) return <ErrorState error={error} />;
  
  const { data: documents, error: documentsError, isLoading } = useDocuments();
  
  return (
    <DocumentsScreen 
      documents={documents || []} 
      error={documentsError} 
      isLoading={isLoading}
      isAuthenticated={!!user}
    />
  );
}
