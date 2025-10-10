interface ErrorProps {
  message?: string;
  details?: string;
  stack?: string;
}

export function Error({ 
  message = 'Oops!', 
  details = 'An unexpected error occurred.',
  stack 
}: ErrorProps) {
  return (
    <main className="pt-16 p-4 container mx-auto">
      <div className="relative inline-block">
        <h1 className="relative z-10 text-3xl font-bold text-gray-900 mb-4">
          {message}
        </h1>
        <div className="absolute -inset-2 bg-yellow-100 rounded-full -z-0 animate-pulse"></div>
      </div>
      
      <p className="text-gray-700 mb-6">{details}</p>
      
      <a 
        href="/" 
        className="relative group inline-block px-6 py-2 bg-gray-900 text-white font-medium rounded-md 
                  border-2 border-gray-900 hover:bg-transparent hover:text-gray-900 
                  transition-all duration-200"
      >
        <span className="relative z-10">Back to Home</span>
        <div className="absolute -inset-1 bg-yellow-100 rounded -z-0 group-hover:animate-pulse"></div>
      </a>
      
      {stack && (
        <pre className="w-full p-4 mt-8 bg-gray-50 rounded-md overflow-x-auto">
          <code className="text-sm text-gray-700">{stack}</code>
        </pre>
      )}
    </main>
  );
}
