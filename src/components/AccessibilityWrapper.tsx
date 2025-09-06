'use client';

import { useEffect, useState } from 'react';

interface AccessibilityWrapperProps {
  children: React.ReactNode;
  announceOnMount?: string;
  role?: string;
  ariaLabel?: string;
}

export function AccessibilityWrapper({ 
  children, 
  announceOnMount, 
  role = "main", 
  ariaLabel 
}: AccessibilityWrapperProps) {
  useEffect(() => {
    // Announce content on mount if provided
    if (announceOnMount && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(announceOnMount);
      utterance.rate = 0.8;
      setTimeout(() => speechSynthesis.speak(utterance), 500);
    }

    // Add keyboard navigation improvements
    const handleKeyboard = (event: KeyboardEvent) => {
      // Enhanced Tab navigation
      if (event.key === 'Tab') {
        // Ensure visible focus indicators
        document.body.classList.add('keyboard-navigation');
      }

      // Space/Enter for button activation (already handled by buttons)
      // Arrow keys for custom navigation if needed
      if (event.key === 'Escape') {
        // Close any modal or return to main navigation
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.blur) {
          activeElement.blur();
        }
      }
    };

    document.addEventListener('keydown', handleKeyboard);
    
    // Remove keyboard class on mouse use
    const handleMouse = () => {
      document.body.classList.remove('keyboard-navigation');
    };
    
    document.addEventListener('mousedown', handleMouse);

    return () => {
      document.removeEventListener('keydown', handleKeyboard);
      document.removeEventListener('mousedown', handleMouse);
    };
  }, [announceOnMount]);

  return (
    <div 
      role={role}
      aria-label={ariaLabel}
      className="accessibility-wrapper"
      tabIndex={-1}
    >
      {/* Screen Reader Status */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        ARGUS Glass accessibility features active
      </div>
      
      {/* Skip Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Main Content */}
      <div id="main-content">
        {children}
      </div>

      {/* Accessibility Styles */}
      <style jsx global>{`
        .accessibility-wrapper {
          font-size: inherit;
          line-height: 1.6;
        }

        /* Enhanced focus indicators */
        .keyboard-navigation *:focus {
          outline: 3px solid #3b82f6 !important;
          outline-offset: 2px !important;
          border-radius: 4px !important;
        }

        /* High contrast support */
        @media (prefers-contrast: high) {
          .accessibility-wrapper {
            background: black !important;
            color: white !important;
          }
          
          .accessibility-wrapper button {
            border: 2px solid white !important;
            background: black !important;
            color: white !important;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .accessibility-wrapper * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Large text support */
        @media (min-resolution: 2dppx) {
          .accessibility-wrapper {
            font-size: 1.1em;
          }
        }

        /* Screen reader only content */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .sr-only:focus {
          position: static;
          width: auto;
          height: auto;
          padding: inherit;
          margin: inherit;
          overflow: visible;
          clip: auto;
          white-space: normal;
        }

        /* Touch target improvements */
        .accessibility-wrapper button,
        .accessibility-wrapper [role="button"],
        .accessibility-wrapper a {
          min-height: 44px;
          min-width: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
        }

        /* Voice announcement styles */
        [aria-live="polite"],
        [aria-live="assertive"] {
          position: absolute;
          left: -10000px;
          width: 1px;
          height: 1px;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}