import { useEffect, useState } from 'react'
import { marked } from 'marked'
import './App.css'
import { summarizeCurrentTab, clearStoredSummary, getActiveTabUrl } from './utils/summarizer'

const SummaryCard = ({ content }: { content: string }) => {
  return (
    <div className="w-[560px] h-auto mx-auto shadow-md overflow-hidden bg-white">
      <div className="bg-orange-100 pb-4 p-6">
        <h3 className="text-lg font-bold">Webpage Summary</h3>
      </div>
      <div className="p-6 text-[16px]">
        <div 
          dangerouslySetInnerHTML={{ __html: marked(content) }}
        />
      </div>
    </div>
  );
}

function App() {
  const [summary, setSummary] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const getSummary = async (clearStorage: boolean = false) => {
    setIsLoading(true)
    if (clearStorage) {
      const url = await getActiveTabUrl();
      await clearStoredSummary(url);
    }
    const result = await summarizeCurrentTab()
    setIsLoading(false)
    if (result.error) {
      setError(result.error)
    } else {
      setSummary(result.summary)
    }
  }

  useEffect(() => {
    getSummary()
  }, [])

  return (
    <div>
      <SummaryCard 
        content={isLoading ? "Summarizing the webpage..." : (error || summary)}
      />
      {!isLoading && (
        <div className="text-center mt-4 mb-2">
          <button 
            onClick={() => getSummary(true)}
            className="text-sm text-blue-500 hover:text-blue-700 hover:underline mb-3"
            disabled={isLoading}
          >
            ↻ Regenerate summary
          </button>
        </div>
      )}
    </div>
  )
}



export default App
