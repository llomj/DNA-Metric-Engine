# DNA Metric Engine

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API Key

Create a `.env` file in the root directory with your Google Gemini API key:

```
VITE_API_KEY=your_api_key_here
```

**To get your API key:**
1. Go to https://aistudio.google.com/app/apikey
2. Create a new API key
3. Copy it and paste it in the `.env` file

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
