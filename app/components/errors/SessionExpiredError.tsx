import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";
import { ErrorState } from "../async-state/ErrorState";
import type { ErrorComponentProps } from "~/lib/errors/errors.types";

export const SessionExpiredError = ({ icon, title, color, data }: ErrorComponentProps) => {
  const navigate = useNavigate();
  return (
    <ErrorState
      icon={icon!}
      title={title!}
      iconColor={`text-${color}-500`}
      actions={
        <Button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700">
          Log in
        </Button>
      }
    />
  );
};