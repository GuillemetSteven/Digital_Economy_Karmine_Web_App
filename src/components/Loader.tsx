import { useEffect, useState, useMemo } from 'react';
import { theme } from '../config/theme';

interface LoaderProps {
  onComplete: () => void;
}

type LoaderPhase = 'filling' | 'sprint' | 'tvOff' | 'done';

// Timing constants (in ms) - synchronized with light sweep
// Light sweep: G→D (0-1s), D→G (1-2s) - ONE cycle only, 100% exactly when D→G ends
const FILL_DURATION = 1400;     // Letters fill up
const SUBTITLE_DELAY = 400;     // Subtitle appears
const SPRINT_DELAY = 1500;      // Progress bar sprint starts
const SPRINT_DURATION = 500;    // Sprint 0% -> 100% (ends exactly at 2000ms = D→G end)
const TV_OFF_DELAY = 2150;      // TV effect starts (150ms after 100% to see it)
const TV_OFF_DURATION = 400;    // TV effect duration
const TOTAL_DURATION = 2600;    // Total loader duration
const LIGHT_SWEEP_DURATION = 2; // ONE cycle: G→D (0-1s) + D→G (1-2s), ends at 2s

export function Loader({ onComplete }: LoaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [phase, setPhase] = useState<LoaderPhase>('filling');
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [percentage, setPercentage] = useState(0);

  const title = theme.branding.title;
  const letters = title.split('');

  // Generate random particles positions (reduced from 30 to 15 for better performance)
  const particles = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 3,
      size: 1 + Math.random() * 2,
    })), []
  );

  useEffect(() => {
    // Show content after brief delay
    const showTimer = setTimeout(() => setShowContent(true), 100);

    // Show subtitle
    const subtitleTimer = setTimeout(() => setShowSubtitle(true), SUBTITLE_DELAY);

    // Start sprint phase
    const sprintTimer = setTimeout(() => setPhase('sprint'), SPRINT_DELAY);

    // Start TV off effect
    const tvOffTimer = setTimeout(() => setPhase('tvOff'), TV_OFF_DELAY);

    // Complete and hide
    const completeTimer = setTimeout(() => {
      setPhase('done');
      setIsVisible(false);
      onComplete();
    }, TOTAL_DURATION);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(subtitleTimer);
      clearTimeout(sprintTimer);
      clearTimeout(tvOffTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Animate percentage counter during sprint phase
  useEffect(() => {
    if (phase !== 'sprint') return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, Math.round((elapsed / SPRINT_DURATION) * 100));
      setPercentage(progress);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [phase]);

  // Hide scrollbar during loading
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Store original values
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;

    // Hide scrollbar on both html and body
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      // Restore original values
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
    };
  }, []);

  if (!isVisible) return null;

  const isTvOff = phase === 'tvOff';

  return (
    <div
      className={`fixed inset-0 z-[100] bg-karmine-bg flex flex-col items-center justify-center overflow-hidden ${
        isTvOff ? 'tv-off-effect' : ''
      }`}
    >
      {isTvOff && (
        <div className="absolute inset-0 z-50 pointer-events-none tv-crt-overlay" />
      )}

      {/* Grille de fond */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(37, 99, 235, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(37, 99, 235, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite',
          }}
        />
      </div>

      {/* Particules */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-blue-500"
            style={{
              left: `${particle.left}%`,
              bottom: '-10px',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: 0.6,
              animation: `particleFloat ${particle.duration}s ease-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(37, 99, 235, 0.15) 50%, transparent 100%)',
          animation: `lightSweep ${LIGHT_SWEEP_DURATION}s ease-in-out forwards`,
        }}
      />

      <div
        className={`absolute w-96 h-96 rounded-full blur-[120px] transition-all duration-1000 ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
        style={{
          background: 'radial-gradient(circle, rgba(37, 99, 235, 0.4) 0%, rgba(37, 99, 235, 0.1) 50%, transparent 70%)',
          animation: 'glowPulse 2s ease-in-out infinite',
        }}
      />

      {/* Logo */}
      <div className={`relative transition-all duration-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black italic tracking-tighter flex relative z-10">
          {letters.map((letter, index) => (
            <span
              key={index}
              className="inline-block letter-fill"
              style={{
                animationDelay: `${index * 70}ms`,
              }}
            >
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </h1>

        <h1
          className="absolute top-0 left-0 text-5xl sm:text-6xl md:text-8xl font-black italic tracking-tighter text-blue-500/20 flex z-0"
          style={{ animation: 'glitchLeft 2.5s ease-in-out infinite' }}
          aria-hidden="true"
        >
          {letters.map((letter, index) => (
            <span key={index} className="inline-block">
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </h1>
        <h1
          className="absolute top-0 left-0 text-5xl sm:text-6xl md:text-8xl font-black italic tracking-tighter text-cyan-500/15 flex z-0"
          style={{ animation: 'glitchRight 2.5s ease-in-out infinite' }}
          aria-hidden="true"
        >
          {letters.map((letter, index) => (
            <span key={index} className="inline-block">
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </h1>
      </div>

      {/* Sous-titre */}
      <div
        className={`mt-6 relative transition-all duration-700 ${
          showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <p className="text-xs sm:text-sm md:text-base text-blue-400 font-semibold uppercase tracking-[0.4em] loader-subtitle">
          {theme.branding.subtitle}
        </p>
        <div className="absolute -bottom-3 left-1/2 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent loader-underline" />
      </div>

      {/* Barre de progression */}
      <div
        className={`absolute bottom-[15%] sm:bottom-[12%] left-1/2 -translate-x-1/2 w-48 sm:w-64 transition-all duration-500 delay-300 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="relative h-[3px] bg-blue-900/30 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 rounded-full ${
              phase === 'sprint' || phase === 'tvOff' ? 'progress-sprint' : 'progress-glitch'
            }`}
            style={{
              backgroundSize: '200% 100%',
            }}
          />
          <div
            className={`absolute inset-y-0 left-0 bg-blue-400 rounded-full blur-sm ${
              phase === 'sprint' || phase === 'tvOff' ? 'progress-sprint' : 'progress-glitch'
            }`}
            style={{ opacity: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] sm:text-xs text-blue-500/60 font-mono">
          <span className={phase === 'filling' ? 'text-glitch' : ''}>
            {phase === 'filling' ? 'INITIALIZING' : phase === 'tvOff' ? 'COMPLETE' : 'LOADING'}
          </span>
          <span className={`percentage-display ${phase === 'filling' ? 'percentage-glitch' : ''} ${percentage === 100 ? 'text-blue-400' : ''}`}>
            {phase === 'filling' ? '0%' : `${percentage}%`}
          </span>
        </div>
      </div>

      {/* D\u00e9corations coins */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-blue-500/30" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-blue-500/30" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-blue-500/30" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-blue-500/30" />

      {/* Animations CSS */}
      <style>{`
        /* Letter blur reveal effect - starts blurry, becomes sharp */
        .letter-fill {
          color: white;
          -webkit-text-stroke: 1px rgba(59, 130, 246, 0.6);
          text-shadow:
            0 0 40px rgba(59, 130, 246, 0.8),
            0 0 80px rgba(59, 130, 246, 0.4),
            0 0 120px rgba(59, 130, 246, 0.2);
          opacity: 0;
          filter: blur(20px);
          transform: scale(1.1);
          animation: letterBlurReveal ${FILL_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes letterBlurReveal {
          0% {
            opacity: 0;
            filter: blur(20px);
            transform: scale(1.1);
          }
          40% {
            opacity: 0.6;
            filter: blur(10px);
            transform: scale(1.05);
          }
          70% {
            opacity: 0.9;
            filter: blur(4px);
            transform: scale(1.02);
          }
          100% {
            opacity: 1;
            filter: blur(0);
            transform: scale(1);
          }
        }

        /* Progress bar animations */
        .progress-glitch {
          width: 0%;
          animation: progressGlitch 0.5s ease-in-out infinite;
        }

        .progress-sprint {
          animation: progressSprint ${SPRINT_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes progressGlitch {
          0%, 100% { width: 0%; transform: translateX(0); }
          25% { width: 2%; transform: translateX(2px); }
          50% { width: 0%; transform: translateX(-1px); }
          75% { width: 1%; transform: translateX(1px); }
        }

        @keyframes progressSprint {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        /* Percentage display animations */
        .percentage-glitch {
          animation: percentageGlitch 0.3s steps(1) infinite;
        }

        @keyframes percentageGlitch {
          0%, 40%, 80%, 100% { opacity: 1; transform: translateX(0); }
          20% { opacity: 0.8; transform: translateX(2px); }
          60% { opacity: 0.7; transform: translateX(-1px); }
        }

        /* Text glitch effect */
        .text-glitch {
          animation: textGlitch 0.4s steps(1) infinite;
        }

        @keyframes textGlitch {
          0%, 90% { opacity: 1; transform: translateX(0); }
          92% { opacity: 0.8; transform: translateX(2px); color: #3b82f6; }
          94% { opacity: 1; transform: translateX(-1px); }
          96% { opacity: 0.9; transform: translateX(1px); color: #60a5fa; }
          98% { opacity: 1; transform: translateX(0); }
        }

        /* TV CRT shutdown effect */
        .tv-off-effect {
          animation: tvOff ${TV_OFF_DURATION}ms cubic-bezier(0.4, 0, 1, 1) forwards;
        }

        .tv-crt-overlay {
          background: radial-gradient(ellipse at center, transparent 0%, rgba(2, 6, 23, 0.3) 100%);
          animation: crtFlash ${TV_OFF_DURATION}ms ease-out forwards;
        }

        @keyframes tvOff {
          0% {
            transform: scale(1, 1);
            filter: brightness(1) saturate(1);
          }
          20% {
            transform: scale(1.02, 0.95);
            filter: brightness(1.3) saturate(1.2);
          }
          40% {
            transform: scale(1.01, 0.5);
            filter: brightness(1.5) saturate(1.5);
          }
          60% {
            transform: scale(0.98, 0.02);
            filter: brightness(2) saturate(2);
          }
          80% {
            transform: scale(0.5, 0.01);
            filter: brightness(2.5) saturate(2);
          }
          100% {
            transform: scale(0, 0);
            filter: brightness(0) saturate(0);
          }
        }

        @keyframes crtFlash {
          0% {
            background: radial-gradient(ellipse at center, transparent 0%, rgba(2, 6, 23, 0.3) 100%);
            box-shadow: inset 0 0 100px rgba(59, 130, 246, 0);
          }
          30% {
            background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.3) 0%, rgba(2, 6, 23, 0.5) 100%);
            box-shadow: inset 0 0 150px rgba(59, 130, 246, 0.5);
          }
          60% {
            background: linear-gradient(transparent 49%, rgba(59, 130, 246, 0.8) 49.5%, rgba(59, 130, 246, 0.8) 50.5%, transparent 51%);
            box-shadow: inset 0 0 100px rgba(59, 130, 246, 0.8);
          }
          100% {
            background: linear-gradient(transparent 49.9%, rgba(59, 130, 246, 0) 50%, rgba(59, 130, 246, 0) 50%, transparent 50.1%);
            box-shadow: inset 0 0 50px rgba(59, 130, 246, 0);
          }
        }

        /* Grid animation */
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        /* Particle animation */
        @keyframes particleFloat {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }

        /* Light sweep animation - faster cycle to complete before TV effect */
        @keyframes lightSweep {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }

        /* Glow pulse animation */
        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        /* Glitch animations for text layers */
        @keyframes glitchLeft {
          0%, 85%, 100% { transform: translate(0, 0); }
          87% { transform: translate(-4px, 2px); }
          89% { transform: translate(3px, -1px); }
          91% { transform: translate(-2px, 3px); }
          93% { transform: translate(2px, -2px); }
          95% { transform: translate(-1px, 1px); }
        }

        @keyframes glitchRight {
          0%, 85%, 100% { transform: translate(0, 0); }
          86% { transform: translate(4px, -2px); }
          88% { transform: translate(-3px, 1px); }
          90% { transform: translate(2px, -3px); }
          92% { transform: translate(-2px, 2px); }
          94% { transform: translate(1px, -1px); }
        }

        /* Subtitle animations */
        .loader-subtitle {
          animation: subtitleFade 0.8s ease-out forwards;
        }

        @keyframes subtitleFade {
          0% { opacity: 0; letter-spacing: 0.6em; }
          100% { opacity: 1; letter-spacing: 0.4em; }
        }

        .loader-underline {
          width: 0;
          animation: underlineExpand 0.8s ease-out 0.2s forwards;
        }

        @keyframes underlineExpand {
          0% { width: 0; }
          100% { width: 100%; transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
