type StepCardProps = {
  number: number;
  title: string;
  description: string;
};

export function StepCard({ number, title, description }: StepCardProps) {
  return (
    <li 
      className="relative p-6 bg-white border-2 border-gray-900 hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-y-1"
      style={{
        borderRadius: '16px 8px 16px 8px',
        border: '2px solid #000',
        boxShadow: '4px 4px 0 0 #000',
      }}
    >
      {/* Decorative corner elements */}
      <div className="absolute -right-2 -top-2 w-4 h-4 border-t-2 border-r-2 border-gray-900 bg-yellow-300"></div>
      <div className="absolute -left-2 -bottom-2 w-4 h-4 border-b-2 border-l-2 border-gray-900 bg-yellow-300"></div>
      
      <div className="flex flex-col items-center text-center gap-4">
        <div 
          className="w-14 h-14 flex items-center justify-center text-2xl font-black text-gray-900 relative z-10"
          style={{
            background: 'linear-gradient(145deg, #fde68a, #fcd34d)',
            borderRadius: '50%',
            border: '2px solid #000',
            boxShadow: '3px 3px 0 0 #000',
          }}
        >
          <span className="relative z-10">{number}</span>
          {/* Hand-drawn circle effect */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'transparent',
              border: '2px dashed rgba(0,0,0,0.1)',
              transform: 'rotate(15deg)',
            }}
          ></div>
        </div>
        
        <div className="relative">
          <h3 className="text-xl font-black text-gray-900 relative inline-block">
            {title}
            <div className="absolute -bottom-1 left-0 right-0 h-2 bg-yellow-200/60 -rotate-1 -z-10"></div>
          </h3>
          <p className="text-gray-700 mt-3 font-medium">{description}</p>
        </div>
      </div>
      
      {/* Hand-drawn underline for the card */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200"
        style={{
          clipPath: 'polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)',
        }}
      ></div>
    </li>
  );
}
