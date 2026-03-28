import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Opening from './sections/Opening'
import Timeline from './sections/Timeline'
import Cards from './sections/Cards'
import GachaMachine from './sections/GachaMachine'
import Letter from './sections/Letter'
import Dashboard from './sections/Dashboard'
import Fireworks from './sections/Fireworks'
import Starfield from './sections/Starfield'

// ─── Loading Screen ───
function LoadingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    // Wait for fonts to load
    document.fonts.ready.then(() => {
      // Small extra delay for smoothness
      setTimeout(onDone, 600)
    })
  }, [onDone])

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-0 z-50 bg-deep flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="w-10 h-10 rounded-full bg-blush/40 mb-6"
      />
      <p className="text-warm-white/40 text-sm font-mono tracking-widest">
        Loading...
      </p>
    </motion.div>
  )
}

// ─── Scroll Progress Bar ───
function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed right-2 top-0 bottom-0 w-[2px] z-40 pointer-events-none">
      <div className="w-full h-full bg-deep/[0.06]" />
      <motion.div
        className="absolute top-0 left-0 w-full bg-blush/60 origin-top"
        style={{ height: `${progress * 100}%` }}
      />
    </div>
  )
}

// ─── Music Player ───
function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
    setPlaying(!playing)
  }, [playing])

  return (
    <>
      <audio ref={audioRef} src="/music/bgm.mp3" loop preload="none" />
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full bg-white/80 border border-blush/30 shadow-md flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform"
        aria-label="Toggle music"
      >
        <motion.span
          animate={playing ? { rotate: 360 } : { rotate: 0 }}
          transition={playing ? { duration: 3, repeat: Infinity, ease: 'linear' } : {}}
          className="text-base"
        >
          {playing ? '♫' : '♪'}
        </motion.span>
      </button>
    </>
  )
}

// ─── Light-to-Dark Transition ───
function LightToDarkTransition() {
  return (
    <div
      className="w-full h-[50vh] pointer-events-none"
      style={{
        background: 'linear-gradient(to bottom, #FAFAF8, #0a0a0f)',
      }}
    />
  )
}

// ─── App ───
export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <AnimatePresence>
        {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      </AnimatePresence>

      {loaded && (
        <>
          <ScrollProgress />
          <MusicPlayer />
          <main className="w-full">
            <Opening />
            <Timeline />
            <Cards />
            <GachaMachine />
            <Letter />
            <Dashboard />
            <LightToDarkTransition />
            <Fireworks />
            <Starfield />
          </main>
        </>
      )}
    </>
  )
}
