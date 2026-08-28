import { NavLink } from "react-router";
import { ErrorState } from "../organisms/async-state/ErrorState";
import type { ErrorComponentProps } from "../../lib/errors/errors.types";

export const NotFoundError = ({
  icon,
  title,
  color,
  data,
}: ErrorComponentProps) => (
  <ErrorState
    icon={icon!}
    title={title!}
    iconColor={`text-${color}-500`}
    details={data}
    actions={
      <NavLink
        to="/"
        className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
        viewTransition
      >
        Go Home
      </NavLink>
    }
  />
);
