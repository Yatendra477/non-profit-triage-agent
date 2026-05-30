/**
 * Dashboard — main page of HopeLink Triage.
 * Left column: input panel.
 * Right column: output / results panel.
 */
import { useState } from 'react';
import { useAnalyze } from '../hooks/useAnalyze';

import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { MessageInput } from '../components/input/MessageInput';
import { SessionInput } from '../components/input/SessionInput';
import { CategoryButtons } from '../components/input/CategoryButtons';
import { ResultPanel } from '../components/output/ResultPanel';
import { EmptyState } from '../components/output/EmptyState';

function SparkleIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l1.5 4.5L11 9l-4.5 1.5L5 15l-1.5-4.5L0 9l4.5-1.5L5 3zM19 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

export function Dashboard() {
  const [message,   setMessage]   = useState('');
  const [sessionId, setSessionId] = useState('');
  const [category,  setCategory]  = useState('');

  const { loading, result, error, analyze, reset } = useAnalyze();

  // Determine effective message: prepend category hint if chosen but message is empty
  const handleAnalyze = () => {
    const effectiveMessage = message.trim() ||
      (category ? `[${category}] Please help me with this request.` : '');
    if (!effectiveMessage) return;
    analyze(effectiveMessage, sessionId.trim() || undefined);
  };

  const CATEGORY_EXAMPLES = {
    'Donation': "Hi, I'm Sarah Johnson from Chicago. I'd like to donate $500 to your flood relief program. My email is sarah@example.com. How do I proceed?",
    'Volunteer': "Hello, my name is David Smith. I want to volunteer for the medical camp on Saturday. My phone number is 555-0198 and my ID is #VOL-44.",
    'Emergency': "Help! There is an emergency flood in downtown Miami. We need urgent assistance. Please call me at 555-9999 immediately. Date: Oct 12th.",
    'Complaint': "I am extremely disappointed with my recent experience (Case ID #C-9912). I spoke with someone yesterday. Email me back at unhappy@example.com.",
    'General Inquiry': "Can you provide more information about your upcoming events in Seattle? Best, Jane Doe."
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    if (cat && CATEGORY_EXAMPLES[cat]) {
      setMessage(CATEGORY_EXAMPLES[cat]);
    } else {
      setMessage('');
    }
  };

  const canSubmit = message.trim().length >= 3 || category !== '';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* ── Page title ──────────────────────────────────────────────── */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[var(--color-text)]">Support Triage Dashboard</h1>
        <p className="text-sm text-[var(--color-muted)] mt-0.5">
          AI-powered classification, routing, and response generation for non-profit support messages.
        </p>
      </div>

      {/* ── Two-column layout ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">

        {/* ── LEFT: Input Panel ────────────────────────────────────── */}
        <Card className="sticky top-20">
          <div className="space-y-5">
            {/* Panel header */}
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--color-border)]">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center">
                <SparkleIcon />
              </div>
              <h2 className="text-sm font-bold text-[var(--color-text)]">Analyze Support Request</h2>
            </div>

            {/* Inputs */}
            <MessageInput value={message} onChange={setMessage} />
            <SessionInput value={sessionId} onChange={setSessionId} />
            <CategoryButtons selected={category} onSelect={handleCategorySelect} />

            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs animate-fade-in">
                <AlertIcon />
                <p className="flex-1 leading-relaxed">{error}</p>
              </div>
            )}

            {/* Analyze button */}
            <Button
              id="analyze-btn"
              variant="primary"
              size="lg"
              disabled={!canSubmit}
              loading={loading}
              onClick={handleAnalyze}
              className="w-full"
            >
              <SparkleIcon />
              {loading ? 'Analyzing…' : 'Analyze Message'}
            </Button>

            {/* Reset link */}
            {result && !loading && (
              <button
                onClick={() => { reset(); setMessage(''); setSessionId(''); setCategory(''); }}
                className="w-full text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors py-1"
              >
                ↺ Clear & Start Over
              </button>
            )}
          </div>
        </Card>

        {/* ── RIGHT: Output Panel ──────────────────────────────────── */}
        <Card className="min-h-[380px]">
          {loading ? (
            <Spinner message="Analyzing message…" />
          ) : result ? (
            <ResultPanel result={result} />
          ) : (
            <EmptyState />
          )}
        </Card>
      </div>
    </main>
  );
}
