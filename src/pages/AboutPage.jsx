import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiSend,
  FiCpu,
  FiShield,
  FiZap,
  FiLayout,
} from "react-icons/fi";
import { useState } from "react";
import { samplePrompts } from "../data/research";

export function AboutPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(samplePrompts[0]);

  return (
    <section className="about-page-refined">
      <div className="about-hero">
        <p className="eyebrow">Codex Intelligence</p>
        <h1>The research engine for the agentic age.</h1>
        <p className="about-subtext">
          Codex is a calm, source-backed workspace designed for deep market
          discovery, multimodal analysis, and institutional-grade reasoning.
        </p>

        <div className="about-launcher">
          <FiSearch />
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What would you like to research?"
          />
          <button onClick={() => navigate("/research", { state: { prompt } })}>
            <FiSend /> Start
          </button>
        </div>
      </div>
      <div className="orchid">
        <h1>Orchid.</h1>
        <p>A revolutionary approach to research and analysis.</p>
        <img src="/vec.jpg" alt="" />
      </div>
      <div className="bento-grid">
        <div className="bento-item tall crail-bg">
          <img
            src="/diagram.png"
            alt="Agent"
            style={{
              width: "100%",
              borderRadius: "5rem",
            }}
          />
          <h3>Agentic Planning</h3>
          <p>
            Every investigation begins with a strategic plan, decomposing
            complex queries into executable steps.
          </p>
        </div>
        <div className="bento-item wide surface-bg">
          <div className="bento-content">
            <FiCpu />
            <div>
              <h3>Multimodal Architecture</h3>
              <p>
                Simultaneous processing of text, market data, and voice signals
                for a comprehensive research view.
              </p>
            </div>
          </div>
        </div>
        <div className="bento-item surface-bg">
          <FiShield />
          <h3>Source Grounding</h3>
          <p>
            Strict data provenance from GNews, YFinance, and Moneycontrol. No
            hallucinations, only evidence.
          </p>
        </div>
        <div className="bento-item surface-bg">
          <FiLayout />
          <h3>Minimal Design</h3>
          <p>
            A quiet, focused interface that puts the research first, inspired by
            the best of Perplexity and Claude.
          </p>
        </div>
      </div>

      <footer className="about-footer">
        <p>© 2026 Codex Research · Built for the agentic future.</p>
      </footer>
    </section>
  );
}
