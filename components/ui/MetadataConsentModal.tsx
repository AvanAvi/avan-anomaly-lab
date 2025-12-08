// components/ui/MetadataConsentModal.tsx
// Consent modal for location and metadata collection

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================

interface MetadataConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (precise: boolean) => void;
  isLoading: boolean;
}

// ============================================
// COMPONENT
// ============================================

export default function MetadataConsentModal({
  isOpen,
  onClose,
  onConsent,
  isLoading,
}: MetadataConsentModalProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal - Fixed at top with proper spacing */}
          <motion.div
            className="fixed left-1/2 top-8 z-50 w-full max-w-md -translate-x-1/2 px-4 sm:top-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          >
            <div className="relative max-h-[85vh] overflow-y-auto rounded-xl border border-terminal-green/30 bg-dark-900 shadow-2xl shadow-terminal-green/10">
              {/* Content */}
              <div className="p-5">
                {/* Title */}
                <div className="mb-4 text-center">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-terminal-green/30 bg-terminal-green/10 px-3 py-1">
                    <span className="text-base">🛰️</span>
                    <span className="font-mono text-xs font-medium text-terminal-green">
                      TRANSMISSION METADATA
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="mb-4 text-center font-mono text-xs text-gray-400">
                  The Lab logs some contextual data with your message:
                </p>

                {/* Data list - Compact 2x2 grid */}
                <div className="mb-4 rounded-lg border border-terminal-green/20 bg-dark-800/50 p-3">
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="text-terminal-green">📍</span>
                      <span>Location</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="text-terminal-green">🖥️</span>
                      <span>Device info</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="text-terminal-green">🕐</span>
                      <span>Timezone</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="text-terminal-green">🌐</span>
                      <span>Language</span>
                    </div>
                  </div>
                </div>

                {/* Expandable details */}
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="mb-4 w-full text-center font-mono text-xs text-gray-500 transition-colors hover:text-terminal-green"
                >
                  {showDetails ? '▼ Hide details' : '▶ What we DON\'T collect'}
                </button>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-4 overflow-hidden"
                    >
                      <div className="rounded-lg border border-gray-700/50 bg-dark-800/30 p-3">
                        <p className="font-mono text-xs text-gray-500">
                          ❌ Browsing history &nbsp; ❌ Other tabs
                          <br />
                          ❌ Contacts or files &nbsp; ❌ Anything else
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Location choice buttons */}
                <div className="mb-4 space-y-2">
                  <motion.button
                    type="button"
                    onClick={() => onConsent(true)}
                    disabled={isLoading}
                    className="group relative w-full overflow-hidden rounded-lg border border-terminal-green/50 bg-terminal-green/10 py-3 font-mono transition-all hover:bg-terminal-green/20 disabled:cursor-not-allowed disabled:opacity-50"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 text-sm text-terminal-green">
                      <span>📍</span>
                      <span className="font-bold">Share Precise Location</span>
                      <span className="text-xs text-terminal-green/60">(GPS)</span>
                    </span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => onConsent(false)}
                    disabled={isLoading}
                    className="group relative w-full overflow-hidden rounded-lg border border-gray-600/50 bg-dark-800/50 py-3 font-mono transition-all hover:border-gray-500/50 hover:bg-dark-800 disabled:cursor-not-allowed disabled:opacity-50"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 text-sm text-gray-300">
                      <span>🌐</span>
                      <span className="font-bold">Use Approximate</span>
                      <span className="text-xs text-gray-500">(IP-based)</span>
                    </span>
                  </motion.button>
                </div>

                {/* Loading state */}
                {isLoading && (
                  <motion.div
                    className="mb-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="inline-flex items-center gap-2 font-mono text-sm text-terminal-amber">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        ⚡
                      </motion.span>
                      Transmitting...
                    </div>
                  </motion.div>
                )}

                {/* Privacy notice - Compact */}
                <div className="rounded-lg border border-terminal-green/10 bg-terminal-green/5 p-3">
                  <p className="font-mono text-xs leading-relaxed text-gray-400">
                    <span className="font-bold text-terminal-green">🔒 LAB PROTOCOLS</span>
                    <br />
                    AES-256 encrypted. Never sold. Deleted on request.
                  </p>
                  <p className="mt-2 font-mono text-xs leading-relaxed text-gray-500">
                    Also backed up on a physical drive Avan maintains himself. 
                    The man who wrote about Kafka&apos;s peculiarity? Equally peculiar. 
                    Old school? Perhaps. Paranoid? Definitely. Secure? Absolutely.
                  </p>
                </div>

                {/* Cancel button */}
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="mt-4 w-full py-2 font-mono text-xs text-gray-500 transition-colors hover:text-gray-300 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>

              {/* Corner decorations */}
              <div className="pointer-events-none absolute left-0 top-0 h-6 w-6 border-l border-t border-terminal-green/30" />
              <div className="pointer-events-none absolute right-0 top-0 h-6 w-6 border-r border-t border-terminal-green/30" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-b border-l border-terminal-green/30" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b border-r border-terminal-green/30" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}