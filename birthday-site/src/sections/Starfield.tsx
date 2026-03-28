import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Stars background (CSS-based) ───
function Stars({ count = 70 }: { count?: number }) {
  const [stars] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 1.5,
      duration: 20 + Math.random() * 40,
      delay: Math.random() * -30,
      opacity: 0.2 + Math.random() * 0.5,
      driftX: (Math.random() - 0.5) * 60,
      driftY: (Math.random() - 0.5) * 60,
    }))
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.x}%`,
            top: `${s.y}%`,
            opacity: s.opacity,
          }}
          animate={{
            x: [0, s.driftX, -s.driftX * 0.5, 0],
            y: [0, s.driftY, -s.driftY * 0.5, 0],
            opacity: [s.opacity, s.opacity * 1.5, s.opacity * 0.6, s.opacity],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: s.delay,
          }}
        />
      ))}
    </div>
  )
}

// ─── Shooting star ───
function ShootingStar({ onDone }: { onDone: () => void }) {
  const startX = 60 + Math.random() * 35
  const startY = 5 + Math.random() * 20
  const length = 80 + Math.random() * 60

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
        width: length,
        height: 1.5,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.6), transparent)',
        borderRadius: 1,
        transformOrigin: 'left center',
        rotate: '210deg',
      }}
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: [0, 0.8, 0], scaleX: [0, 1, 1], x: -length * 1.2, y: length * 0.7 }}
      transition={{ duration: 0.8 + Math.random() * 0.4, ease: 'easeOut' }}
      onAnimationComplete={onDone}
    />
  )
}

function ShootingStars() {
  const [meteors, setMeteors] = useState<number[]>([])
  const nextId = useRef(0)

  useEffect(() => {
    const spawn = () => {
      setMeteors((prev) => [...prev, nextId.current++])
      const delay = 3000 + Math.random() * 5000
      const timer = setTimeout(spawn, delay)
      return timer
    }
    const timer = setTimeout(spawn, 2000)
    return () => clearTimeout(timer)
  }, [])

  const remove = useCallback((id: number) => {
    setMeteors((prev) => prev.filter((m) => m !== id))
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((id) => (
        <ShootingStar key={id} onDone={() => remove(id)} />
      ))}
    </div>
  )
}

// ─── Main component ───
type Phase = 'input' | 'shooting' | 'final'

export default function Starfield() {
  const [phase, setPhase] = useState<Phase>('input')
  const [wish, setWish] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const submitWish = () => {
    if (!wish.trim()) return
    setPhase('shooting')
    setTimeout(() => setPhase('final'), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submitWish()
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-deep overflow-hidden">
      <Stars />
      <ShootingStars />

      <div className="relative z-10 w-full max-w-md mx-auto px-8 text-center">
        <AnimatePresence mode="wait">
          {phase === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center"
            >
              <p className="font-handwriting text-warm-white text-2xl md:text-3xl mb-10">
                许一个生日愿望吧
              </p>
              <div className="relative w-full">
                <input
                  ref={inputRef}
                  type="text"
                  value={wish}
                  onChange={(e) => setWish(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="在这里写下你的愿望..."
                  className="w-full bg-transparent text-warm-white text-center text-lg pb-3 border-b border-warm-white/20 outline-none placeholder:text-warm-white/20 focus:border-warm-white/40 transition-colors"
                />
                {wish.trim() && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={submitWish}
                    className="absolute right-0 top-0 text-xl cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                  >
                    ✨
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {phase === 'shooting' && (
            <motion.div
              key="shooting"
              initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 0.3,
                x: 300,
                y: -400,
              }}
              transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-handwriting text-warm-white text-xl"
            >
              {wish}
            </motion.div>
          )}

          {phase === 'final' && (
            <motion.div
              key="final"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
                className="font-display text-blush text-xl md:text-2xl leading-relaxed tracking-wide"
              >
                我不知道你许了什么，
                <br />
                但我会努力让它成真。
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 1.5 }}
                className="text-warm-white/30 text-sm mt-8 tracking-wide"
              >
                —— 永远爱你的Q · 2026.5.30
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
