import React, { useState } from 'react';
import './App.css';

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

    // This triggers a form POST submission exactly as Formspree requires
    document.getElementById('formspreeForm').submit();
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

      <form
        id="formspreeForm"
        action="https://formspree.io/f/xanqrbnr"
        method="POST"
        style={{ display: 'none' }}
      >
        <input type="hidden" name="originalPrompt" value={originalPrompt} />
        <input type="hidden" name="optimizedPrompt" value={optimizedPrompt} />
        <input type="hidden" name="aiPlatform" value={aiPlatform} />
        <input type="hidden" name="promptGoal" value={promptGoal} />
      </form>

      <div className="input-container">
        <label>Choose your AI platform:</label>
        <select value={aiPlatform} onChange={(e) => setAiPlatform(e.target.value)}>
          <option value="general">General AI Assistant (ChatGPT)</option>
          <option value="coding">Code Generation (GitHub Copilot)</option>
          <option value="creative">Creative Writing (Claude)</option>
          <option value="analytical">Research & Analysis (Perplexity)</option>
        </select>
      </div>

      <div className="input-container">
        <label>Your goal (optional):</label>
        <input
          type="text"
          value={promptGoal}
          onChange={(e) => setPromptGoal(e.target.value)}
          placeholder="Example: Ideas for a novel"
        />
      </div>

      <div className="input-container">
        <label>Your original prompt:</label>
        <textarea
          value={originalPrompt}
          onChange={(e) => setOriginalPrompt(e.target.value)}
          placeholder="Example: Help me write a story"
        />
      </div>

      <button onClick={handleOptimizePrompt}>
        Optimize Prompt
      </button>
      <button onClick={handleClear}>
        Clear Inputs
      </button>

      {optimizedPrompt && (
        <div>
          <h2>Optimized Prompt:</h2>
          <p>{optimizedPrompt}</p>
        </div>
      )}
    </div>
  );
}

export default App;
