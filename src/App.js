import React from "react";
import { HashRouter, Routes, Route, NavLink, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaCalendarAlt } from "react-icons/fa";

import HomePage from "./pages/HomePage";
import MastersThesisPage from "./pages/MastersThesisPage";
import PredictiveStochasticPage from "./pages/PredictiveStochasticPage";
import SolanaToolsPage from "./pages/SolanaToolsPage";
import NLPPage from "./pages/NLPPage";
import BayesianCNNPage from "./pages/BayesianCNNPage";
import "./App.css";

const routeTitles = {
  "/": "Research portfolio archive",
  "/masters-thesis": "Master's thesis",
  "/predictive-stochastic": "Predictive stochastic modeling",
  "/solana-tools": "Solana tools",
  "/nlp": "NLP language model",
  "/bayesian-cnn": "Bayesian CNN",
};

function RouteEffects() {
  const { pathname } = useLocation();
  const firstRoute = React.useRef(true);
  const title = routeTitles[pathname] || "Page not found";

  React.useEffect(() => {
    document.title = `${title} · Jaden Fix`;
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    document.getElementById("research-content")?.focus();
  }, [pathname, title]);

  return <span className="sr-only" aria-live="polite">{title}</span>;
}

function NotFoundPage() {
  const { pathname } = useLocation();
  return (
    <div className="page-container">
      <section className="section not-found" aria-labelledby="not-found-title">
        <p className="eyebrow">Route recovery</p>
        <h2 id="not-found-title" className="section-title">This archive page does not exist</h2>
        <p className="section-content">
          The saved route <code>{pathname}</code> is not part of this historical portfolio. No project content was loaded.
        </p>
        <Link className="route-recovery" to="/">Return to the verified archive index</Link>
      </section>
    </div>
  );
}

function Header() {
  const [avatarFailed, setAvatarFailed] = React.useState(false);
  return (
    <header className="header">
      <motion.div 
        className="logo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {avatarFailed ? (
          <div className="avatar avatar-fallback" role="img" aria-label="Jaden Fix initials">JF</div>
        ) : <img
          src="https://avatars.githubusercontent.com/u/163031992?v=4"
          alt="Jaden Fix Avatar"
          className="avatar"
          onError={() => setAvatarFailed(true)}
        />}
        <div className="identity-copy">
          <p className="archive-label">Research portfolio · Archive</p>
          <h1>Jaden Fix</h1>
          <h2>Data, AI, and Solutions Specialist</h2>
        </div>
      </motion.div>
      <div className="profile-links">
        <a href="https://github.com/jadenfix" target="_blank" rel="noopener noreferrer" title="GitHub" aria-label="GitHub">
          <FaGithub className="profile-icon" />
        </a>
        <a href="https://linkedin.com/in/jadenfix/" target="_blank" rel="noopener noreferrer" title="LinkedIn" aria-label="LinkedIn">
          <FaLinkedin className="profile-icon" />
        </a>
        <a href="mailto:jpfix@calpoly.edu" title="Email" aria-label="Email">
          <FaEnvelope className="profile-icon" />
        </a>
        <a href="https://calendly.com/jadenfix" target="_blank" rel="noopener noreferrer" title="Schedule a Meeting" aria-label="Schedule a Meeting">
          <FaCalendarAlt className="profile-icon" />
        </a>
      </div>
      <nav className="navbar" aria-label="Research projects">
        <ul className="menu">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/masters-thesis">Masters Thesis</NavLink></li>
          <li><NavLink to="/predictive-stochastic">Predictive Stochastic</NavLink></li>
          <li><NavLink to="/solana-tools">Solana Tools</NavLink></li>
          <li><NavLink to="/nlp">NLP</NavLink></li>
          <li><NavLink to="/bayesian-cnn">Bayesian CNN</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}

function App() {
  return (
    <HashRouter>
      <div className="app-container">
        <a className="skip-link" href="#research-content" onClick={(event) => { event.preventDefault(); document.getElementById("research-content")?.focus(); }}>Skip to content</a>
        <RouteEffects />
        <Header />
        <aside className="archive-notice" aria-label="Archive scope">
          Historical project summaries only. Linked repositories, results, live services, and deployments are outside this archive's verification scope.
        </aside>
        <main id="research-content" className="content" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/masters-thesis" element={<MastersThesisPage />} />
            <Route path="/predictive-stochastic" element={<PredictiveStochasticPage />} />
            <Route path="/solana-tools" element={<SolanaToolsPage />} />
            <Route path="/nlp" element={<NLPPage />} />
            <Route path="/bayesian-cnn" element={<BayesianCNNPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Jaden Fix. All rights reserved.</p>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
