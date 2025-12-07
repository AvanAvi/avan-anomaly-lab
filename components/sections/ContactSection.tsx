'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface FormData {
  message: string;
  audioBlob: Blob | null;
  audioDuration: number;
  selfieDataUrl: string | null;
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

// ============================================
// AUDIO RECORDER COMPONENT
// ============================================
function AudioRecorder({ 
  onRecordingComplete 
}: { 
  onRecordingComplete: (blob: Blob, duration: number) => void 
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

  useEffect(() => {
    // Auto-stop at max duration
    if (duration >= MAX_DURATION && isRecording) {
      stopRecording();
    }
  }, [duration, isRecording, stopRecording]);

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
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete(blob, duration);
        setHasRecording(true);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);

    } catch (err) {
      console.error('Microphone access denied:', err);
      setPermissionDenied(true);
    }
  };

  const clearRecording = () => {
    setHasRecording(false);
    setDuration(0);
    onRecordingComplete(null as unknown as Blob, 0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
              disabled={hasRecording}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-all ${
                isRecording 
                  ? 'bg-neon-pink shadow-[0_0_20px_rgba(255,0,110,0.5)]' 
                  : hasRecording
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-terminal-green/20 hover:bg-terminal-green/30'
              }`}
              whileHover={!hasRecording ? { scale: 1.05 } : {}}
              whileTap={!hasRecording ? { scale: 0.95 } : {}}
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
                  <p className="font-mono text-sm text-terminal-green">
                    ✓ Recorded {formatTime(duration)}
                  </p>
                  <p className="font-mono text-xs text-gray-500">Voice note captured!</p>
                </div>
              ) : (
                <p className="font-mono text-sm text-gray-400">
                  Tap to record your voice note
                </p>
              )}
            </div>
          </div>

          {/* Clear button */}
          {hasRecording && (
            <motion.button
              type="button"
              onClick={clearRecording}
              className="rounded px-3 py-1 font-mono text-xs text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Re-record
            </motion.button>
          )}
        </div>

        {/* Progress bar */}
        {isRecording && (
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-dark-900">
            <motion.div
              className="h-full bg-gradient-to-r from-terminal-green to-neon-cyan"
              style={{ width: `${(duration / MAX_DURATION) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// SELFIE CAPTURE COMPONENT
// Uses ImageCapture API (Brave-friendly) with canvas fallback
// ============================================
function SelfieCapture({
  onCapture,
}: {
  onCapture: (dataUrl: string | null) => void;
}) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [caption] = useState(() =>
    SELFIE_CAPTIONS[Math.floor(Math.random() * SELFIE_CAPTIONS.length)]
  );
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const openCamera = async () => {
    try {
      setCaptureError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => resolve();
          }
        });
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error('Camera access denied:', err);
      setPermissionDenied(true);
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };

  const takeSelfie = () => {
    setCountdown(3);
  };

  // Capture using ImageCapture API (works in Brave)
  const captureWithImageCapture = async (): Promise<string | null> => {
    if (!streamRef.current) return null;
    
    const videoTrack = streamRef.current.getVideoTracks()[0];
    if (!videoTrack) return null;

    try {
      // @ts-ignore - ImageCapture may not be in types
      const imageCapture = new ImageCapture(videoTrack);
      const blob = await imageCapture.takePhoto();
      
      // Convert blob to data URL
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

  // Fallback: capture using canvas (may be blocked in Brave)
  const captureWithCanvas = async (): Promise<string | null> => {
    if (!videoRef.current) return null;
    
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    // Draw video frame (mirrored)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    try {
      // Try to get data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      
      // Check if it's a valid image (not blocked by fingerprinting)
      if (dataUrl && dataUrl.length > 100 && !dataUrl.includes('data:,')) {
        return dataUrl;
      }
      return null;
    } catch (err) {
      console.error('Canvas capture failed:', err);
      return null;
    }
  };

  // Capture using blob from canvas (another approach)
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
      // Take the photo - try multiple methods
      const capture = async () => {
        setIsCapturing(true);
        
        // Try methods in order of Brave compatibility
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
          setCaptureError('Could not capture image. Try disabling fingerprinting protection in Brave shields (click the lion icon).');
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

      {/* Capture error message */}
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
            className="mt-2 font-mono text-xs text-terminal-green underline"
          >
            Try again
          </button>
        </motion.div>
      )}

      {/* Camera view or captured image */}
      <AnimatePresence mode="wait">
        {isCameraOpen ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-lg border-2 border-terminal-green/50"
          >
            {/* Camcorder frame overlay */}
            <div className="pointer-events-none absolute inset-0 z-10">
              {/* Corner brackets */}
              <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-terminal-green" />
              <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-terminal-green" />
              <div className="absolute bottom-16 left-4 h-8 w-8 border-b-2 border-l-2 border-terminal-green" />
              <div className="absolute bottom-16 right-4 h-8 w-8 border-b-2 border-r-2 border-terminal-green" />

              {/* REC indicator */}
              <div className="absolute left-6 top-6 flex items-center gap-2 rounded bg-dark-900/80 px-2 py-1">
                <motion.div
                  className="h-2 w-2 rounded-full bg-neon-pink"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="font-mono text-xs text-white">LIVE</span>
              </div>

              {/* Timestamp */}
              <div className="absolute bottom-[4.5rem] left-6 rounded bg-dark-900/80 px-2 py-1">
                <span className="font-mono text-xs text-terminal-green">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>

              {/* ANOMALY watermark */}
              <div className="absolute bottom-[4.5rem] right-6 rounded bg-dark-900/80 px-2 py-1">
                <span className="font-mono text-xs text-terminal-amber">ANOMALY CAM</span>
              </div>
            </div>

            {/* Countdown overlay */}
            <AnimatePresence>
              {(countdown !== null && countdown > 0) || isCapturing ? (
                <motion.div
                  className="absolute inset-0 z-20 flex items-center justify-center bg-dark-900/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {isCapturing ? (
                    <motion.div
                      className="font-mono text-2xl text-terminal-green"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      📸 Capturing...
                    </motion.div>
                  ) : (
                    <motion.span
                      key={countdown}
                      className="font-mono text-8xl font-bold text-terminal-green"
                      initial={{ scale: 2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {countdown}
                    </motion.span>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-64 w-full bg-dark-900 object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />

            {/* Camera controls */}
            <div className="flex justify-center gap-4 bg-dark-800 p-4">
              <motion.button
                type="button"
                onClick={takeSelfie}
                disabled={countdown !== null}
                className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-transparent transition-all hover:bg-white/10 disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="h-10 w-10 rounded-full bg-white" />
              </motion.button>
              <motion.button
                type="button"
                onClick={closeCamera}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-700 text-white transition-colors hover:bg-gray-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✕
              </motion.button>
            </div>
          </motion.div>
        ) : capturedImage ? (
          <motion.div
            key="captured"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative overflow-hidden rounded-lg border-2 border-terminal-green"
          >
            {/* Camcorder frame on captured image */}
            <div className="pointer-events-none absolute inset-0 z-10">
              {/* Corner brackets */}
              <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-terminal-green" />
              <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-terminal-green" />
              <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-terminal-green" />
              <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-terminal-green" />

              {/* Captured indicator */}
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded bg-dark-900/80 px-2 py-1">
                <span className="font-mono text-xs text-terminal-green">✓ CAPTURED</span>
              </div>

              {/* ANOMALY watermark */}
              <div className="absolute bottom-4 right-4 rounded bg-dark-900/80 px-2 py-1">
                <span className="font-mono text-xs text-terminal-amber">ANOMALY CAM</span>
              </div>

              {/* Scanlines effect */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.1) 2px, rgba(0,255,65,0.1) 4px)',
                }}
              />
            </div>

            <img
              src={capturedImage}
              alt="Your selfie"
              className="h-64 w-full object-cover"
            />

            {/* Caption */}
            <div className="bg-dark-800 p-3 text-center">
              <p className="font-mono text-sm text-terminal-amber">{caption}</p>
            </div>

            {/* Retake button */}
            <div className="flex justify-center gap-3 bg-dark-800 pb-4">
              <motion.button
                type="button"
                onClick={retakeSelfie}
                className="rounded-lg border border-terminal-green/30 px-4 py-2 font-mono text-sm text-terminal-green transition-colors hover:bg-terminal-green/10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                📸 Retake
              </motion.button>
              <motion.button
                type="button"
                onClick={clearSelfie}
                className="rounded-lg border border-gray-600 px-4 py-2 font-mono text-sm text-gray-400 transition-colors hover:bg-gray-700"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Remove
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="button"
            type="button"
            onClick={openCamera}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="group relative w-full overflow-hidden rounded-lg border-2 border-dashed border-terminal-green/30 bg-dark-800/30 p-8 transition-all hover:border-terminal-green/50 hover:bg-dark-800/50"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex flex-col items-center gap-3">
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-full bg-terminal-green/10 text-3xl"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📷
              </motion.div>
              <p className="font-mono text-sm text-terminal-green">
                Click to open camera & take a selfie
              </p>
              <p className="font-mono text-xs text-gray-500">
                No uploads - captured live for security
              </p>
            </div>

            {/* Decorative corner brackets on hover */}
            <div className="pointer-events-none absolute inset-4 opacity-0 transition-opacity group-hover:opacity-100">
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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [placeholder] = useState(() =>
    WITTY_PLACEHOLDERS[Math.floor(Math.random() * WITTY_PLACEHOLDERS.length)]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate submission - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Here you would typically send:
    // - formData.message (text)
    // - formData.audioBlob (audio file)
    // - formData.selfieDataUrl (base64 image)
    
    console.log('Form submitted:', {
      message: formData.message,
      hasAudio: !!formData.audioBlob,
      audioDuration: formData.audioDuration,
      hasSelfie: !!formData.selfieDataUrl,
    });

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      message: '',
      audioBlob: null,
      audioDuration: 0,
      selfieDataUrl: null,
    });
    setIsSubmitted(false);
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-dark-900 py-20">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,255,65,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,65,0.3) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Gradient orbs */}
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
              <p className="mb-6 font-mono text-sm text-gray-400">
                Your message has been beamed across the digital void.
                <br />
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
              onSubmit={handleSubmit}
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
                  rows={5}
                  className="w-full resize-none rounded-lg border border-terminal-green/20 bg-dark-900/50 p-4 font-mono text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-terminal-green/50 focus:ring-1 focus:ring-terminal-green/30"
                />
                <p className="text-right font-mono text-xs text-gray-500">
                  {formData.message.length} characters
                </p>
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
              />

              {/* Selfie Capture */}
              <SelfieCapture
                onCapture={(dataUrl) =>
                  setFormData({ ...formData, selfieDataUrl: dataUrl })
                }
              />

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting || !formData.message.trim()}
                className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-terminal-green to-neon-cyan py-4 font-mono text-lg font-bold text-dark-900 transition-all disabled:cursor-not-allowed disabled:opacity-50"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Animated background */}
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
                  {isSubmitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        ⚡
                      </motion.span>
                      Transmitting...
                    </>
                  ) : (
                    <>
                      Send Message
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </>
                  )}
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
    </section>
  );
}