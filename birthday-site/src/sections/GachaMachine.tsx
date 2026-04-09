import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const prizes = [
  '兑换券：一杯奶茶',
  '兑换券：一顿饭🍚',
  '你可以让我做一件任何事，无条件答应',
  '今天你最大，公主殿下 👑',
  '我的好运都分你一半',
  '谢谢你来到这个世界，2006年的5月30号',
]

const ballColors = [
  '#FFD6E0', '#FFB3C6', '#FFDAB9', '#B5EAD7', '#C3B1E1', '#A0D2DB',
]

function FloatingBall({ color, index }: { color: string; index: number }) {
  const size = 18 + (index % 3) * 6
  const duration = 3 + (index % 4) * 0.8
  const xRange = -15 + (index * 13) % 30
  const startX = -30 + (index * 25) % 60
  const startY = -20 + (index * 18) % 40

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 35% 35%, ${color}dd, ${color})`,
        boxShadow: `inset -2px -2px 4px rgba(0,0,0,0.1), 1px 1px 3px rgba(0,0,0,0.05)`,
        left: `calc(50% + ${startX}px)`,
        top: `calc(50% + ${startY}px)`,
      }}
      animate={{
        x: [0, xRange, -xRange, 0],
        y: [0, -12, 8, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

export default function GachaMachine() {
  const [remaining, setRemaining] = useState<number[]>(() =>
    Array.from({ length: prizes.length }, (_, i) => i)
  )
  const [currentPrize, setCurrentPrize] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [knobRotation, setKnobRotation] = useState(0)
  const [ballDrop, setBallDrop] = useState(false)
  const [droppedColor, setDroppedColor] = useState(ballColors[0])
  const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const handlePull = useCallback(() => {
    if (isAnimating) return

    let pool = remaining
    if (pool.length === 0) {
      pool = Array.from({ length: prizes.length }, (_, i) => i)
      setRemaining(pool)
    }

    const randIdx = Math.floor(Math.random() * pool.length)
    const prizeIdx = pool[randIdx]
    const newRemaining = pool.filter((_, i) => i !== randIdx)

    setIsAnimating(true)
    setCurrentPrize(null)
    setBallDrop(false)
    setKnobRotation((r) => r + 360)
    setDroppedColor(ballColors[prizeIdx % ballColors.length])

    // Clear any pending timeouts
    timeoutRef.current.forEach(clearTimeout)
    timeoutRef.current = []

    const t1 = setTimeout(() => {
      setBallDrop(true)
    }, 500)

    const t2 = setTimeout(() => {
      setCurrentPrize(prizes[prizeIdx])
      setRemaining(newRemaining)
      setIsAnimating(false)
    }, 1400)

    timeoutRef.current = [t1, t2]
  }, [isAnimating, remaining])

  return (
    <section
      className="relative min-h-screen flex items-center justify-center py-20"
      style={{ background: 'linear-gradient(180deg, #FFF0F3 0%, #FAFAF8 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col items-center px-6"
      >
        {/* Title */}
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-deep tracking-tight mb-2">
          虾虾的扭蛋机
        </h2>
        <p className="font-handwriting text-blush text-lg mb-10">
          试试你的运气
        </p>

        {/* Machine */}
        <div className="relative flex flex-col items-center">
          {/* Glass dome */}
          <div
            className="relative w-48 h-48 md:w-56 md:h-56 rounded-full border-2 border-blush/30 overflow-hidden"
            style={{
              background: 'radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.9), rgba(255,214,224,0.15))',
              boxShadow: 'inset 0 -20px 40px rgba(255,214,224,0.2), 0 4px 20px rgba(0,0,0,0.06)',
            }}
          >
            {/* Floating balls inside */}
            {ballColors.map((color, i) => (
              <FloatingBall key={i} color={color} index={i} />
            ))}
            {/* Glass highlight */}
            <div
              className="absolute top-4 left-8 w-16 h-8 rounded-full opacity-40"
              style={{ background: 'linear-gradient(180deg, white, transparent)' }}
            />
          </div>

          {/* Connector */}
          <div className="w-40 md:w-48 h-3 bg-blush/20 rounded-b-sm" />

          {/* Base */}
          <div
            className="relative w-44 md:w-52 h-28 md:h-32 rounded-b-2xl rounded-t-sm flex items-center justify-center"
            style={{
              background: 'linear-gradient(180deg, #FFD6E0 0%, #FFBECF 100%)',
              boxShadow: '0 6px 20px rgba(255,190,207,0.3)',
            }}
          >
            {/* Label */}
            <span className="font-handwriting text-white/80 text-sm tracking-wider absolute top-3">
              GACHA
            </span>

            {/* Knob button */}
            <motion.button
              onClick={handlePull}
              animate={{ rotate: knobRotation }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute -right-5 md:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white border-2 border-blush/40 shadow-md flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-transform"
              style={{ transformOrigin: 'center' }}
              aria-label="Pull gacha knob"
            >
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-blush" />
            </motion.button>

            {/* Exit slot */}
            <div className="absolute bottom-3 w-10 h-5 md:w-12 md:h-6 rounded-full bg-deep/10" />
          </div>

          {/* Dropped ball animation */}
          <AnimatePresence>
            {ballDrop && (
              <motion.div
                key="ball"
                initial={{ y: -20, opacity: 0, scale: 0.5 }}
                animate={{ y: 20, opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                  mass: 0.8,
                }}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full mt-1"
                style={{
                  background: `radial-gradient(circle at 35% 35%, white, ${droppedColor})`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Prize display */}
        <div className="mt-8 h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentPrize && (
              <motion.div
                key={currentPrize}
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="bg-white rounded-2xl px-6 py-4 shadow-md max-w-xs text-center"
              >
                <p className="text-deep/80 text-base md:text-lg leading-relaxed">
                  {currentPrize}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Remaining count */}
        <p className="mt-4 text-deep/30 text-sm font-handwriting">
          {remaining.length === 0
            ? '全部抽完啦！再点一次重新开始'
            : `还剩 ${remaining.length} 个扭蛋`}
        </p>
      </motion.div>
    </section>
  )
}
