import { marked } from 'marked'

interface SummaryCardProps {
  chunks: string[]
  isLoading: boolean
  isComplete: boolean
  onRegenerate: () => void
}

export const SummaryCard = ({ chunks, isLoading, isComplete, onRegenerate }: SummaryCardProps) => {
  return (
    <div>
        <div className="w-[560px] h-auto mx-auto shadow-md overflow-hidden bg-white">
            <div className="bg-orange-100 pb-4 p-6">
                <h3 className="text-lg font-bold">Webpage Summary</h3>
            </div>
            <div className="p-6 text-[16px]">
                {isLoading ? (
                "Summarizing the webpage..."
                ) : (
                <div>
                    {isComplete ? (
                    <div dangerouslySetInnerHTML={{ 
                        __html: marked(chunks.join(''), { breaks: true }) 
                    }} />
                    ) : (
                    chunks.map((chunk, index) => (
                        <span key={index} className="chunk-fade-in">
                        {chunk}
                        </span>
                    ))
                    )}
                </div>
                )}
            </div>
        </div>

        {!isLoading && (
        <div className="text-center mt-4 mb-2">
            <button 
            onClick={onRegenerate}
            className="text-sm text-blue-500 hover:text-blue-700 hover:underline mb-3"
            disabled={isLoading}
            >
            ↻ Regenerate summary
            </button>
        </div>
        )}
    </div>
  );
}
