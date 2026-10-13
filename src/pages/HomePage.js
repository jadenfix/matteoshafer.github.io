import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./HomePage.css";

const projects = [
  ["Master's thesis", "/masters-thesis", "An in-progress research proposal spanning forecasting, stochastic modeling, and market complexity."],
  ["Predictive stochastic", "/predictive-stochastic", "A historical thesis archive with linked paper, R code, and dataset references."],
  ["Solana tools", "/solana-tools", "An archival description of related trading and portfolio experiments."],
  ["NLP", "/nlp", "A statistical n-gram language-model project with smoothing and perplexity evaluation."],
  ["Bayesian CNN", "/bayesian-cnn", "A CIFAR-10 experiment description focused on uncertainty estimation."],
];

function HomePage() {
  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <motion.div 
        className="hero-section"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="hero-bg" />
        <div className="hero-content">
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Welcome to My World of AI & Data
          </motion.h1>
          <p className="hero-subtitle">
            I blend advanced data science with cutting–edge technologies to solve challenging problems.
            Discover my innovative work and projects that transform complex data into impactful solutions.
          </p>
          <a
            href="https://github.com/jadenfix"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-button"
          >
            Explore my GitHub
          </a>
        </div>
      </motion.div>

      <section className="project-index" aria-labelledby="project-index-title">
        <div className="project-index-heading">
          <p className="eyebrow">Checked-in archive</p>
          <h2 id="project-index-title">Research project index</h2>
          <p>Open the five summaries included in this build. Each route stays inside the archive.</p>
        </div>
        <ul className="project-grid">
          {projects.map(([title, route, description]) => (
            <li key={route}>
              <Link to={route}>
                <span>{title}</span>
                <small>{description}</small>
                <b aria-hidden="true">Open summary →</b>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* About Me Section */}
      <motion.div 
        className="about-me-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="about-title">About Me</h2>
        <p className="about-text">
          My passion lies at the intersection of data science, AI, and technology innovation. I develop intelligent systems
          that integrate statistical modeling, machine learning, and modern computing paradigms to drive change in various fields.
          Whether it’s financial modeling, blockchain trading systems, or natural language processing, I am dedicated to pushing the boundaries of innovation.
        </p>
      </motion.div>
    </div>
  );
}

export default HomePage;
