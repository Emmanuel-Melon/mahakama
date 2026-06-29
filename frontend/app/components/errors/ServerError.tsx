import { RefreshCw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ErrorState } from "../async-state/ErrorState";
import type { ErrorComponentProps } from "~/lib/errors/errors.types";

export const ServerError = ({
  icon,
  title,
  color,
  data,
}: ErrorComponentProps) => {
  return (
    <ErrorState
      icon={icon!}
      title={title!}
      iconColor={`text-${color}-600`}
      details={data}
      actions={
        <Button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh Page
        </Button>
      }
    />
  );
};
