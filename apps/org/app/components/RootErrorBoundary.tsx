import { ERROR_MAP, DEFAULT_ERROR } from "@mah/client/errors";
import type { RootErrorBoundaryProps } from "@mah/client/errors";
import { isRouteErrorResponse } from "react-router";
import { getErrorComponent } from "~/lib/errors/errors.registry";

interface ErrorBoundaryProps {
  status?: number;
  statusText?: string;
  internal?: boolean;
  data?: string;
}

export const MahErrorBoundary = ({ status, data }: ErrorBoundaryProps) => {
  const ErrorComponent = getErrorComponent(status);

  const config = (status && ERROR_MAP[status]) || DEFAULT_ERROR;

  return <ErrorComponent {...config} data={data} />;
};

export const RootErrorBoundary = ({ error }: RootErrorBoundaryProps) => {
  let status: number | undefined;
  let data: string | undefined;
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    status = error.status;
    data = error.data;
  } else if (error instanceof Error) {
    stack = import.meta.env.DEV ? error.stack : undefined;
  }

  return (
    <>
      <MahErrorBoundary status={status} data={data} />
      {stack && (
        <pre className="w-full p-4 overflow-x-auto text-xs">
          <code>{stack}</code>
        </pre>
      )}
    </>
  );
};
