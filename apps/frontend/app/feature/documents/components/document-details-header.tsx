import { FileText, Download, Share2, Bookmark, Calendar } from "lucide-react";
import { PageDetailHeader } from "~/layouts/page-detail-header";
import { type Document } from "@mah/api/clients/documents.api";

interface DocumentDetailsHeaderProps {
  document: Document;
}

export function DocumentDetailsHeader({
  document,
}: DocumentDetailsHeaderProps) {
  return (
    <PageDetailHeader
      type={document.type}
      title={document.title}
      description={document.description}
      icon={FileText}
      metadata={[
        {
          icon: Calendar,
          label: "Last updated",
          value: document.lastUpdated,
        },
        {
          icon: FileText,
          label: "Sections",
          value: "0",
        },
      ]}
      actions={[
        {
          label: "Download PDF",
          icon: Download,
          href: document.storageUrl,
          download: true,
          variant: "primary",
        },
        {
          label: "Share",
          icon: Share2,
          onClick: () => console.log("Share clicked"),
          variant: "secondary",
        },
        {
          label: "Save",
          icon: Bookmark,
          onClick: () => console.log("Save clicked"),
          variant: "secondary",
        },
      ]}
    />
  );
}
