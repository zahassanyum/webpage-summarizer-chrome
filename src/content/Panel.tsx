import { useEffect, useState } from 'react'
import { marked } from 'marked'
import { summarizeCurrentTab, clearStoredSummary, getActiveTabUrl } from '../utils/summarizer'

const Panel = () => {
  const [summary, setSummary] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

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

    // Listen for toggle panel message from background script
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'TOGGLE_PANEL') {
        setIsVisible(prev => !prev)
      }
      return true
    })
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-lg z-[9999] flex flex-col">
      <div className="bg-sky-100 p-4 flex justify-between items-center">
        <h3 className="text-lg font-bold">Page Summary</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="text-center text-gray-600">
            Summarizing the webpage...
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(summary) }}
          />
        )}
      </div>

      {!isLoading && (
        <div className="border-t p-4 text-center">
          <button 
            onClick={() => getSummary(true)}
            className="text-sm text-blue-500 hover:text-blue-700 hover:underline"
            disabled={isLoading}
          >
            ↻ Regenerate summary
          </button>
        </div>
      )}
    </div>
  )
}

export default Panel