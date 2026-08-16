import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";
import { ErrorState } from "../async-state/ErrorState";
import type { ErrorComponentProps } from "~/lib/errors/errors.types";

export const AccessDeniedError = ({
  icon,
  title,
  color,
}: ErrorComponentProps) => {
  const navigate = useNavigate();
  return (
    <ErrorState
      icon={icon!}
      title={title!}
      iconColor={`text-${color}-500`}
      actions={
        <Button
          onClick={() => navigate(-1)}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Go Back
        </Button>
      }
    />
  );
};
