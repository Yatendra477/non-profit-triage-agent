/**
 * useAnalyze — handles the POST /triage API call.
 * Manages loading, result, and error state.
 */
import { useState } from 'react';

// ── API base URL (empty = same origin, works with Vite proxy in dev) ────────
const API_BASE = '';

/**
 * Map the backend's /triage response fields to the UI's expected shape.
 * Backend returns: { intent, urgency, route, response, entities, escalated, session_id }
 * UI uses:         { category, urgency, team, response, entities }
 */
function mapResponse(data) {
  return {
    category:  data.intent   ?? 'General Inquiry',
    urgency:   data.urgency  ?? 'Low',
    team:      data.route    ?? 'general_support',
    response:  data.response ?? '',
    escalated: data.escalated ?? false,
    session_id: data.session_id ?? null,
    entities: {
      name:      data.entities?.full_name     ?? '',
      email:     data.entities?.email         ?? '',
      phone:     data.entities?.phone_number  ?? '',
      location:  data.entities?.location      ?? '',
      case_id:   data.entities?.case_id       ?? '',
      date:      data.entities?.date          ?? '',
    },
  };
}

export function useAnalyze() {
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState(null);

  /**
   * Analyze a support message.
   * @param {string} message    - The support message text
   * @param {string} sessionId  - Optional session identifier
   */
  const analyze = async (message, sessionId) => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const payload = {
        message,
        ...(sessionId ? { session_id: sessionId } : {}),
      };

      const res = await fetch(`${API_BASE}/triage`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      // Handle specific HTTP errors
      if (res.status === 429) {
        const body = await res.json().catch(() => ({}));
        const detail = body?.detail ?? '';
        if (detail.toLowerCase().includes('quota')) {
          throw new Error(
            '⚠️ API quota exhausted. The Groq free-tier daily limit has been reached. ' +
            'Please wait a few hours or upgrade your API plan.'
          );
        }
        throw new Error('Too many requests — please wait a moment and try again.');
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.detail ?? `Server error (${res.status})`);
      }

      const data = await res.json();
      setResult(mapResponse(data));
    } catch (err) {
      // Network errors (backend not running, CORS, etc.)
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError(
          '❌ Cannot connect to the backend. Make sure the FastAPI server is running on port 8000.'
        );
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return { loading, result, error, analyze, reset };
}
