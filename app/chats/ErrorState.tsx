interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  title?: string;
  buttonText?: string;
}

export function ErrorState({
  error,
  onRetry,
  title = "Unable to load chats",
  buttonText = "Try Again",
}: ErrorStateProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 text-center">
      <div className="py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
