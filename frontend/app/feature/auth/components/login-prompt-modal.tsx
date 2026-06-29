import { Link } from "react-router";
import { X } from "lucide-react";

export const LoginPromptModal = ({
  action,
  onClose,
}: {
  action: string;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">Sign in required</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          To {action}, you need to sign in or create a free account.
        </p>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-medium"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-center font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};
