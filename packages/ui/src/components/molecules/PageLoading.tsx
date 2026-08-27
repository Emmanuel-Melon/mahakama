import { Loader2 } from "lucide-react";
import { Card } from "../Card";

interface PageLoadingProps {
  title?: string;
  description?: string;
  showSkeleton?: boolean;
  skeletonCount?: number;
  displayMode?: "grid" | "list";
  className?: string;
}

export function PageLoading({
  title = "Loading Content",
  description = "Please wait while we load your content...",
  showSkeleton = true,
  skeletonCount = 3,
  displayMode = "grid",
  className = "",
}: PageLoadingProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <Card className="bg-white">
        <div className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-3">
          Loading
        </div>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <div className="text-gray-700 text-sm">
              <p>{description}</p>
            </div>
          </div>
        </div>
      </Card>
      {showSkeleton && (
        <div className="space-y-4">
          {displayMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-900 rounded-lg p-6 animate-pulse"
                  style={{ borderRadius: "8px 16px 8px 16px" }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full border-2 border-gray-300"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from({ length: skeletonCount }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-900 rounded-lg p-6 animate-pulse"
                  style={{ borderRadius: "8px 16px 8px 16px" }}
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
                    <div className="flex-1 space-y-3">
                      <div className="space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="flex items-center gap-2 pt-2">
                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PageLoading;
