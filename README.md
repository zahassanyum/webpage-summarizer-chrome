# Webpage Summarizer | Chrome Extension

A simple Chrome extension that summarizes web pages using OpenAI's `gpt-4o` model and Jina API. The extension extracts the content from the current tab, converts it to markdown using the free Jina Reader API (`r.jina.ai`), and generates a concise summary using OpenAI's language model. The summary prompt can be customizable. The output is displayed while streaming and the final output in markdown is rendered using the `marked` library.

Jina Reader API has a rate limit of 20 requests per minute which is sufficient in most cases. The summary generated by the extension is cached for 24 hours in the local storage.

## Installation

1. Clone the repository:

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory from the project

## Configuration

1. Click the extension icon and go to the options page
2. Enter your OpenAI API key
3. (Optional) Customize the summary prompt
4. Click "Save Settings"

## Usage

1. Navigate to any webpage you want to summarize
2. Click the extension icon in your browser toolbar
3. Wait for the summary to generate
4. Click "Regenerate summary" if you want a fresh summary

## Tech Stack

- React
- TypeScript
- Vite
- OpenAI API
- Jina Reader API
- Chrome Extension API
- Tailwind CSS (only really used in the options page)

## Development

If you've ever developed a Google Chrome™ extension, you might have wanted to automate the process of reloading your unpacked extension without the need of going through the extensions page.

[Extensions Reloader](https://chromewebstore.google.com/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) allows you to reload all unpacked extensions. It can be triggered by browsing to `http://reload.extensions`. You can do this automatically by watching the files in `dist` using a tool like [fswatch](https://emcrisostomo.github.io/fswatch/):
```
fswatch -o * | xargs -n1 -I{} open http://reload.extensions
```
