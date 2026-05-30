# 🏥 Non-Profit Support Triage Agent

A production-grade, multi-agent AI system that **classifies**, **enriches**, and **routes** incoming support messages for non-profit organisations — built with **FastAPI**, **Groq Llama 3**, **Parallel Async Routing**, and **spaCy**.

---

## 🏗️ Architecture

```
POST /triage ──► FastAPI ──► Triage Orchestrator
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          ▼                          ▼                          ▼
   [Classifier Agent]        [NER Agent]             [Decision Agent]
   intent + urgency      full_name, email,          deterministic routing
   (JSON output)         phone, location…           rules engine
          │                          │                          │
          └──────────────────────────┼──────────────────────────┘
                                     ▼
                            [Responder Agent]
                         empathetic AI response
                                     │
                                     ▼
                           TriageResponse JSON
```

---

## 📦 Project Structure

```
Non-Profit Support Triage Agent/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── config/
│   │   └── settings.py         # Pydantic BaseSettings (env config)
│   ├── models/
│   │   └── schemas.py          # All Pydantic request/response models
│   ├── agents/
│   │   ├── classifier.py       # Intent + urgency classification agent
│   │   ├── ner.py              # Named entity recognition agent
│   │   ├── decision.py         # Routing rules engine + agent
│   │   └── responder.py        # Empathetic response generator agent
│   ├── services/
│   │   ├── triage_service.py   # Async parallel orchestration + conversation memory
│   │   └── llm_service.py      # Shared ChatGroq instance with retry
│   ├── routes/
│   │   ├── triage.py           # POST /triage
│   │   └── health.py           # GET /health
│   └── utils/
│       ├── logger.py           # Structured JSON logging (structlog)
│       └── parsers.py          # Robust JSON extraction from LLM output
├── frontend/
│   └── index.html              # Standalone UI (no build step required)
├── requirements.txt
├── .env.example
└── README.md
```

---

## ⚙️ Setup

### 1. Clone & enter the project directory

```bash
cd "Non-Profit Support Triage Agent"
```

### 2. Create a Python virtual environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Download the spaCy language model

```bash
python -m spacy download en_core_web_sm
```

### 5. Configure environment variables

```bash
copy .env.example .env   # Windows
# or
cp .env.example .env     # macOS/Linux
```

Edit `.env` and set your **Groq API key**:

```
GROQ_API_KEY=gsk_your-real-key-here
GROQ_MODEL=llama-3.3-70b-versatile
```

---

## 🚀 Running the Server

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

| URL | Purpose |
|---|---|
| `http://localhost:8000/docs` | Interactive Swagger UI |
| `http://localhost:8000/redoc` | ReDoc documentation |
| `http://localhost:8000/health` | Health check |
| `http://localhost:8000/ui/` | Frontend web UI |

> Alternatively, open `frontend/index.html` directly in your browser.

---

## 🌐 API Reference

### `POST /triage`

**Request:**
```json
{
  "message": "Hi, I'm Sarah from Chicago. I'd like to donate $500. My email is sarah@example.com.",
  "session_id": "optional-session-id-for-memory"
}
```

**Response:**
```json
{
  "intent": "Donation",
  "urgency": "Low",
  "entities": {
    "full_name": "Sarah",
    "phone_number": "",
    "email": "sarah@example.com",
    "location": "Chicago",
    "case_id": "",
    "date": ""
  },
  "response": "Thank you so much, Sarah! Your generous donation truly makes a difference...",
  "route": "finance_team",
  "escalated": false,
  "session_id": null
}
```

### `GET /health`

```json
{ "status": "ok", "version": "1.0.0", "environment": "development" }
```

---

## 🧪 Example cURL Requests

### Donation
```bash
curl -X POST http://localhost:8000/triage \
  -H "Content-Type: application/json" \
  -d '{"message": "Hi, I want to donate $500 to your flood relief fund. My name is James and email is james@test.com"}'
```

### Emergency
```bash
curl -X POST http://localhost:8000/triage \
  -H "Content-Type: application/json" \
  -d '{"message": "URGENT — my elderly mother is stranded without food after the storm in East Oakland. Please help immediately!"}'
```

### Volunteer
```bash
curl -X POST http://localhost:8000/triage \
  -H "Content-Type: application/json" \
  -d '{"message": "I want to volunteer every Saturday. I am skilled in cooking. When can I start?"}'
```

### With Session Memory
```bash
curl -X POST http://localhost:8000/triage \
  -H "Content-Type: application/json" \
  -d '{"message": "What programs do you have for youth?", "session_id": "user-abc123"}'
```

---

## 🤖 Routing Rules

| Condition | Route | Escalated |
|---|---|---|
| `urgency == High` | `human_agent` | ✅ Yes |
| `intent == Donation` | `finance_team` | ❌ No |
| `intent == Volunteer` | `volunteer_team` | ❌ No |
| Everything else | `general_support` | ❌ No |

---

## 🛡️ Production Features

- ✅ **Input validation** — Pydantic v2 models with field constraints
- ✅ **Structured logging** — JSON logs via `structlog` (pretty in dev, JSON in prod)
- ✅ **Retry logic** — `tenacity` retry with exponential backoff
- ✅ **Async/non-blocking** — Parallel LLM calls run in thread pool to keep FastAPI responsive
- ✅ **CORS configured** — Supports browser-based frontend
- ✅ **Conversation memory** — In-memory session history (last 10 turns)
- ✅ **Graceful degradation** — Falls back if spaCy model unavailable
- ✅ **Environment config** — No hardcoded secrets
- ✅ **Error handling** — Typed exceptions surfaced as proper HTTP responses

---

## 🔧 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `GROQ_API_KEY` | *(required)* | Your Groq API key |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | LLM model to use |
| `GROQ_TEMPERATURE` | `0.3` | Response determinism |
| `LOG_LEVEL` | `INFO` | Logging verbosity |
| `APP_ENV` | `development` | `development` or `production` |
| `APP_PORT` | `8000` | Server port |
| `LLM_MAX_RETRIES` | `3` | Max retry attempts on LLM failure |
