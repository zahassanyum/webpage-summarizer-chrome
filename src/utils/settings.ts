interface Settings {
  apiKey: string;
  prompt: string;
}

const defaultSettings: Settings = {
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
  prompt: "Please summarize the text provided below, using clear, simple language and highlight its key points."
};

export async function saveSettings(settings: Settings): Promise<void> {
  await chrome.storage.local.set({ settings });
}

export async function getSettings(): Promise<Settings> {
  const result = await chrome.storage.local.get('settings');
  return result.settings || defaultSettings;
}