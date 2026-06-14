# ORCHIDE AI

# Product Requirements Document (PRD)

Version: 1.0

Status: MVP Specification

Related Document:
MAS.md

---

# 1. Product Overview

ORCHIDE is an AI-native multilingual research platform built around agentic reasoning and dual-LLM orchestration.

The platform enables users to perform:

* Market Research
* Financial Analysis
* News Intelligence
* Trend Discovery
* Conversational Exploration
* Voice-Based Research

through a modern conversational interface.

The system uses:

Planner:
Gemini Pro

Executor:
Sarvam AI

Research:
Structured APIs

No web scraping is allowed.

---

# 2. Business Goals

## Primary Goal

Build the most reliable conversational research platform for market and financial intelligence.

---

## Secondary Goals

Reduce LLM costs through orchestration.

Provide multilingual accessibility.

Enable voice-first experiences.

Create a scalable enterprise-ready architecture.

---

# 3. Target Users

## Retail Investors

Needs:

* Stock research
* News tracking
* Trend analysis

---

## Financial Analysts

Needs:

* Market intelligence
* Company analysis
* Research acceleration

---

## Founders

Needs:

* Industry research
* Competitor intelligence
* Trend discovery

---

## Students

Needs:

* Learning
* Research
* Exploration

---

# 4. Product Scope

## Included In MVP

Chat Interface

Research Agent

News Intelligence

Financial Data

Source Citations

Voice Route

Session History

Agent Reasoning

Dark Mode

Light Mode

---

## Excluded From MVP

Workspaces

Teams

Autonomous Monitoring

Portfolio Management

Enterprise SSO

PDF Report Generation

---

# 5. User Journeys

## Journey 1

Market Research

User asks:

"How is the AI sector impacting Indian IT stocks?"

System:

Intent Detection
↓
Planning
↓
News Collection
↓
Market Analysis
↓
Reasoning
↓
Sarvam Response

Expected Result:

Structured answer with sources.

---

## Journey 2

Stock Analysis

User asks:

"Compare TCS and Infosys."

System returns:

* Price comparison
* Financial metrics
* News
* Summary

---

## Journey 3

Voice Research

User opens:

/orchide-voice

User speaks question.

System returns spoken answer.

---

# 6. Pages

## Home Page

Route:

/

Purpose:

Landing page.

---

Sections:

Hero

Capabilities

Research Examples

Voice Showcase

Footer

---

Hero Requirements

Large typography.

Minimal copy.

Abstract cover artwork.

CTA:

Start Research

---

Capabilities

Conversational Research

Financial Intelligence

Multilingual Voice

Agentic Analysis

---

Research Examples

Example prompts.

Click-to-fill functionality.

---

## Chat Page

Route:

/chat

Purpose:

Primary research experience.

---

Components

Sidebar

Conversation Area

Prompt Input

Mic Button

Research Status

Source Citations

---

Sidebar

New Chat

Recent Chats

Settings

---

Conversation Area

Streaming responses.

Markdown support.

Tables.

Code blocks.

Financial summaries.

---

Prompt Input

Multiline.

Auto resize.

Keyboard shortcuts.

---

Mic Button

Navigates to:

/orchide-voice

No embedded voice UI.

---

## Voice Page

Route:

/orchide-voice

Purpose:

Voice-first experience.

---

Components

3D Orb

Waveform

Transcript

Voice Controls

Session State

---

Behavior

Start listening

Live transcript

Research execution

Voice playback

---

# 7. Design Requirements

## Fonts

Primary

Inter

Secondary

Poppins

Editorial

Garamond

---

## Colors

Primary Accent

#C15F3C

Background

#F4F3EE

Muted

#B1ADA1

White

#FFFFFF

---

## Design Inspiration

Claude

Linear

Webflow

---

# 8. AI Architecture

## Planner

Provider

Gemini Pro

Purpose

Reasoning

Planning

Routing

Tool Selection

---

## Executor

Provider

Sarvam

Purpose

Conversation

Multilingual Responses

Voice Responses

---

# 9. Agent Architecture

## Intent Agent

Input

User query

Output

Intent classification

Complexity score

Language

---

## Planner Agent

Creates execution plans.

Example:

Fetch News

Fetch Finance

Generate Insights

Create Response

---

## News Agent

Provider

Moneycontrol

Functions

News Search

Headline Analysis

Topic Detection

---

## Finance Agent

Providers

Yahoo Finance

Moneycontrol

Functions

Stock Data

Financial Metrics

Historical Trends

---

## Trend Agent

Combines:

News

Finance

Sentiment

Outputs trends.

---

## Response Agent

Sarvam

Produces final response.

---

# 10. Agent Orchestration Rules

Rule 1

Gemini never speaks to users.

---

Rule 2

Sarvam never performs research.

---

Rule 3

All research must originate from tools.

---

Rule 4

All outputs should include source references.

---

# 11. API Integrations

## Gemini

Purpose

Planning

Environment Variable

GEMINI_API_KEY

---

## Sarvam

Purpose

Conversation

Environment Variable

SARVAM_API_KEY

---

## Moneycontrol

Purpose

News

Environment Variable

GNEWS_API_KEY

---

## Yahoo Finance

Purpose

Market Data

---

## Moneycontrol

Purpose

Indian Market Data

---

# 12. Database Schema

## Users

id

email

created_at

updated_at

---

## Sessions

id

user_id

title

created_at

updated_at

---

## Messages

id

session_id

role

content

created_at

---

## ResearchRuns

id

session_id

intent

sources

latency

created_at

---

## VoiceSessions

id

session_id

transcript

audio_url

created_at

---

# 13. State Management

Store Library

Zustand

---

Stores

chatStore

voiceStore

sessionStore

settingsStore

researchStore

---

# 14. Frontend Component Inventory

## Shared

Button

Input

Card

Modal

Tooltip

Badge

---

## Chat

ChatMessage

ChatInput

ResearchProgress

CitationCard

SourcePanel

---

## Voice

VoiceOrb

Waveform

TranscriptPanel

VoiceControls

---

## Layout

Navbar

Sidebar

Footer

ThemeProvider

---

# 15. Backend Services

## Orchestrator Service

Central coordinator.

---

## Research Service

Handles APIs.

---

## Cache Service

Redis.

---

## Analytics Service

Observability.

---

# 16. Caching Requirements

Redis Required.

---

Research Results

TTL

300 seconds

---

News

TTL

120 seconds

---

Market Data

TTL

60 seconds

---

Voice Sessions

Session TTL

30 minutes

---

# 17. Rate Limiting

Gemini

20 RPM

---

Sarvam

40 RPM

---

Per User

Configurable

---

# 18. Error Handling

User-Friendly Messages

No stack traces.

---

Failures

Provider Down

Timeout

Rate Limit

Empty Results

---

Fallbacks

Cached Response

Partial Response

Retry Logic

---

# 19. Observability

Required

Sentry

PostHog

OpenTelemetry

---

Track

Latency

Failures

Costs

Token Usage

Agent Routing

---

# 20. Security

No API keys on frontend.

---

Secrets

Gemini

Sarvam

Moneycontrol

Finance APIs

Stored server-side only.

---

# 21. Performance Targets

Initial Page Load

<2 seconds

---

Chat Interaction

<500ms

---

Research Response

<5 seconds

---

Voice Latency

<3 seconds

---

# 22. Sprint Plan

Sprint 1

Design System

Landing Page

Routing

---

Sprint 2

Chat Experience

State Management

Streaming UI

---

Sprint 3

Gemini Planner

Sarvam Executor

Orchestrator

---

Sprint 4

News Agent

Finance Agent

Citations

---

Sprint 5

Voice Experience

3D Orb

Voice Routing

---

Sprint 6

Redis

Rate Limiting

Observability

---

Sprint 7

Production Hardening

Performance Optimization

Deployment

---

# 23. Acceptance Criteria

The MVP is considered complete when:

Users can perform research through chat.

Users can perform research through voice.

Dual-LLM orchestration functions correctly.

Responses contain source references.

No API keys are exposed.

SPA routing works on Vercel.

Voice page functions independently.

System achieves production deployment readiness.

---

End of Product Requirements Document
