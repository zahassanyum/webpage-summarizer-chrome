import { useEffect, useState } from 'react'
import { getSettings, saveSettings } from '../utils/settings'

function OptionsApp() {
  const [apiKey, setApiKey] = useState('')
  const [prompt, setPrompt] = useState('')
  const [saveStatus, setSaveStatus] = useState('')

  useEffect(() => {
    // Load settings when component mounts
    getSettings().then(settings => {
      setApiKey(settings.apiKey)
      setPrompt(settings.prompt)
    })
  }, [])

  const handleSave = async () => {
    try {
      await saveSettings({ apiKey, prompt })
      setSaveStatus('Settings saved successfully!')
      setTimeout(() => setSaveStatus(''), 3000)
    } catch (error) {
      setSaveStatus('Error saving settings')
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  return (
      <div className="relative py-3 mt-10 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-10">
          <div className="max-w-lg mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-2xl font-bold mb-8 text-gray-900">Extension Settings</h1>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OpenAI API Token
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="sk-..."
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Summary Prompt
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter the prompt for generating summaries..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Settings
                  </button>
                </div>

                {saveStatus && (
                  <div className="mt-4 text-center text-sm font-medium text-green-600">
                    {saveStatus}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default OptionsApp