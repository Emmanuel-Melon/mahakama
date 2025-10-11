import { FileText, Clock, User, Tag, Download, Share2, Star, Bookmark, File, Folder, MoreVertical, Edit, History, Users, Lock, Globe, Eye } from 'lucide-react';
import type { MetaArgs, LoaderArgs, ComponentProps, LoaderData } from "./+types/document.details";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";

export function meta({ loaderData }: MetaArgs) {
  const { document } = loaderData;
  const title = document ? `${document.title} - Mahakama` : 'Document - Mahakama';
  
  return [
    { title },
    { name: "description", content: document?.description || 'View document details' },
  ];
}

export async function loader({ params }: LoaderArgs): Promise<LoaderData> {
  try {
    const { documentId } = params;
    // Mock data for the document
    const mockDocument = {
      id: documentId,
      title: 'Shareholders Agreement Template',
      description: 'Standard template for shareholder agreements in Kenya',
      content: 'This agreement is made and entered into as of [DATE] by and between...',
      category: 'Corporate Law',
      status: 'published' as const,
      createdAt: '2025-01-15T10:30:00Z',
      updatedAt: '2025-03-22T14:45:00Z',
      author: {
        id: 'auth-123',
        name: 'Jane Mwangi',
        title: 'Senior Partner',
        specialization: 'Corporate Law',
        avatarUrl: undefined,
      },
      lastModifiedBy: 'John Doe',
      tags: ['shareholders', 'agreement', 'template', 'corporate'],
      relatedDocuments: ['doc-456', 'doc-789'],
      versions: [
        { version: 2, updatedAt: '2025-03-22T14:45:00Z', updatedBy: 'John Doe', changes: 'Updated clauses 4.2 and 7.1' },
        { version: 1, updatedAt: '2025-01-15T10:30:00Z', updatedBy: 'Jane Mwangi', changes: 'Initial version' },
      ],
      isTemplate: true,
      accessLevel: 'team' as const,
      fileType: 'docx' as const,
      fileSize: '245 KB',
      downloadUrl: '/api/documents/doc-123/download',
      previewUrl: '/api/documents/doc-123/preview',
      wordCount: 3420,
      pageCount: 12,
      lastOpenedAt: '2025-10-10T09:15:00Z',
      lastOpenedBy: 'You',
      folderId: 'folder-456',
      folderName: 'Templates/Corporate',
      isBookmarked: true,
      isStarred: false,
      isShared: true,
      sharedWith: [
        { id: 'user-2', name: 'Alex Johnson', email: 'alex@example.com', role: 'editor' as const },
        { id: 'user-3', name: 'Sarah Kimani', email: 'sarah@example.com', role: 'viewer' as const },
      ],
    };

    return { document: mockDocument };
  } catch (error) {
    console.error('Error loading document:', error);
    return { document: null, error: 'Failed to load document' };
  }
}

function getFileIcon(type: string) {
  switch (type) {
    case 'pdf':
      return <File className="h-5 w-5 text-red-500" />;
    case 'docx':
      return <FileText className="h-5 w-5 text-blue-500" />;
    case 'txt':
      return <File className="h-5 w-5 text-gray-500" />;
    case 'md':
      return <FileText className="h-5 w-5 text-purple-500" />;
    default:
      return <File className="h-5 w-5 text-gray-400" />;
  }
}

function getStatusBadge(status: string) {
  const statusMap: Record<string, { label: string; color: string }> = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    review: { label: 'In Review', color: 'bg-blue-100 text-blue-800' },
    published: { label: 'Published', color: 'bg-green-100 text-green-800' },
    archived: { label: 'Archived', color: 'bg-yellow-100 text-yellow-800' },
  };
  
  const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
      {statusInfo.label}
    </span>
  );
}

export default function DocumentDetails({ loaderData }: ComponentProps) {
  const { document, error } = loaderData;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-6 max-w-md">
          <h1 className="text-2xl font-bold text-foreground mb-2">Document Not Found</h1>
          <p className="text-muted-foreground">We couldn't find the document you're looking for.</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-center">
          <div className="h-24 w-24 rounded-full bg-muted mx-auto mb-4"></div>
          <div className="h-6 w-48 bg-muted rounded mx-auto mb-2"></div>
          <div className="h-4 w-32 bg-muted rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-50">
                {getFileIcon(document.fileType)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
                  {document.isTemplate && (
                    <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                      Template
                    </Badge>
                  )}
                  {getStatusBadge(document.status)}
                </div>
     
                {document.folderName && (
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Folder className="h-4 w-4 mr-1" />
                    <span>{document.folderName}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}