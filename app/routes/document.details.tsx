import type {
  MetaArgs,
  LoaderArgs,
  ComponentProps,
  LoaderData,
} from "./+types/document.details";
import { PageLayout } from "~/components/layouts/page-layout";
import {
  DocumentDetailsHeader,
  DocumentMetadata,
  DocumentHighlights,
  RelatedDocuments,
} from "~/components/documents";
import { DiagonalSeparator } from "~/components/diagnoal-separator";

export function meta({ loaderData }: MetaArgs) {
  const { document } = loaderData;
  const title = document
    ? `${document.title} - Mahakama`
    : "Document - Mahakama";

  return [
    { title },
    {
      name: "description",
      content: document?.description || "View document details",
    },
  ];
}

export async function loader({ params }: LoaderArgs): Promise<LoaderData> {
  try {
    const { documentId } = params;
    const response = await fetch(
      `https://makakama-api.netlify.app/.netlify/functions/api/documents/${documentId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch document");
    }

    const document = await response.json();
    return { document };
  } catch (error) {
    console.error("Error loading document:", error);
    return { document: null, error: "Failed to load document" };
  }
}

export default function DocumentDetails({ loaderData }: ComponentProps) {
  const { document, error } = loaderData;

  if (error || !document) {
    return (
      <PageLayout className="flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {error ? "Error Loading Document" : "Document Not Found"}
          </h1>
          <p className="text-muted-foreground">
            {error || "We couldn't find the document you're looking for."}
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className="space-y-6">
      <DocumentDetailsHeader document={document} />
      <DiagonalSeparator />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Left Pane - Document Highlights and Related Documents */}
        <div className="lg:col-span-2 space-y-6">
          <DocumentHighlights
            documents={[
              {
                id: "2",
                title: "Land Acquisition Act 2021",
                type: "Act",
                lastUpdated: "2023-05-15",
              },
            ]}
            highlights={[
              `Key provision in Section 4.2 about ${document.type} requirements`,
              `Important update in the ${new Date(document.updatedAt).getFullYear()} version`,
              `Special considerations for ${document.type === "Act" ? "legal" : "regulatory"} compliance`,
              `Recent amendments effective from ${document.lastUpdated}`,
            ]}
          />
        </div>

        {/* Right Pane - Document Metadata */}
        <div className="lg:col-span-1">
          <DocumentMetadata
            type={document.type}
            sections={document.sections}
            lastUpdated={document.lastUpdated}
            createdAt={document.createdAt}
          />
        </div>
      </div>
    </PageLayout>
  );
}
