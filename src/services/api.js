const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = 'The backend request failed.';
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.detail || errorMessage;
    } catch {
      errorMessage = await response.text();
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export async function checkBackendHealth() {
  return request('/health');
}

export async function sendChatMessage(question) {
  return request('/chat', {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
}

export async function ingestDocuments() {
  return request('/ingest', {
    method: 'POST',
  });
}
