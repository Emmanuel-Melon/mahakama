import { PageHeader, PageLayout } from "~/layouts/page-layout";
import {
  DocumentDetailsHeader,
  DocumentMetadata,
  DocumentHighlights,
} from "~/feature/documents/components";
import { DiagonalSeparator } from "~/components/diagnoal-separator";
import type { components } from "~/lib/api/generated/api.types";

export type Document = components["schemas"]["Document"];
export type DocumentResource = components["schemas"]["DocumentResource"];
export type DocumentSingleResponse = components["schemas"]["DocumentSingleResponse"];
export type DocumentsCollectionResponse = components["schemas"]["DocumentsCollectionResponse"];

export const DocumentDetailsScreen = ({ document, error }: { document: Document, error: string }) => {

  if (!document) {
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

  const breadcrumbs = [
    { label: "Home", to: "/" },
    { label: "Legal Database", to: "/legal-database" },
    {
      label: document.type === "Case Law" ? "Case Law" : document.type,
      to: `/legal-database?type=${document.type.toLowerCase()}`,
    },
    { label: document.title, to: `#` },
  ];

  return (
    <PageLayout className="space-y-6">
      <PageHeader breadcrumbs={breadcrumbs} className="hidden sm:flex" />
      <DocumentDetailsHeader document={document} />
      <DiagonalSeparator />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
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
