import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useEffect as useLayoutEffect } from 'react';

// Inject terminal styles
const injectTerminalStyles = () => {
  if (typeof document !== 'undefined' && !document.getElementById('terminal-styles')) {
    const style = document.createElement('style');
    style.id = 'terminal-styles';
    style.textContent = `
      :root {
        --neon-cyan: #00ff88;
        --neon-magenta: #ff006e;
        --neon-lime: #39ff14;
        --deep-black: #0a0e27;
        --dark-bg: #0f1419;
        --terminal-green: #00ff88;
      }
      .terminal-container {
        position: relative;
        min-height: 100vh;
        width: 100%;
        background: linear-gradient(135deg, #0a0e27 0%, #1a0f2e 50%, #0f1419 100%);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'IBM Plex Mono', monospace;
        color: var(--neon-cyan);
      }
      .scanlines {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: repeating-linear-gradient(
          0deg,
          rgba(0, 255, 136, 0.03),
          rgba(0, 255, 136, 0.03) 1px,
          transparent 1px,
          transparent 2px
        );
        pointer-events: none;
        z-index: 1;
        animation: scanlines-move 8s linear infinite;
      }
      @keyframes scanlines-move {
        0% { transform: translateY(0); }
        100% { transform: translateY(10px); }
      }
      .matrix-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
        opacity: 0.1;
      }
      .matrix-char {
        position: absolute;
        color: var(--neon-cyan);
        font-size: 1.5rem;
        animation: fall 8s linear infinite;
        opacity: 0.5;
      }
      @keyframes fall {
        0% { transform: translateY(-100%); opacity: 0; }
        10% { opacity: 0.5; }
        90% { opacity: 0.5; }
        100% { transform: translateY(100vh); opacity: 0; }
      }
      .terminal-content {
        position: relative;
        z-index: 2;
        max-width: 800px;
        width: 90%;
        margin: 0 auto;
        padding: 3rem 2rem;
        background: rgba(15, 20, 25, 0.8);
        border: 2px solid var(--neon-cyan);
        border-radius: 0.25rem;
        box-shadow: 0 0 20px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 255, 136, 0.05), 0 0 40px rgba(255, 0, 110, 0.2);
        backdrop-filter: blur(10px);
      }
      .terminal-header {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(0, 255, 136, 0.3);
      }
      .header-line {
        font-size: 0.9rem;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
        animation: glow-pulse 2s ease-in-out infinite;
      }
      .header-divider {
        height: 2px;
        background: linear-gradient(90deg, var(--neon-cyan), var(--neon-magenta), transparent);
        margin-top: 0.5rem;
      }
      @keyframes glow-pulse {
        0%, 100% { text-shadow: 0 0 10px var(--neon-cyan), 0 0 20px var(--neon-cyan); }
        50% { text-shadow: 0 0 20px var(--neon-cyan), 0 0 40px var(--neon-cyan), 0 0 60px var(--neon-magenta); }
      }
      .cyan-text { color: var(--neon-cyan); text-shadow: 0 0 10px var(--neon-cyan); }
      .magenta-text { color: var(--neon-magenta); text-shadow: 0 0 10px var(--neon-magenta); }
      .lime-text { color: var(--neon-lime); text-shadow: 0 0 10px var(--neon-lime); }
      .stage-title {
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        letter-spacing: 0.1em;
        animation: glow-pulse 2s ease-in-out infinite;
      }
      .glitch-effect {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        color: var(--neon-magenta);
        font-weight: 600;
        letter-spacing: 0.1em;
      }
      .code-block {
        background: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(0, 255, 136, 0.2);
        border-radius: 0.25rem;
        padding: 1.5rem;
        margin: 1.5rem 0;
        overflow-x: auto;
        box-shadow: inset 0 0 10px rgba(0, 255, 136, 0.05);
      }
      .code-block pre {
        margin: 0;
        font-family: 'Space Mono', monospace;
        font-size: 0.95rem;
        line-height: 1.6;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
      .code-block code {
        color: var(--neon-cyan);
      }
      .cursor {
        display: inline-block;
        width: 0.5em;
        height: 1em;
        background: var(--neon-cyan);
        margin-left: 0.1em;
        animation: blink 0.7s step-end infinite;
      }
      .cursor.hidden { opacity: 0; }
      @keyframes blink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0; }
      }
      .stage-description {
        font-size: 0.9rem;
        color: var(--neon-lime);
        margin-top: 1rem;
        letter-spacing: 0.05em;
      }
      .terminal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
        flex-wrap: wrap;
      }
      .terminal-button {
        background: transparent;
        border: 2px solid var(--neon-cyan);
        color: var(--neon-cyan);
        padding: 0.75rem 1.5rem;
        font-family: 'IBM Plex Mono', monospace;
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.1em;
        cursor: pointer;
        position: relative;
        transition: all 0.3s ease;
        text-transform: uppercase;
        box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
      }
      .terminal-button:hover {
        background: rgba(0, 255, 136, 0.1);
        box-shadow: 0 0 20px rgba(0, 255, 136, 0.6), inset 0 0 10px rgba(0, 255, 136, 0.2);
        transform: translateY(-2px);
      }
      .terminal-button:active {
        transform: translateY(0);
        box-shadow: 0 0 10px rgba(0, 255, 136, 0.3), inset 0 0 10px rgba(0, 255, 136, 0.3);
      }
      .response-buttons {
        display: flex;
        gap: 1.5rem;
        justify-content: center;
        flex-wrap: wrap;
      }
      .yes-button {
        border-color: var(--neon-lime);
        color: var(--neon-lime);
        box-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
      }
      .yes-button:hover {
        background: rgba(57, 255, 20, 0.1);
        box-shadow: 0 0 20px rgba(57, 255, 20, 0.6), inset 0 0 10px rgba(57, 255, 20, 0.2);
      }
      .download-button {
        border-color: var(--neon-lime);
        color: var(--neon-lime);
        box-shadow: 0 0 10px rgba(57, 255, 20, 0.3);
        margin-top: 1rem;
      }
      .download-button:hover {
        background: rgba(57, 255, 20, 0.1);
        box-shadow: 0 0 20px rgba(57, 255, 20, 0.6), inset 0 0 10px rgba(57, 255, 20, 0.2);
        transform: translateY(-2px);
      }
      .no-button {
        border-color: var(--neon-magenta);
        color: var(--neon-magenta);
        box-shadow: 0 0 10px rgba(255, 0, 110, 0.3);
      }
      .no-button:hover {
        background: rgba(255, 0, 110, 0.1);
        box-shadow: 0 0 20px rgba(255, 0, 110, 0.6), inset 0 0 10px rgba(255, 0, 110, 0.2);
      }
      .download-button {
        border-color: var(--neon-cyan);
        color: var(--neon-cyan);
        box-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
        margin-top: 1.5rem;
      }
      .download-button:hover {
        background: rgba(0, 255, 136, 0.1);
        box-shadow: 0 0 20px rgba(0, 255, 136, 0.6), inset 0 0 10px rgba(0, 255, 136, 0.2);
      }
      .response-message {
        text-align: center;
        padding: 2rem 0;
      }
      .success-message { position: relative; }
      .celebration-text {
        font-size: 1.1rem;
        margin: 1rem 0;
        letter-spacing: 0.05em;
        animation: glow-pulse 2s ease-in-out infinite;
      }
      .decline-message { text-align: center; }
      .decline-text {
        font-size: 1rem;
        margin: 1rem 0;
        letter-spacing: 0.05em;
        color: var(--neon-magenta);
      }
      .confetti {
        position: fixed;
        top: 50%;
        left: 50%;
        pointer-events: none;
        z-index: 100;
      }
      .confetti-piece {
        position: absolute;
        font-size: 1.5rem;
        display: inline-block;
      }
      .terminal-footer {
        margin-top: 2rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(0, 255, 136, 0.3);
        font-size: 0.85rem;
        opacity: 0.7;
      }
      .footer-line {
        margin: 0.5rem 0;
        letter-spacing: 0.05em;
      }
      @media (max-width: 768px) {
        .terminal-content { padding: 2rem 1.5rem; border-width: 1px; }
        .stage-title { font-size: 1rem; }
        .code-block { padding: 1rem; font-size: 0.85rem; }
        .terminal-button { padding: 0.6rem 1.2rem; font-size: 0.8rem; }
        .response-buttons { gap: 1rem; }
        .celebration-text, .decline-text { font-size: 0.95rem; }
      }
      @media (max-width: 480px) {
        .terminal-content { padding: 1.5rem 1rem; margin: 1rem; }
        .header-line { font-size: 0.8rem; }
        .stage-title { font-size: 0.9rem; }
        .code-block { padding: 0.75rem; font-size: 0.75rem; margin: 1rem 0; }
        .terminal-button { padding: 0.5rem 1rem; font-size: 0.7rem; }
        .response-buttons { flex-direction: column; gap: 0.75rem; }
        .terminal-button { width: 100%; }
      }
    `;
    document.head.appendChild(style);
  }
};

/**
 * Cyberpunk Terminal Romance Design
 * 
 * This page presents an interactive terminal-themed Valentine's proposal.
 * The user progresses through stages of "system access" with glitch effects,
 * neon animations, and a final choice to accept or decline the proposal.
 * 
 * Color Scheme:
 * - Deep black background (#0a0e27 / oklch(0.08 0.02 280))
 * - Electric cyan (#00ff88 / oklch(0.95 0.05 120))
 * - Hot magenta (#ff006e / oklch(0.52 0.28 262.5))
 * - Neon lime (#39ff14 / oklch(0.70 0.28 120))
 * 
 * Typography: IBM Plex Mono for authentic terminal feel
 */

export default function Home() {
  // Inject styles on mount
  useLayoutEffect(() => {
    injectTerminalStyles();
  }, []);
  const [stage, setStage] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [response, setResponse] = useState<'yes' | 'no' | null>(null);
  const [noButtonVisible, setNoButtonVisible] = useState(true);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  
  // Inject styles on component mount
  useLayoutEffect(() => {
    injectTerminalStyles();
  }, []);

  const stages = [
    {
      title: 'SYSTEM INITIALIZATION',
      text: 'Establishing secure connection...',
      code: '> LOVE_OS v2.0 booting...',
      delay: 0,
    },
    {
      title: 'ACCESS GRANTED',
      text: 'Scanning emotional parameters...',
      code: '> INTELLIGENCE_SCAN: 99.9%\n> COMPATIBILITY: OPTIMAL\n> HEART_ENCRYPTION: UNBREAKABLE',
      delay: 2000,
    },
    {
      title: 'DECRYPTING MESSAGE',
      text: 'Unlocking hidden transmission...',
      code: '> DECRYPTION_KEY: YOUR_SMILE\n> DECRYPTION_KEY: YOUR_MIND\n> DECRYPTION_KEY: YOUR_PRESENCE',
      delay: 4000,
    },
    {
      title: 'FINAL TRANSMISSION',
      text: 'The message has been decoded.',
      code: '> MESSAGE_DECODED:\n> "Will you be my Valentine?"',
      delay: 6000,
    },
  ];

  // Typing animation effect
  useEffect(() => {
    if (stage < stages.length && !response) {
      const timer = setTimeout(() => {
        setIsTyping(true);
        const fullText = stages[stage].code;
        let currentText = '';
        let charIndex = 0;

        const typeInterval = setInterval(() => {
          if (charIndex < fullText.length) {
            currentText += fullText[charIndex];
            setDisplayText(currentText);
            charIndex++;
          } else {
            setIsTyping(false);
            clearInterval(typeInterval);
          }
        }, 50);

        return () => clearInterval(typeInterval);
      }, stages[stage].delay);

      return () => clearTimeout(timer);
    }
  }, [stage, response]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    if (stage < stages.length - 1) {
      setDisplayText('');
      setStage(stage + 1);
    }
  };

  const handleYes = () => {
    setResponse('yes');
  };

  const handleNo = () => {
    setResponse('no');
  };

  const handleNoMouseEnter = () => {
    setNoButtonVisible(false);
    // Random position offset
    const offsetX = (Math.random() - 0.5) * 200;
    const offsetY = (Math.random() - 0.5) * 100;
    setNoButtonPosition({ x: offsetX, y: offsetY });
    // Reappear after 1 second
    setTimeout(() => {
      setNoButtonVisible(true);
    }, 1000);
  };

  const handleDownloadImage = () => {
    // Create a link element to trigger download
    const link = document.createElement('a');
    link.href = '/Valentine.png';
    link.download = 'Valentine.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="terminal-container">
      {/* Animated background scanlines */}
      <div className="scanlines"></div>

      {/* Matrix-style falling characters background */}
      <div className="matrix-bg">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="matrix-char" style={{ left: `${Math.random() * 100}%` }}>
            {String.fromCharCode(33 + Math.random() * 94)}
          </div>
        ))}
      </div>

      {/* Main terminal content */}
      <div className="terminal-content">
        <motion.div
          className="terminal-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="header-line">
            <span className="cyan-text">{'>'}</span>
            <span className="magenta-text"> LOVE_PROTOCOL.exe</span>
            <span className="lime-text"> [ACTIVE]</span>
          </div>
          <div className="header-divider"></div>
        </motion.div>

        {/* Stage transitions with glitch effect */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            className="terminal-stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="stage-title">
              <span className="cyan-text">{'>'}</span>
              <span className="magenta-text"> {stages[stage].title}</span>
            </div>

            {/* Glitch effect on title */}
            <motion.div
              className="glitch-effect"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <span className="cyan-text">{stages[stage].title}</span>
            </motion.div>

            {/* Code display with typing animation */}
            <div className="code-block">
              <pre>
                <code>
                  {displayText}
                  {isTyping && <span className={`cursor ${showCursor ? 'visible' : 'hidden'}`}>▌</span>}
                </code>
              </pre>
            </div>

            {/* Stage description */}
            <div className="stage-description">
              <span className="lime-text">{'>'}</span>
              <span> {stages[stage].text}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation and response buttons */}
        <motion.div
          className="terminal-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {response === null ? (
            <>
              {stage < stages.length - 1 && !isTyping && (
                <Button
                  onClick={handleNext}
                  className="terminal-button next-button"
                  variant="outline"
                >
                  <span className="cyan-text">{'>'}</span> NEXT
                </Button>
              )}

              {stage === stages.length - 1 && !isTyping && (
                <div className="response-buttons">
                  <Button
                    onClick={handleYes}
                    className="terminal-button yes-button"
                    variant="outline"
                  >
                    <span className="lime-text">{'>'}</span> YES
                  </Button>
                  {noButtonVisible && (
                    <motion.div
                      animate={{
                        x: noButtonPosition.x,
                        y: noButtonPosition.y,
                      }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Button
                        onClick={handleNo}
                        onMouseEnter={handleNoMouseEnter}
                        className="terminal-button no-button"
                        variant="outline"
                      >
                        <span className="magenta-text">{'>'}  </span> NO
                      </Button>
                    </motion.div>
                  )}
                </div>
              )}
            </>
          ) : (
            <motion.div
              className="response-message"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {response === 'yes' ? (
                <div className="success-message">
                  <div className="celebration-text">
                    <span className="lime-text">&gt;</span>
                    <span className="cyan-text"> SYSTEM UNLOCKED</span>
                  </div>
                  <div className="celebration-text">
                    <span className="magenta-text">&gt;</span>
                    <span> You've made me the happiest person alive.</span>
                  </div>
                  <div className="celebration-text">
                    <span className="cyan-text">&gt;</span>
                    <span className="lime-text"> NDAGUKUNDA CANE MUKUNZI WANJE.</span>
                  </div>
                  <Button
                    onClick={handleDownloadImage}
                    className="terminal-button download-button"
                    variant="outline"
                  >
                    <span className="cyan-text">{'>'}</span> DOWNLOAD VALENTINE
                  </Button>
                  
                  {/* Download button */}
                  <motion.div
                    className="terminal-actions"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.5 }}
                  >
                    <Button
                      onClick={handleDownloadImage}
                      className="terminal-button download-button"
                      variant="outline"
                    >
                      <span className="lime-text">{'>'}</span> DOWNLOAD VALENTINE
                    </Button>
                  </motion.div>

                  <motion.div
                    className="confetti"
                    animate={{ y: [0, -500], opacity: [1, 0] }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                  >
                    {Array.from({ length: 30 }).map((_, i) => (
                      <motion.span
                        key={i}
                        className="confetti-piece"
                        animate={{
                          x: Math.random() * 400 - 200,
                          y: Math.random() * 300,
                          rotate: Math.random() * 360,
                        }}
                        transition={{ duration: 2, ease: 'easeOut' }}
                      >
                        ✨
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              ) : (
                <div className="decline-message">
                  <div className="decline-text">
                    <span className="magenta-text">&gt;</span>
                    <span> No problem. I'll be here whenever you're ready.</span>
                  </div>
                  <div className="decline-text">
                    <span className="cyan-text">&gt;</span>
                    <span> Friendship.exe is still running...</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Footer with system info */}
        <motion.div
          className="terminal-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="footer-line">
            <span className="cyan-text">{'>'}</span>
            <span> System Status: </span>
            <span className="lime-text">OPERATIONAL</span>
          </div>
          <div className="footer-line">
            <span className="magenta-text">{'>'}</span>
            <span> Connection: </span>
            <span className="cyan-text">SECURE</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
