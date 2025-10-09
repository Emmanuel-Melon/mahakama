type HeroSectionProps = {
  title: string;
  description: string;
};

export function HeroSection({ title, description }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Sketchy background pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url(" + 
            "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E" +
            "%3Cpath d='M54.63 16.13a3 3 0 0 1 .37 3.8v.1l-1.5 2.6c-.3.4-.8.5-1.2.2l-1.3-.8c-.4-.3-.5-.8-.2-1.2l.6-1.1-41.8 24.13 1.2 2.1c.3.4.2.9-.2 1.2l-1.3.8c-.4.2-.9.2-1.2-.2l-1.2-2.1c-.1-.1-.2-.3-.2-.4V16.2c0-.4.2-.7.5-.9l16.1-9.3c.2-.1.4-.2.6-.2l16.4.1c.2 0 .4.1.6.2l16.1 9.3c.1.1.2.2.2.4z' fill='%233b82f6' fill-opacity='0.2'/%3E" +
            "%3C/svg%3E"
            + ")"
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center relative z-10">
          <div className="relative inline-block">
            <h1 className="text-4xl font-black text-gray-900 sm:text-5xl md:text-6xl font-serif">
              {title}
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-3 bg-yellow-200/60 -rotate-1 transform scale-x-110 -z-10"></div>
          </div>
          
          <p className="mt-8 text-lg leading-8 text-gray-700 max-w-2xl mx-auto font-medium">
            {description}
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/search"
              className="relative px-6 py-3 text-sm font-bold text-gray-900 border-2 border-gray-900 bg-yellow-400 hover:bg-yellow-300 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              style={{
                borderRadius: '8px 16px 8px 16px',
                boxShadow: '3px 3px 0 0 #000',
              }}
            >
              Get Started
              <span className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900"></span>
              <span className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900"></span>
            </a>
            
            <a 
              href="#how-it-works" 
              className="group inline-flex items-center text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Learn more
              <svg 
                className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
                style={{strokeWidth: '2.5'}}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </div>
        
        {/* Hand-drawn decorative elements */}
        <div className="absolute left-10 top-20 w-24 h-24 border-4 border-blue-200 rounded-full opacity-70"></div>
        <div className="absolute right-20 top-1/4 w-16 h-16 border-4 border-yellow-200 rounded-full opacity-50"></div>
        <div className="absolute left-1/4 bottom-20 w-12 h-12 border-4 border-blue-200 rounded-full opacity-60"></div>
      </div>
      
      {/* Sketchy border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-900"></div>
    </div>
  );
}
