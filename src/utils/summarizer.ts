import OpenAI from 'openai';
import { getSettings } from './settings';

interface StoredSummary {
    summary: string;
    timestamp: number;
}

const JINA_API_BASE = "https://r.jina.ai";
const OPENAI_MODEL = "gpt-4o";

// Helper: Get the URL of the active tab.
export function getActiveTabUrl(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url) {
        resolve(tabs[0].url);
      } else {
        reject("No active tab found or URL is undefined.");
      }
    });
  });
}

// Save summary to chrome storage
async function saveSummary(url: string, summary: string) {
  await chrome.storage.local.set({
    [url]: {
      summary,
      timestamp: Date.now()
    }
  });
}

// Get stored summary if it exists and is not older than 24 hours
async function getStoredSummary(url: string): Promise<StoredSummary | null> {
  const data = await chrome.storage.local.get(url);
  const stored = data[url] as StoredSummary;
  
  if (!stored) return null;
  
  // Check if summary is older than 24 hours
  const ONE_DAY = 24 * 60 * 60 * 1000;
  if (Date.now() - stored.timestamp > ONE_DAY) {
    await chrome.storage.local.remove(url);
    return null;
  }
  
  return stored;
}

// Clear summary from storage for a specific URL
export async function clearStoredSummary(url: string) {
  await chrome.storage.local.remove(url);
}

// Fetch the formatted markdown from the Jina API.
export async function fetchFormattedMarkdown(url: string): Promise<string> {
  const apiUrl = `${JINA_API_BASE}/${encodeURIComponent(url)}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch formatted markdown from Jina API: " + response.statusText);
  }
  return await response.text();
}

// Send the markdown content to OpenAI's API for summarization.
export async function fetchSummary(markdown: string, onData: (chunk: string) => void): Promise<void> {
  const settings = await getSettings();
  const apiKey = settings.apiKey;

  if (!apiKey) {
    throw new Error("OpenAI API key not found in settings");
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });

  const response = await openai.chat.completions.create({
    model: OPENAI_MODEL,
    messages: [
      {
        role: "system",
        content: "You are an assistant that summarizes text."
      },
      {
        role: "user",
        content: `${settings.prompt}:\n\n---\n\n${markdown}`
      }
    ],
    temperature: 0.7,
    stream: true // Enable streaming
  });

  for await (const chunk of response) {
    onData(chunk.choices[0].delta.content || '');
  }
}

// Main function to handle the entire process.
export async function summarizeCurrentTab(onData: (chunk: string) => void) {
  try {
    const url = await getActiveTabUrl();
    console.log("Processing URL:", url);

    // Check if we have a stored summary
    const stored = await getStoredSummary(url);
    if (stored) {
      console.log("Using cached summary");
      onData(stored.summary);
      return;
    }

    const markdown = await fetchFormattedMarkdown(url);
    console.log("Formatted markdown:", markdown);

    let summary = '';
    await fetchSummary(markdown, (chunk) => {
      summary += chunk;
      onData(chunk); // Pass each chunk to the onData callback
    });
    console.log("Summary:", summary);

    // Save the summary
    await saveSummary(url, summary);
  } catch (error) {
    console.error(error);
    return;
  }
}