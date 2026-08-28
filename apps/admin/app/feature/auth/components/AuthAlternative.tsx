import { NavLink } from "react-router";

type AuthAlternativeProps = {
  to: string;
  text: string;
  message: string;
};

export const AuthAlternative = ({
  to,
  text,
  message,
}: AuthAlternativeProps) => {
  return (
    <p className="mt-8 text-center text-gray-600 font-medium">
      {message}{" "}
      <NavLink
        to={to}
        className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
      >
        {text}
      </NavLink>
    </p>
  );
};
