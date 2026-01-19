#deployment
https://llomj.github.io/DNA-Metric-Engine/

#This phone app is a build in philosopher AI called Tjump (philosopher youtuber). User can customise DNA metrics into the model, create logical rules, epistimology etc. App shows logical inconsistencies, logical fallacies etc. API key required. paste API key in "key icon" in app.

#AI agent tools used to build app. Google AI studio, Antigravity, cursor, opencode.

# DNA Metric Engine

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Key

**IMPORTANT: API keys are stored CLIENT-SIDE ONLY (in your browser's localStorage). They are NEVER uploaded to GitHub or shared.**

**Option 1: Use the App (Recommended)**
1. Open the app
2. Click the 🔑 key icon in the header
3. Enter your Google Gemini API key
4. Click Save
5. The key is stored securely in your browser only

**Option 2: Environment Variable (Development Only)**
Create a `.env` file in the root directory (this file is gitignored and will NOT be committed):

```
VITE_API_KEY=your_api_key_here
```

**To get your API key:**
1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Use the 🔑 icon in the app to save it (recommended) or add it to `.env` for development

### 3. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Features

- Chat with AI models based on DNA profiles
- Upload DNA files (.txt, .rtf) to create new models
- Customize model behavior with system controls
- View and manage multiple DNA profiles

## Troubleshooting

If the model is not responding:
- Check that your `.env` file exists and contains `VITE_API_KEY=your_key`
- Restart the dev server after creating/updating `.env`
- Check the browser console for error messages
