# RAG Chatbot Frontend

This is the React + Tailwind frontend for the beginner-friendly RAG chatbot. It sends user questions to the FastAPI backend, shows the chat history, and displays source references returned by the backend.

## Prerequisites

Before starting the frontend, make sure:

- Node.js and npm are installed
- the backend is running on `http://127.0.0.1:8000`
- a `.env` file is configured with `VITE_API_BASE_URL`

Check the versions:

```bash
node -v
npm -v
```

## Create the frontend project

From the root `chatbot` folder:

```bash
mkdir frontend
cd frontend
```

Then initialize the project:

```bash
npm init vite@latest . -- --template react
```

If you already have the project files, skip the initialization step and continue with the existing directory.

## Install Tailwind CSS

Install dependencies:

```bash
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

Then configure the content files in `tailwind.config.js` and add the Tailwind directives in `src/index.css`.

## Create the frontend files

The project uses a small structure:

- `src/App.jsx` for the page state and screen layout
- `src/components/ChatWindow.jsx` for the chat area
- `src/components/ChatMessage.jsx` for each message and source list
- `src/components/ChatInput.jsx` for the form input and send button
- `src/components/LoadingIndicator.jsx` for the loading state
- `src/services/api.js` for backend calls

## Configure the API URL

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Set the value:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

This keeps the API base URL in one place and prevents hardcoded URLs across components.

## Start the frontend

Run:

```bash
npm run dev
```

The Vite dev server usually starts at:

```text
http://localhost:5173
```

## Connect the frontend to the backend

Make sure the backend is running:

```bash
cd ../backend
uvicorn app.main:app --reload
```

Then start the frontend in the separate folder:

```bash
cd ../frontend
npm run dev
```

When the frontend loads, it checks `/health` and then sends chat requests to `/chat`.

## Test the chat interface

1. Open the frontend in the browser
2. Confirm the backend status shows as online
3. Ask a question such as: `What is RAG?`
4. Check that the assistant response includes the answer and source metadata
5. Use the refresh button to trigger document ingestion again

## Troubleshooting

### API errors
Check that `VITE_API_BASE_URL` points to the correct backend URL.

### CORS problems
Confirm that the backend `FRONTEND_ORIGIN` matches the frontend origin, usually `http://localhost:5173`.

### Environment variables not loaded
Make sure the `.env` file exists and the variable name starts with `VITE_`.

### Frontend server not starting
Check whether `node_modules` is installed and whether the port `5173` is free.

### Requests fail silently
Open the browser developer tools and check the network tab for the HTTP error responses.

## Build for production

Run:

```bash
npm run build
```

This creates a `dist/` folder that can be deployed to a static host.
