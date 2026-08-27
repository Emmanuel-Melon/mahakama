interface PageDetailsLoadingProps {
  title?: string;
  description?: string;
  showSkeleton?: boolean;
  skeletonCount?: number;
  className?: string;
}

export function PageDetailsLoading({
  title = "Loading Details",
  description = "Please wait while we load the details...",
  showSkeleton = true,
  skeletonCount = 3,
  className = "",
}: PageDetailsLoadingProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Page Header Skeleton */}
      <div className="animate-pulse">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      {/* Page Detail Header Skeleton */}
      <div className="animate-pulse">
        <div
          className="bg-white border-2 border-gray-900 rounded-lg p-6"
          style={{ borderRadius: "8px 16px 8px 16px" }}
        >
          <div className="flex items-start gap-6">
            {/* Profile Image Skeleton */}
            <div className="w-24 h-24 bg-gray-200 rounded-full border-2 border-gray-300 flex-shrink-0"></div>

            {/* Title and Metadata Skeleton */}
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              </div>

              {/* Metadata Items Skeleton */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex gap-3 pt-2">
                <div className="h-10 bg-gray-200 rounded w-32"></div>
                <div className="h-10 bg-gray-200 rounded w-28"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton Sections */}
      {showSkeleton && (
        <div className="space-y-6">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div
                className="bg-white border-2 border-gray-900 rounded-lg p-6"
                style={{ borderRadius: "8px 16px 8px 16px" }}
              >
                {/* Section Header */}
                <div className="space-y-3 mb-4">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>

                {/* Section Content */}
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>

                {/* Additional content variations */}
                {index % 2 === 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                  </div>
                )}

                {index % 3 === 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PageDetailsLoading;
