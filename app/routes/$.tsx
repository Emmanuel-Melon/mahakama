import { Link } from "react-router";
import { Scale, Home, Search } from "lucide-react";
import { IconContainer } from "~/components/icon-container";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Decorative Blobs */}
        <div className="absolute -left-4 -top-2 w-12 h-12 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -right-4 -bottom-2 w-12 h-12 bg-secondary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

        {/* Main Content */}
        <div className="text-center space-y-8 flex items-center justify-center min-h-[70vh]">

          <div className="space-y-6 w-full">
            {/* 404 Text */}
            <div className="relative">
              <h1 className="text-7xl md:text-8xl font-extrabold text-gray-900 mb-3">
                404
                <span className="inline-block w-4 h-4 ml-3 bg-yellow-400 rounded-full animate-pulse"
                  style={{
                    boxShadow: "0 0 0 0 rgba(250, 204, 21, 0.4)",
                    filter: "drop-shadow(-1px 1px 0px rgba(0,0,0,0.1)) drop-shadow(1px -1px 0px rgba(0,0,0,0.1))",
                  }}
                ></span>
              </h1>
              <div 
                className="w-24 h-2 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full mx-auto mb-4"
                style={{
                  borderRadius: "8px 4px 4px 8px",
                  boxShadow: "2px 2px 0px rgba(0,0,0,0.1)",
                  transform: "skewX(-2deg)",
                }}
              ></div>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                Page Not Found
              </p>
            </div>

            <p className="text-gray-600 text-lg max-w-md mx-auto">
              The page you're looking for doesn't exist. It might have been moved, deleted, or you may have followed an incorrect link.
            </p>

            {/* Decorative Box */}
            <div
              className="bg-white border-2 border-gray-900 p-6 md:p-8 relative inline-block w-full max-w-xl mx-auto"
              style={{
                borderRadius: "8px 16px 8px 16px",
                boxShadow: "3px 3px 0 0 #000",
              }}
            >
              <span className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900 bg-yellow-300"></span>
              <span className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900 bg-yellow-300"></span>

              <div className="space-y-6">
                {/* Quick Links */}
                <div className="space-y-3">
                  <p className="font-bold text-gray-700 text-sm uppercase tracking-wider">
                    Here's where you can go instead:
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-900 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
                      style={{
                        boxShadow: "2px 2px 0 0 #000",
                        borderRadius: "4px 8px 4px 8px",
                      }}
                    >
                      <Home className="w-5 h-5" />
                      Home
                    </Link>
                    <Link
                      to="/lawyers"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-900 bg-white hover:bg-gray-50 text-gray-900 font-bold transition-all hover:shadow-lg hover:-translate-y-0.5"
                      style={{
                        boxShadow: "2px 2px 0 0 #000",
                        borderRadius: "4px 8px 4px 8px",
                      }}
                    >
                      <Search className="w-5 h-5" />
                      Find a Lawyer
                    </Link>
                  </div>
                </div>

                {/* Error Details */}
                <div className="pt-4 border-t-2 border-gray-900 text-left">
                  <p className="text-xs font-mono text-gray-500 bg-gray-50 p-3 border border-gray-200">
                    Error Code: 404 Not Found
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center text-sm text-gray-600 mt-8">
          <p>
            Need help? Try{" "}
            <Link
              to="/"
              className="font-bold text-yellow-600 hover:text-yellow-700 hover:underline transition-colors"
            >
              returning to the homepage
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CatchAll() {
  return <NotFound />;
}