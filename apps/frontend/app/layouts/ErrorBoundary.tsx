import { isRouteErrorResponse } from "react-router";
import { Button } from "~/components/ui/button";
import { Home, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  error: any;
}

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto min-h-screen flex items-center justify-center">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <div className="text-red-600 text-4xl">⚠️</div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{message}</h1>
        <p className="text-lg text-gray-600 mb-8">{details}</p>

        {stack && (
          <details className="mb-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
              View Error Details
            </summary>
            <pre className="w-full p-4 bg-gray-50 rounded-lg text-left overflow-x-auto text-sm">
              <code className="text-red-600">{stack}</code>
            </pre>
          </details>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full sm:w-auto"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </main>
  );
}
