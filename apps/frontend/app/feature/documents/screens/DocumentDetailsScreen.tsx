import { PageHeader } from "~/layouts/PageHeader";
import {
  DocumentDetailsHeader,
  DocumentHighlights,
  RelatedDocuments,
} from "~/feature/documents/components";
import { type Document } from "@mah/api/clients/documents.api";
import type { AsyncState } from "@mah/api/api.types";

interface DocumentDetailsScreenProps extends AsyncState {
  document: Document;
}

export const DocumentDetailsScreen = ({
  document,
  error,
}: DocumentDetailsScreenProps) => {
  if (!document) {
    return (
      <div className="text-center p-6 max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {error ? "Error Loading Document" : "Document Not Found"}
        </h1>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "Legal Database", to: "/documents" },
    {
      label: document.type === "Case Law" ? "Case Law" : document.type,
      to: `/documents?type=${document.type.toLowerCase()}`,
    },
    { label: document.title, to: `#` },
  ];

  return (
    <>
      <PageHeader breadcrumbs={breadcrumbs} className="hidden sm:flex" />
      <DocumentDetailsHeader document={document} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <DocumentHighlights
            highlights={[
              `Key provision in Section 4.2 about ${document.type} requirements`,
              `Important update in the ${new Date(document.updatedAt).getFullYear()} version`,
              `Special considerations for ${document.type === "Act" ? "legal" : "regulatory"} compliance`,
              `Recent amendments effective from ${document.lastUpdated}`,
            ]}
          />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <RelatedDocuments
            documents={[
              {
                id: "2",
                title: "Land Acquisition Act 2021",
                type: "Act",
                lastUpdated: "2023-05-15",
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};
