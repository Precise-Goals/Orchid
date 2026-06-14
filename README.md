# Orchid Intelligence System

> Institutional-grade research that plans, retrieves, and reasons before it speaks.

Orchid is an AI-native research intelligence platform built for the agentic age. It moves beyond simple answer generation to **coordinated multimodal investigation**, combining dual-LLM orchestration with real-time signal retrieval.

Built with **Codex Agentic IDE**, Orchid provides a calm, source-grounded workspace for deep market discovery, financial analysis, and multilingual investigation.

---

## 🚀 Key Features

### 1. Dual-LLM Orchestration (Planner + Executor)
Orchid separates the cognitive labor of research:
- **The Planner (Gemini 1.5 Flash):** Decomposes complex queries into strategic investigation paths, selects the best tools, and defines intent.
- **The Executor (Sarvam AI):** Handles high-fidelity multilingual communication and neural voice synthesis.

### 2. Real-time RAG Pipeline
No more static or hallucinated data. Orchid implements a true **Retrieval-Augmented Generation** loop:
- **Institutional Signals:** Direct retrieval from GNews, YFinance (via domain filtering), and Moneycontrol.
- **Source Grounding:** Every insight is linked to live articles, ensuring institutional-grade provenance.
- **Developer-Centric Output:** Detailed research logs, reasoning traces, and signal metrics are directed to the browser console for a minimalist, "quiet" UI.

### 3. Multilingual by Design
Orchid speaks the language of global markets. Support for **English, Hindi, Marathi, Tamil, Telugu, Bengali, and Gujarati** is baked into the core:
- Multilingual research summaries.
- Native-language voice interaction.
- Regional market context awareness.

### 4. Orchid Voice Agent
A voice-native research experience featuring the **Sarvam 'Shubh'** model:
- **3D Interaction:** A modern Spline-based orb provides visual feedback.
- **Low Latency:** Optimized neural TTS for human-like conversational research.
- **Live Transcripts:** Real-time visual feedback as the system processes spoken signals.

### 5. Accessibility & UX Minimalism
Inspired by the design standards of **Claude** and **Perplexity**:
- **Bento Grid Architecture:** Clean, organized layouts for account and system information.
- **Framer Motion Animations:** Fluent, high-performance transitions across all pages.
- **Account Identity:** Unified management of research preferences, theme (Dark/Light), and identity.

---

## 🛠 Tech Stack

- **Frontend:** React 19, Vite, Bun, Framer Motion.
- **Intelligence:** Google Gemini 1.5 Flash, Sarvam AI (Shubh voice).
- **Signals:** GNews API, Financial Domain Filtering.
- **Auth:** Firebase Authentication.
- **Deployment:** Vercel (Ready for end-to-end scalable deployment).

---

## 🔧 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Precise-Goals/Orchid.git
   cd Orchid
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root:
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_id
   VITE_GNEWS_API_KEY=your_key
   VITE_SARVAM_API_KEY=your_key
   VITE_GEMINI_API_KEY=your_key
   ```

4. **Run Development Server:**
   ```bash
   bun run dev
   ```

---

## 🧪 Testing the Dual-LLM Pipeline

1. Open the platform and navigate to the **Research** or **Orchid** (Voice) page.
2. Open **Browser Developer Tools (F12)**.
3. Run a query like: *"Current status of the semiconductor industry in India"*.
4. **Observe the Trace:**
   - `[Orchid Intelligence] Phase 1: Planning...` (Gemini)
   - `[Signal Retrieval] Searching for...` (GNews)
   - `[ORCHID SYSTEM RESULT]` (Ground analysis logged in console).

---

## 🌐 Vision
Orchid exists to turn the research crisis of "too much information" into "structured understanding." By delegating the burden of orchestration to a coordinated agentic system, Orchid allows researchers, analysts, and founders to focus on judgment rather than retrieval.

**Built with 🧡 by Codex Agentic IDE.**
