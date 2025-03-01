import React, { useState } from 'react';
import './App.css';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlrLb-hp-ucHNeuOOXvBAUeJZSd3VRsIE",
  authDomain: "ai-prompt-optimizer.firebaseapp.com",
  projectId: "ai-prompt-optimizer",
  storageBucket: "ai-prompt-optimizer.firebasestorage.app",
  messagingSenderId: "718213459597",
  appId: "1:718213459597:web:c241e63f8f2d1059d8bcc4",
  measurementId: "G-EHFN2S95TZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [aiPlatform, setAiPlatform] = useState('general');
  const [promptGoal, setPromptGoal] = useState('');
  const [originalPrompt, setOriginalPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');

  const optimizationStrategies = {
    general: (prompt, goal) => {
      let improved = prompt.replace(/show me/gi, 'Provide a detailed explanation of')
        .replace(/tell me about/gi, 'Give a comprehensive overview of')
        .replace(/make/gi, 'Design a professional-quality')
        .replace(/help me/gi, 'Create clear and actionable steps to');

      if (goal) improved += ` The purpose of this prompt is: ${goal}.`;
      return improved + " Structure the response with clear headings and bullet points.";
    },
    coding: (prompt, goal) => {
      let improved = prompt;
      if (!prompt.toLowerCase().includes('language')) {
        improved += ' Use modern JavaScript (ES6+) features.';
      }
      improved += ' Clearly comment the code for readability.';
      if (goal) improved += ` Goal: ${goal}.`;
      return improved;
    },
    creative: (prompt, goal) => {
      let improved = prompt + ' Be original, avoid clichés, and incorporate vivid descriptive language.';
      improved += ' Keep a conversational yet professional tone.';
      if (goal) improved += ` Creative goal: ${goal}.`;
      return improved;
    },
    analytical: (prompt, goal) => {
      let improved = prompt + ' Provide evidence-based analysis and consider multiple perspectives.';
      improved += ' Structure your response with: (1) Key findings, (2) Detailed analysis, (3) Actionable recommendations.';
      if (goal) improved += ` Analytical goal: ${goal}.`;
      return improved;
    }
  };

  const handleOptimizePrompt = () => {
    if (!originalPrompt.trim()) {
      alert("Please enter your original prompt first!");
      return;
    }
    const strategy = optimizationStrategies[aiPlatform] || optimizationStrategies.general;
    const result = strategy(originalPrompt, promptGoal);
    setOptimizedPrompt(result);

    // Save data to Firebase Firestore
    addDoc(collection(db, "user_prompts"), {
      originalPrompt,
      optimizedPrompt: result,
      aiPlatform,
      promptGoal,
      createdAt: new Date()
    });
  };

  const handleClear = () => {
    setOriginalPrompt('');
    setPromptGoal('');
    setOptimizedPrompt('');
    setAiPlatform('general');
  };

  return (
    <div className="App">
      <h1>AI Prompt Optimizer</h1>
      <p>Enter your details below and click "Optimize Prompt" to enhance your AI prompt.</p>

      <div className="input-container">
        <label>Choose your AI platform:</label>
        <select
          value={aiPlatform}
          onChange={(e) => setAiPlatform(e.target.value)}
        >
          <option value="general">General AI Assistant (e.g., ChatGPT)</option>
          <option value="coding">Code Generation (e.g., GitHub Copilot)</option>
          <option value="creative">Creative Writing (e.g., Claude)</option>
          <option value="analytical">Research & Analysis (e.g., Perplexity)</option>
        </select>
      </div>

      <div className="input-container">
        <label>Your goal (optional but recommended):</label>
        <input
          type="text"
          value={promptGoal}
          onChange={(e) => setPromptGoal(e.target.value)}
          placeholder="Example: Generate ideas for a fantasy novel"
        />
      </div>

      <div className="input-container">
        <label>Paste your original prompt here:</label>
        <textarea
          value={originalPrompt}
          onChange={(e) => setOriginalPrompt(e.target.value)}
          placeholder="Example: Help me write a creative story"
        />
      </div>

      <button className="optimize-btn" onClick={handleOptimizePrompt}>
        Optimize Prompt
      </button>

      <button className="clear-btn" onClick={handleClear}>
        Clear Inputs
      </button>

      {optimizedPrompt && (
        <div className="optimized-result">
          <h2>Your Optimized Prompt:</h2>
          <div className="prompt-box">{optimizedPrompt}</div>
        </div>
      )}
    </div>
  );
}

export default App;
