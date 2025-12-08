'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MetadataConsentModal from '@/components/ui/MetadataConsentModal';

// ============================================
// TYPES
// ============================================
interface FormData {
  message: string;
  audioBlob: Blob | null;
  audioDuration: number;
  selfieDataUrl: string | null;
  contactEmail: string;
  contactSocial: string;
}

interface SubmissionResponse {
  success: boolean;
  id?: string;
  location?: {
    city: string | null;
    country: string | null;
    source: 'gps' | 'ip';
  };
  error?: string;
}

// ============================================
// WITTY MESSAGES
// ============================================
const WITTY_PLACEHOLDERS = [
  "Tell me something interesting... or just say hi, I don't judge.",
  "Your message here. Make it memorable, I read these with coffee.",
  "Go ahead, spill the tea ☕",
  "What's on your mind? (Besides the existential dread)",
  "Type something profound... or just 'hi', that works too.",
];

const SELFIE_CAPTIONS = [
  "Avan will see this face when he reads your message 📸",
  "This is the face of someone with great taste in websites",
  "Looking good! (I assume, I'm just code)",
  "Smile! You're on Anomaly Camera™",
  "The face behind the message. Very mysterious.",
];

const AUDIO_ENCOURAGEMENTS = [
  "Your voice is being captured by science...",
  "Recording... make it count!",
  "Speak now or forever hold your peace",
  "The microphone is listening intently...",
  "Your dulcet tones are being preserved",
];

const SUCCESS_MESSAGES = [
  "Your message has been beamed across the digital void.",
  "Transmission received loud and clear!",
  "Successfully stored in the Lab's quantum memory banks.",
  "Message encrypted and delivered to Avan's consciousness.",
];

// ============================================
// HELPER: Convert Blob to Base64
// ============================================
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// ============================================
// HELPER: Compress Image
// ============================================
async function compressImage(dataUrl: string, maxWidth = 800, quality = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
}

// ============================================
// HELPER: Get Device Info
// ============================================
function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language,
  };
}

// ============================================
// HELPER: Request GPS Location
// ============================================
async function requestGPSLocation(): Promise<{ lat: number; lng: number; accuracy: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      () => {
        // User denied or error
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

// ============================================
// HELPER: Format time
// ============================================
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============================================
// AUDIO RECORDER COMPONENT
// ============================================
function AudioRecorder({ 
  onRecordingComplete,
  disabled,
}: { 
  onRecordingComplete: (blob: Blob, duration: number) => void;
  disabled?: boolean;
}) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [encouragement] = useState(() => 
    AUDIO_ENCOURAGEMENTS[Math.floor(Math.random() * AUDIO_ENCOURAGEMENTS.length)]
  );
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const MAX_DURATION = 60; // 1 minute

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob, duration);
        setHasRecording(true);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= MAX_DURATION - 1) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (err) {
      console.error('Microphone error:', err);
      setPermissionDenied(true);
    }
  };

  const clearRecording = () => {
    setHasRecording(false);
    setDuration(0);
    onRecordingComplete(null as unknown as Blob, 0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  if (permissionDenied) {
    return (
      <div className="rounded-lg border border-neon-pink/30 bg-neon-pink/5 p-4 text-center">
        <p className="font-mono text-sm text-neon-pink">
          🎤 Microphone access denied. Check your browser permissions!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block font-mono text-sm text-terminal-green/80">
        Audio Note <span className="text-gray-500">(optional, max 1 min)</span>
      </label>
      
      <div className="relative overflow-hidden rounded-lg border border-terminal-green/30 bg-dark-800/50 p-4">
        {/* Waveform visualization */}
        {isRecording && (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="mx-0.5 w-1 rounded-full bg-terminal-green"
                animate={{
                  height: [10, 30 + Math.random() * 20, 10],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Record/Stop Button */}
            <motion.button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={hasRecording || disabled}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-all ${
                isRecording 
                  ? 'bg-neon-pink shadow-[0_0_20px_rgba(255,0,110,0.5)]' 
                  : hasRecording || disabled
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-terminal-green/20 hover:bg-terminal-green/30'
              }`}
              whileHover={!hasRecording && !disabled ? { scale: 1.05 } : {}}
              whileTap={!hasRecording && !disabled ? { scale: 0.95 } : {}}
            >
              {isRecording ? (
                <motion.div 
                  className="h-5 w-5 rounded bg-white"
                  animate={{ scale: [1, 0.9, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-neon-pink" />
              )}
            </motion.button>

            {/* Status */}
            <div>
              {isRecording ? (
                <div>
                  <motion.p 
                    className="font-mono text-lg text-terminal-green"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {formatTime(duration)} / {formatTime(MAX_DURATION)}
                  </motion.p>
                  <p className="font-mono text-xs text-gray-500">{encouragement}</p>
                </div>
              ) : hasRecording ? (
                <div>
                  <p className="font-mono text-lg text-terminal-green">
                    ✓ {formatTime(duration)} recorded
                  </p>
                  <p className="font-mono text-xs text-gray-500">Ready to transmit</p>
                </div>
              ) : (
                <div>
                  <p className="font-mono text-sm text-gray-400">Tap to record</p>
                  <p className="font-mono text-xs text-gray-500">Add a voice message</p>
                </div>
              )}
            </div>
          </div>

          {/* Clear button */}
          {hasRecording && (
            <motion.button
              type="button"
              onClick={clearRecording}
              disabled={disabled}
              className="rounded-lg border border-gray-600 px-3 py-1 font-mono text-xs text-gray-400 transition-all hover:border-neon-pink/50 hover:text-neon-pink disabled:cursor-not-allowed disabled:opacity-50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// SELFIE CAPTURE COMPONENT
// ============================================
function SelfieCapture({ 
  onCapture,
  disabled,
}: { 
  onCapture: (dataUrl: string | null) => void;
  disabled?: boolean;
}) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [selfieCaption] = useState(() =>
    SELFIE_CAPTIONS[Math.floor(Math.random() * SELFIE_CAPTIONS.length)]
  );
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
      setCaptureError(null);
    } catch (err) {
      console.error('Camera error:', err);
      setPermissionDenied(true);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
    setCountdown(null);
  };

  const startCountdown = () => {
    setCountdown(3);
  };

  // Capture methods with fallbacks
  const captureWithImageCapture = async (): Promise<string | null> => {
    if (!streamRef.current) return null;
    
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return null;

    try {
      // @ts-ignore - ImageCapture may not be in types
      const imageCapture = new ImageCapture(videoTrack);
      const blob = await imageCapture.takePhoto();
      
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.log('ImageCapture API failed, trying canvas fallback');
      return null;
    }
  };

  const captureWithCanvas = async (): Promise<string | null> => {
    if (!videoRef.current) return null;
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      if (dataUrl && dataUrl.length > 100 && !dataUrl.includes('data:,')) {
        return dataUrl;
      }
      return null;
    } catch (err) {
      console.error('Canvas capture failed:', err);
      return null;
    }
  };

  const captureWithCanvasBlob = async (): Promise<string | null> => {
    if (!videoRef.current) return null;
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob && blob.size > 1000) {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        } else {
          resolve(null);
        }
      }, 'image/jpeg', 0.7);
    });
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      const capture = async () => {
        setIsCapturing(true);
        
        let dataUrl = await captureWithImageCapture();
        
        if (!dataUrl) {
          dataUrl = await captureWithCanvasBlob();
        }
        
        if (!dataUrl) {
          dataUrl = await captureWithCanvas();
        }
        
        if (dataUrl) {
          setCapturedImage(dataUrl);
          onCapture(dataUrl);
          closeCamera();
        } else {
          setCaptureError('Could not capture image. Try disabling fingerprinting protection in Brave shields.');
        }
        
        setIsCapturing(false);
      };
      
      capture();
      setCountdown(null);
    }
  }, [countdown, onCapture]);

  const retakeSelfie = () => {
    setCapturedImage(null);
    setCaptureError(null);
    onCapture(null);
    openCamera();
  };

  const clearSelfie = () => {
    setCapturedImage(null);
    setCaptureError(null);
    onCapture(null);
  };

  if (permissionDenied) {
    return (
      <div className="rounded-lg border border-neon-pink/30 bg-neon-pink/5 p-4 text-center">
        <p className="font-mono text-sm text-neon-pink">
          📷 Camera access denied. Check your browser permissions!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block font-mono text-sm text-terminal-green/80">
        Selfie <span className="text-gray-500">(optional, captured live)</span>
      </label>

      {captureError && (
        <motion.div 
          className="rounded-lg border border-terminal-amber/30 bg-terminal-amber/5 p-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="font-mono text-xs text-terminal-amber">{captureError}</p>
          <button
            type="button"
            onClick={retakeSelfie}
            disabled={disabled}
            className="mt-2 font-mono text-xs text-terminal-green underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            Try again
          </button>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {isCameraOpen ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-lg border-2 border-terminal-green/50 bg-dark-800"
          >
            {/* Retro camera overlay */}
            <div className="pointer-events-none absolute inset-0 z-10">
              <div className="absolute left-2 top-2 flex items-center gap-2">
                <motion.div
                  className="h-3 w-3 rounded-full bg-neon-pink"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="font-mono text-xs text-neon-pink">REC</span>
              </div>
              <div className="absolute right-2 top-2 font-mono text-xs text-terminal-green/60">
                ANOMALY CAM™
              </div>
              <div className="absolute bottom-2 left-2 font-mono text-xs text-gray-500">
                {new Date().toLocaleTimeString()}
              </div>
              {/* Corner brackets */}
              <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-terminal-green/50" />
              <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-terminal-green/50" />
              <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-terminal-green/50" />
              <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-terminal-green/50" />
            </div>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="aspect-video w-full scale-x-[-1] object-cover"
            />

            {/* Countdown overlay */}
            {countdown !== null && countdown > 0 && (
              <motion.div
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.span
                  key={countdown}
                  className="font-mono text-8xl font-bold text-terminal-green"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                >
                  {countdown}
                </motion.span>
              </motion.div>
            )}

            {/* Capture flash */}
            {isCapturing && (
              <motion.div
                className="absolute inset-0 z-30 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.3 }}
              />
            )}

            {/* Controls */}
            <div className="flex justify-center gap-4 bg-dark-900/80 p-4">
              <motion.button
                type="button"
                onClick={closeCamera}
                disabled={disabled}
                className="rounded-lg border border-gray-600 px-4 py-2 font-mono text-sm text-gray-400 transition-all hover:border-neon-pink/50 hover:text-neon-pink disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={startCountdown}
                disabled={countdown !== null || disabled}
                className="rounded-lg bg-terminal-green px-6 py-2 font-mono text-sm font-bold text-dark-900 transition-all hover:bg-terminal-green/90 disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {countdown !== null ? 'Get Ready!' : '📸 Capture'}
              </motion.button>
            </div>
          </motion.div>
        ) : capturedImage ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-lg border border-terminal-green/30 bg-dark-800"
          >
            <img 
              src={capturedImage} 
              alt="Your selfie" 
              className="aspect-video w-full object-cover"
            />
            
            {/* Caption overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-900 to-transparent p-4">
              <p className="font-mono text-xs text-terminal-green/80">{selfieCaption}</p>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2 bg-dark-900/80 p-3">
              <motion.button
                type="button"
                onClick={clearSelfie}
                disabled={disabled}
                className="rounded-lg border border-gray-600 px-3 py-1 font-mono text-xs text-gray-400 transition-all hover:border-neon-pink/50 hover:text-neon-pink disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Remove
              </motion.button>
              <motion.button
                type="button"
                onClick={retakeSelfie}
                disabled={disabled}
                className="rounded-lg border border-terminal-green/50 px-3 py-1 font-mono text-xs text-terminal-green transition-all hover:bg-terminal-green/10 disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Retake
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="trigger"
            type="button"
            onClick={openCamera}
            disabled={disabled}
            className="group relative w-full overflow-hidden rounded-lg border border-dashed border-terminal-green/30 bg-dark-800/30 p-8 transition-all hover:border-terminal-green/50 hover:bg-dark-800/50 disabled:cursor-not-allowed disabled:opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                className="text-4xl"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📸
              </motion.div>
              <p className="font-mono text-sm text-gray-400">
                Tap to open camera
              </p>
              <p className="font-mono text-xs text-gray-600">
                Show Avan who&apos;s reaching out!
              </p>
            </div>
            
            {/* Corner decorations */}
            <div className="pointer-events-none absolute inset-4">
              <div className="absolute left-0 top-0 h-6 w-6 border-l border-t border-terminal-green/40" />
              <div className="absolute right-0 top-0 h-6 w-6 border-r border-t border-terminal-green/40" />
              <div className="absolute bottom-0 left-0 h-6 w-6 border-b border-l border-terminal-green/40" />
              <div className="absolute bottom-0 right-0 h-6 w-6 border-b border-r border-terminal-green/40" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MAIN CONTACT SECTION
// ============================================
export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    message: '',
    audioBlob: null,
    audioDuration: 0,
    selfieDataUrl: null,
    contactEmail: '',
    contactSocial: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [placeholder] = useState(() =>
    WITTY_PLACEHOLDERS[Math.floor(Math.random() * WITTY_PLACEHOLDERS.length)]
  );
  const [successMessage] = useState(() =>
    SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]
  );

  // Handle form submission trigger
  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      return;
    }

    setError(null);
    setShowConsentModal(true);
  };

  // Handle consent and actual submission
  const handleConsent = async (preciselocation: boolean) => {
    setIsSubmitting(true);

    try {
      // Get GPS location if user consented
      let locationCoords = null;
      if (preciselocation) {
        locationCoords = await requestGPSLocation();
      }

      // Prepare audio data
      let audioBase64 = null;
      if (formData.audioBlob) {
        audioBase64 = await blobToBase64(formData.audioBlob);
      }

      // Compress and prepare image data
      let imageBase64 = null;
      if (formData.selfieDataUrl) {
        imageBase64 = await compressImage(formData.selfieDataUrl, 800, 0.7);
      }

      // Gather device info
      const deviceInfo = getDeviceInfo();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timezoneOffset = new Date().getTimezoneOffset();
      const languages = [...navigator.languages];

      // Send to API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: formData.message.trim(),
          audioBase64,
          audioDuration: formData.audioDuration || null,
          imageBase64,
          contactEmail: formData.contactEmail || null,
          contactSocial: formData.contactSocial || null,
          locationPrecise: preciselocation && locationCoords !== null,
          locationCoords,
          deviceInfo,
          timezone,
          timezoneOffset,
          languages,
        }),
      });

      const result: SubmissionResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to submit');
      }

      setSubmissionResult(result);
      setShowConsentModal(false);
      setIsSubmitted(true);

    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setShowConsentModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      message: '',
      audioBlob: null,
      audioDuration: 0,
      selfieDataUrl: null,
      contactEmail: '',
      contactSocial: '',
    });
    setIsSubmitted(false);
    setSubmissionResult(null);
    setError(null);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-dark-900 py-20">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,255,65,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-terminal-green/5 blur-3xl" />
        <div className="absolute -right-40 bottom-20 h-80 w-80 rounded-full bg-neon-cyan/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-6">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="mb-4 inline-block rounded-full border border-terminal-green/30 bg-terminal-green/5 px-4 py-1"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <span className="font-mono text-xs text-terminal-green">
              📡 TRANSMISSION PORTAL
            </span>
          </motion.div>

          <h2 className="mb-4 font-mono text-4xl font-bold text-white md:text-5xl">
            Get in <span className="text-terminal-green">Touch</span>
          </h2>

          <p className="mx-auto max-w-md font-mono text-sm text-gray-400">
            Got a project idea? Want to collaborate? Or just want to say hi?
            <br />
            <span className="text-terminal-amber">
              Drop a message, record a voice note, or even snap a selfie.
            </span>
          </p>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            className="mb-6 rounded-lg border border-neon-pink/30 bg-neon-pink/5 p-4 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-mono text-sm text-neon-pink">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 font-mono text-xs text-gray-400 underline hover:text-white"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Form */}
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-xl border border-terminal-green/30 bg-dark-800/50 p-8 text-center backdrop-blur-sm"
            >
              <motion.div
                className="mb-4 text-6xl"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 0.5 }}
              >
                🚀
              </motion.div>
              <h3 className="mb-2 font-mono text-2xl font-bold text-terminal-green">
                Message Transmitted!
              </h3>
              <p className="mb-4 font-mono text-sm text-gray-400">
                {successMessage}
              </p>
              
              {/* Location info */}
              {submissionResult?.location && (
                <motion.div
                  className="mb-6 inline-block rounded-lg border border-terminal-green/20 bg-dark-900/50 px-4 py-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="font-mono text-xs text-gray-500">
                    📍 Transmitted from{' '}
                    <span className="text-terminal-green">
                      {submissionResult.location.city || 'Unknown'}, {submissionResult.location.country || 'Unknown'}
                    </span>
                    {' '}({submissionResult.location.source === 'gps' ? 'GPS' : 'IP'})
                  </p>
                </motion.div>
              )}

              <p className="mb-6 font-mono text-xs text-gray-500">
                Avan will get back to you faster than a compile error.
              </p>
              
              <motion.button
                onClick={handleReset}
                className="rounded-lg border border-terminal-green/30 px-6 py-2 font-mono text-sm text-terminal-green transition-all hover:bg-terminal-green/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Another Message
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmitClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 rounded-xl border border-terminal-green/20 bg-dark-800/30 p-6 backdrop-blur-sm md:p-8"
            >
              {/* Message Input */}
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="block font-mono text-sm text-terminal-green/80"
                >
                  Your Message <span className="text-neon-pink">*</span>
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder={placeholder}
                  required
                  disabled={isSubmitting}
                  rows={5}
                  className="w-full resize-none rounded-lg border border-terminal-green/20 bg-dark-900/50 p-4 font-mono text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-terminal-green/50 focus:ring-1 focus:ring-terminal-green/30 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-right font-mono text-xs text-gray-500">
                  {formData.message.length} characters
                </p>
              </div>

              {/* Contact fields (optional) */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block font-mono text-sm text-terminal-green/80"
                  >
                    Email <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, contactEmail: e.target.value })
                    }
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-terminal-green/20 bg-dark-900/50 p-3 font-mono text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-terminal-green/50 focus:ring-1 focus:ring-terminal-green/30 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="social"
                    className="block font-mono text-sm text-terminal-green/80"
                  >
                    Social <span className="text-gray-500">(optional)</span>
                  </label>
                  <input
                    id="social"
                    type="text"
                    value={formData.contactSocial}
                    onChange={(e) =>
                      setFormData({ ...formData, contactSocial: e.target.value })
                    }
                    placeholder="@username or LinkedIn URL"
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-terminal-green/20 bg-dark-900/50 p-3 font-mono text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-terminal-green/50 focus:ring-1 focus:ring-terminal-green/30 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Audio Recorder */}
              <AudioRecorder
                onRecordingComplete={(blob, duration) =>
                  setFormData({
                    ...formData,
                    audioBlob: blob,
                    audioDuration: duration,
                  })
                }
                disabled={isSubmitting}
              />

              {/* Selfie Capture */}
              <SelfieCapture
                onCapture={(dataUrl) =>
                  setFormData({ ...formData, selfieDataUrl: dataUrl })
                }
                disabled={isSubmitting}
              />

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || !formData.message.trim()}
                className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-terminal-green to-neon-cyan py-4 font-mono text-lg font-bold text-dark-900 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-terminal-green"
                  animate={{
                    x: ['0%', '100%', '0%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{ width: '200%', marginLeft: '-50%' }}
                />

                <span className="relative z-10 flex items-center justify-center gap-2">
                  Transmit to Lab
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>

              {/* Security note */}
              <p className="text-center font-mono text-xs text-gray-500">
                🔒 All media is captured live — no file uploads for your security
              </p>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Fun footer */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-mono text-xs text-gray-600">
            Built with 💚 and probably too much coffee
          </p>
        </motion.div>
      </div>

      {/* Consent Modal */}
      <MetadataConsentModal
        isOpen={showConsentModal}
        onClose={() => {
          setShowConsentModal(false);
          setIsSubmitting(false);
        }}
        onConsent={handleConsent}
        isLoading={isSubmitting}
      />
    </section>
  );
}