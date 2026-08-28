import { PageHeader } from "@mah/ui";
import {
  CorpusDetailsHeader,
  CorpusHighlights,
  RelatedCorpus,
} from "~/feature/corpus/components";
import { type Corpus } from "@mah/api/src/clients/corpus.api";
import type { AsyncState } from "@mah/api/src/api/api.types";

interface CorpusDetailsScreenProps extends AsyncState {
  document: Corpus;
}

export const CorpusDetailsScreen = ({
  document,
  error,
}: CorpusDetailsScreenProps) => {
  if (!document) {
    return (
      <div className="text-center p-6 max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {error ? "Error Loading Corpus" : "Corpus Not Found"}
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
      <CorpusDetailsHeader document={document} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <CorpusHighlights
            highlights={[
              `Key provision in Section 4.2 about ${document.type} requirements`,
              `Important update in the ${new Date(document.updatedAt).getFullYear()} version`,
              `Special considerations for ${document.type === "Act" ? "legal" : "regulatory"} compliance`,
              `Recent amendments effective from ${document.lastUpdated}`,
            ]}
          />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <RelatedCorpus
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
