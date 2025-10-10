export function AboutLegalDatabase() {
  return (
    <div className="mt-12 p-6 border-2 border-gray-900 rounded-lg relative bg-white">
      {/* Sketchy corner decorations */}
      <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-gray-900"></div>
      <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-gray-900"></div>
      <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-gray-900"></div>
      <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-gray-900"></div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center relative">
        <span className="relative z-10 inline-block px-1">
          <svg 
            className="w-5 h-5 mr-2 inline-block" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          About Our Legal Database
        </span>
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 -z-1"></span>
      </h3>
      
      <p className="text-gray-800 mb-5 leading-relaxed">
        Our legal database is continuously updated to reflect the most current laws and regulations. 
        Each document is carefully curated and includes:
      </p>
      
      <ul className="space-y-3 mb-6 pl-2">
        {[
          'Complete, unaltered legal text',
          'Version history and amendment tracking',
          'Cross-references to related laws and sections',
          'Plain-language summaries of key provisions'
        ].map((item, index) => (
          <li key={index} className="flex items-start group">
            <span className="inline-block w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 mr-2"></span>
            <span className="text-gray-800">{item}</span>
          </li>
        ))}
      </ul>
      
      <div className="p-4 border-2 border-dashed border-gray-300 rounded relative">
        <div className="absolute -top-2 left-4 px-2 bg-white text-xs font-mono text-gray-500">Note</div>
        <p className="text-sm text-gray-800">
          While we strive for accuracy, this information is for general guidance only. 
          For legal advice specific to your situation, please consult a qualified legal professional.
        </p>
      </div>
    </div>
  );
}
