interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`border-t-2 border-gray-900 ${className}`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm font-medium text-gray-900">
            © {currentYear} Mahakama. All rights reserved.
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a 
              href="/privacy" 
              className="group relative text-sm font-bold text-gray-900 hover:text-yellow-600 transition-colors"
            >
              Privacy Policy
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-200"></span>
            </a>
            <a 
              href="/terms" 
              className="group relative text-sm font-bold text-gray-900 hover:text-yellow-600 transition-colors"
            >
              Terms of Service
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-200"></span>
            </a>
            <a 
              href="https://emmanuelgatwech.is-a.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative inline-flex items-center text-sm font-bold text-gray-900 hover:text-yellow-600 transition-colors"
            >
              Built by Emmanuel Gatwech
              <svg 
                className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                />
              </svg>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-200"></span>
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
