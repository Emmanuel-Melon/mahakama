

interface AnswerContentProps {
  answer: string;
}

export function AnswerContent({ answer }: AnswerContentProps) {
  return (
    <div>
      <div className="relative inline-block mb-3">
        <h3 className="text-2xl font-black text-gray-900 font-serif">Legal Answer</h3>
        <div className="absolute -bottom-1 left-0 right-0 h-2 bg-yellow-200/60 -rotate-1 transform -z-10"></div>
      </div>

      <div className="prose prose-sm max-w-none">
        <div 
          className="prose max-w-none" 
          dangerouslySetInnerHTML={{ 
            __html: answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
          }} 
        />
      </div>
    </div>
  );
}
