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

          {/* Modal - Absolute center of page */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-[400px]"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-xl border border-terminal-green/30 bg-dark-900 shadow-2xl shadow-terminal-green/10">
              {/* Content */}
              <div className="p-6">
                {/* Title */}
                <div className="mb-5 text-center">
                  <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-terminal-green/30 bg-terminal-green/10 px-3 py-1">
                    <span className="text-base">🛰️</span>
                    <span className="font-mono text-xs font-medium text-terminal-green">
                      TRANSMISSION METADATA
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-xs text-gray-400">
                    The Lab logs contextual data with your message
                  </p>
                </div>

                {/* Data list - Compact 2x2 grid */}
                <div className="mb-5 rounded-lg border border-terminal-green/20 bg-dark-800/50 p-4">
                  <div className="grid grid-cols-2 gap-3 font-mono text-xs">
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
                  
                  {/* Expandable details inside the box */}
                  <button
                    type="button"
                    onClick={() => setShowDetails(!showDetails)}
                    className="mt-3 w-full text-left font-mono text-xs text-gray-500 transition-colors hover:text-terminal-green"
                  >
                    {showDetails ? '▼ Hide' : '▶ What we DON\'T collect'}
                  </button>

                  <AnimatePresence>
                    {showDetails && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-2 font-mono text-xs text-gray-500">
                          ❌ Browsing history ❌ Other tabs ❌ Files ❌ Anything else
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* GPS Teaser */}
                <div className="mb-5 rounded-lg border border-neon-cyan/20 bg-neon-cyan/5 p-3">
                  <p className="font-mono text-xs text-neon-cyan/80">
                    ✨ <span className="font-bold">Share GPS</span> and we&apos;ll show you how far your message travels to reach the Lab!
                  </p>
                </div>

                {/* Location choice buttons - side by side */}
                <div className="mb-5 grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    onClick={() => onConsent(true)}
                    disabled={isLoading}
                    className="group relative overflow-hidden rounded-lg border border-terminal-green/50 bg-terminal-green/10 py-4 font-mono transition-all hover:bg-terminal-green/20 disabled:cursor-not-allowed disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex flex-col items-center gap-1 text-terminal-green">
                      <span className="text-2xl">📍</span>
                      <span className="text-xs font-bold">Precise</span>
                      <span className="text-[10px] text-terminal-green/60">GPS</span>
                    </span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => onConsent(false)}
                    disabled={isLoading}
                    className="group relative overflow-hidden rounded-lg border border-gray-600/50 bg-dark-800/50 py-4 font-mono transition-all hover:border-gray-500/50 hover:bg-dark-800 disabled:cursor-not-allowed disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex flex-col items-center gap-1 text-gray-300">
                      <span className="text-2xl">🌐</span>
                      <span className="text-xs font-bold">Approximate</span>
                      <span className="text-[10px] text-gray-500">IP-based</span>
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
                  <p className="font-mono text-[10px] leading-relaxed text-gray-500">
                    <span className="font-bold text-terminal-green">🔒</span> AES-256 encrypted. Never sold. Deleted on request.
                    Also backed up on a physical drive Avan maintains himself — old school, paranoid, secure.
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
              <div className="pointer-events-none absolute left-0 top-0 h-5 w-5 border-l border-t border-terminal-green/30" />
              <div className="pointer-events-none absolute right-0 top-0 h-5 w-5 border-r border-t border-terminal-green/30" />
              <div className="pointer-events-none absolute bottom-0 left-0 h-5 w-5 border-b border-l border-terminal-green/30" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-5 w-5 border-b border-r border-terminal-green/30" />
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}