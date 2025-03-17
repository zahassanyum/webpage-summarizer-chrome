import { useEffect, useState } from 'react'
import './App.css'
import { summarizeCurrentTab, clearStoredSummary, getActiveTabUrl } from './utils/summarizer'
import { SummaryCard } from './components/SummaryCard'

function App() {
  const [chunks, setChunks] = useState<string[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isComplete, setIsComplete] = useState(false)

  const getSummary = async (clearStorage: boolean = false) => {
    setChunks([])
    setIsLoading(true)
    setIsComplete(false)
    if (clearStorage) {
      const url = await getActiveTabUrl();
      await clearStoredSummary(url);
    }
    try {
      await summarizeCurrentTab((chunk) => {
        setChunks(prev => {
          if (prev.length === 0) setIsLoading(false);
          return [...prev, chunk];
        });
      });
      setIsComplete(true);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
      setIsComplete(true);
    }
  }

  useEffect(() => {
    getSummary()
  }, [])

  return (
    <SummaryCard 
      chunks={error ? [error] : chunks}
      isLoading={isLoading}
      isComplete={isComplete}
      onRegenerate={() => getSummary(true)}
    />
  )
}

export default App
