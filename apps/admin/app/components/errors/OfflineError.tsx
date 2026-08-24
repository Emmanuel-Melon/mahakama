import { RefreshCw } from "lucide-react";
import { ErrorState } from "../async-state/ErrorState";
import type { ErrorComponentProps } from "~/lib/errors/errors.types";

export const OfflineError = ({
  icon,
  title,
  color,
  data,
}: ErrorComponentProps) => {
  return (
    <ErrorState
      icon={icon!}
      title={title!}
      iconColor={`text-${color}-500`}
      details={data}
      actions={
        <button
          onClick={() => window.location.reload()}
          className="bg-gray-700 hover:bg-gray-800"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Try Again
        </button>
      }
    />
  );
};
