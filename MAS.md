# ORCHIDE AI

## Master Architecture Specification (MAS)

Version: 1.0

Status: Draft

Project Type: Agentic Multimodal Research Intelligence Platform

Architecture Type: Dual-LLM Agent Orchestration

Primary Stack:

* React
* Bun
* Vite
* TypeScript
* FastAPI
* Redis
* PostgreSQL
* Gemini Pro
* Sarvam AI

---

# 1. Vision

ORCHIDE is a multilingual, multimodal, agentic research platform designed to provide high-quality market intelligence, financial research, trend analysis, and conversational discovery.

The platform combines:

* Structured Data APIs
* Agentic Planning
* Financial Intelligence
* Multilingual Communication
* Voice Interactions
* Source-backed Research

The system must prioritize reasoning quality, API efficiency, explainability, and production reliability.

The long-term objective is to create a research platform comparable to modern AI-native search systems while maintaining full control over orchestration and tool execution.

---

# 2. Core Principles

## Planner and Executor Separation

The planning model and conversational model must remain independent.

Gemini Pro:

* Intent understanding
* Query decomposition
* Tool selection
* Agent routing
* Reasoning strategy

Sarvam AI:

* Multilingual conversations
* Response generation
* Voice interactions
* User-facing communication

No direct user interaction should occur through Gemini.

Gemini thinks.

Sarvam communicates.

---

## Tool-First Research

Research must originate from structured data providers before LLM reasoning.

Priority:

1. APIs
2. Internal Context
3. Cached Results
4. LLM Reasoning

LLMs should never fabricate market data.

---

## API Efficiency

Every model invocation incurs cost.

The architecture must minimize:

* Duplicate requests
* Redundant planning
* Context inflation
* Repeated voice synthesis

Caching and orchestration are mandatory.

---

## Explainable Research

All research outputs should contain:

* Sources
* Agent reasoning traces
* Tool usage logs
* Research timestamps

---

# 3. Product Scope

Initial Capabilities:

* Conversational Research
* Financial Intelligence
* Market Analysis
* News Intelligence
* Trend Detection
* Multilingual Responses
* Voice Agent

Future Capabilities:

* Portfolio Intelligence
* Enterprise Workspaces
* Research Reports
* Team Collaboration
* Autonomous Monitoring Agents

---

# 4. System Architecture

High-Level Flow:

User
↓
Frontend
↓
Agent Gateway
↓
Orchestrator
↓
Planner (Gemini)
↓
Research Agents
↓
Reasoning Layer
↓
Response Generation (Sarvam)
↓
Frontend

The orchestrator acts as the central intelligence layer.

No frontend component should directly call LLM providers.

---

# 5. Dual LLM Architecture

## Gemini Pro Responsibilities

Purpose:
Planning and reasoning.

Capabilities:

* Intent Classification
* Task Planning
* Research Strategy
* Agent Routing
* Tool Selection
* Query Compression

Gemini outputs structured execution plans.

Example:

{
"intent":"market_analysis",
"steps":[
"fetch_news",
"fetch_market_data",
"run_sentiment_analysis",
"generate_summary"
]
}

Gemini should never generate the final user response.

---

## Sarvam AI Responsibilities

Purpose:
Conversation and multilingual communication.

Capabilities:

* English
* Hindi
* Marathi
* Tamil
* Telugu
* Bengali
* Gujarati
* Additional supported languages

Responsibilities:

* Final response generation
* Voice responses
* Summaries
* Follow-up conversations

Sarvam receives already-processed context.

Sarvam must not independently perform research.

---

# 6. Agent Orchestration Layer

The orchestration layer controls all execution.

Responsibilities:

* Intent routing
* Agent selection
* State management
* Context fusion
* Error handling
* Cost optimization

Folder:

src/agents/orchestration

Primary file:

agentOrchestrator.ts

---

# 7. Agent Design

## Intent Agent

Purpose:

Classify requests.

Outputs:

* Intent
* Language
* Complexity
* Priority

---

## Planner Agent

Model:
Gemini Pro

Purpose:

Generate execution plans.

---

## News Agent

Sources:

* Moneycontrol

Responsibilities:

* Headline collection
* Categorization
* News summaries

---

## Finance Agent

Sources:

* Yahoo Finance
* Moneycontrol

Responsibilities:

* Stock data
* Historical trends
* Company fundamentals

---

## Trend Agent

Purpose:

Combine:

* Market data
* News sentiment
* Historical patterns

to generate insights.

---

## Reasoning Agent

Purpose:

Cross-validate findings.

Checks:

* Data consistency
* Contradictions
* Confidence scoring

---

## Response Agent

Model:
Sarvam AI

Purpose:

Generate final answer.

---

# 8. Data Providers

No web scraping is permitted.

Only structured APIs.

Approved Providers:

## News

* Moneycontrol

## Financial Data

* Yahoo Finance
* Moneycontrol

Future Providers:

* Polygon
* AlphaVantage
* Finnhub
* TwelveData
* FRED

Scraping-based implementations are prohibited.

---

# 9. Voice Architecture

Dedicated route:

/orchide-voice

Voice interactions must not be embedded into the primary chat experience.

---

Voice Flow:

Speech
↓
Speech-to-Text
↓
Planner
↓
Research Agents
↓
Sarvam
↓
Text-to-Speech
↓
Playback

---

Voice Requirements:

* Streaming transcripts
* Voice caching
* Session persistence
* Response interruption support

---

# 10. Frontend Architecture

Framework:

React + Bun + Vite

Language:

TypeScript

State:

Zustand

Animations:

Framer Motion

Styling:

TailwindCSS

---

# 11. Design System

Typography:

Primary:
Inter

Secondary:
Poppins

Editorial:
Garamond

---

Color Palette:

Crail
#C15F3C

Pampas
#F4F3EE

Cloudy
#B1ADA1

White
#FFFFFF

No additional branding colors should be introduced without approval.

---

# 12. User Experience Principles

Inspired By:

* Claude
* Webflow
* Linear

Characteristics:

* Minimal interfaces
* Generous spacing
* Elegant typography
* Fast interactions
* Low visual noise

Avoid:

* Dashboard clutter
* Excessive animations
* Overwhelming navigation

---

# 13. Project Structure

src/

app/
pages/
components/
agents/
services/
hooks/
store/
voice/
lib/
assets/
styles/

Documentation:

docs/

architecture/
api/
deployment/

---

# 14. Caching Strategy

Redis Required.

Cache Types:

Research Cache

TTL:
300 seconds

News Cache

TTL:
120 seconds

Market Cache

TTL:
60 seconds

Voice Cache

TTL:
Session-based

---

# 15. Rate Limiting

Gemini:

20 requests per minute

Sarvam:

40 requests per minute

Per-user controls must be configurable.

---

# 16. Observability

Required Tools:

* Sentry
* PostHog
* OpenTelemetry

Monitor:

* API latency
* Token usage
* Error rates
* Agent failures
* Voice failures

---

# 17. Security

API keys must never be exposed to the client.

Secrets:

* Gemini
* Sarvam
* Moneycontrol
* Yahoo Finance
* Moneycontrol

Storage:

Backend environment variables only.

No client-side secrets.

---

# 18. Deployment Architecture

Frontend:

Vercel

Backend:

Railway or AWS

Database:

PostgreSQL

Cache:

Redis

Object Storage:

AWS S3

---

# 19. Vercel Requirements

Mandatory:

vercel.json

{
"rewrites": [
{
"source": "/(.*)",
"destination": "/index.html"
}
]
}

Purpose:

Prevent SPA route refresh failures.

Required for:

* /chat
* /orchide-voice
* /settings

---

# 20. Success Metrics

User Experience

* Initial render under 2 seconds
* Interaction latency under 500ms
* Research completion under 5 seconds

AI Metrics

* 50% reduction in redundant LLM calls
* 90% source attribution coverage
* 95% routing accuracy

Reliability

* 99.9% uptime
* Zero exposed secrets
* Zero broken routes
* Zero dead navigation actions

---

End of Master Architecture Specification
