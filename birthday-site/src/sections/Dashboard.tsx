import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ─── Panel wrapper (light theme) ───
function Panel({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={`relative rounded-xl p-6 md:p-8 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.7)',
        border: '1px solid rgba(255,214,224,0.3)',
        boxShadow: '0 2px 20px rgba(255,214,224,0.08)',
      }}
    >
      {children}
    </motion.div>
  )
}

// ─── Flip digit ───
function FlipDigit({ value }: { value: string }) {
  return (
    <span className="inline-block relative overflow-hidden w-[1ch]">
      <motion.span
        key={value}
        initial={{ y: '-100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="inline-block"
      >
        {value}
      </motion.span>
    </span>
  )
}

function FlipNumber({ value, pad = 2 }: { value: number; pad?: number }) {
  const str = String(value).padStart(pad, '0')
  return (
    <span className="inline-flex">
      {str.split('').map((d, i) => (
        <FlipDigit key={`${i}-${d}`} value={d} />
      ))}
    </span>
  )
}

// ─── Panel 1: Together Timer ───
function TogetherTimer() {
  const START = new Date('2026-01-26T00:00:00+08:00').getTime()
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = Math.max(0, now - START)
  const secs = Math.floor(diff / 1000)
  const days = Math.floor(secs / 86400)
  const hours = Math.floor((secs % 86400) / 3600)
  const mins = Math.floor((secs % 3600) / 60)
  const s = secs % 60

  return (
    <Panel className="md:col-span-2" delay={0}>
      <p className="text-deep/40 text-xs tracking-[0.2em] uppercase mb-4 font-mono">
        在一起
      </p>
      <div className="font-mono text-deep text-3xl md:text-5xl tracking-tight flex items-baseline gap-1 flex-wrap">
        <FlipNumber value={days} pad={3} />
        <span className="text-deep/30 text-lg md:text-2xl mx-1">天</span>
        <FlipNumber value={hours} />
        <span className="text-deep/30 text-lg md:text-2xl mx-1">时</span>
        <FlipNumber value={mins} />
        <span className="text-deep/30 text-lg md:text-2xl mx-1">分</span>
        <FlipNumber value={s} />
        <span className="text-deep/30 text-lg md:text-2xl mx-1">秒</span>
      </div>
      <p className="text-deep/20 text-xs mt-3 font-mono">
        since 2026.01.26
      </p>
    </Panel>
  )
}

// ─── Panel 2: Distance Arc ───
function DistanceArc() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <Panel delay={0.1}>
      <p className="text-deep/40 text-xs tracking-[0.2em] uppercase mb-4 font-mono">
        跨越的距离
      </p>
      <p className="font-mono text-deep text-3xl md:text-4xl tracking-tight mb-6">
        6,288 <span className="text-deep/30 text-lg">KM</span>
      </p>
      <svg
        ref={ref}
        viewBox="0 0 200 80"
        className="w-full h-auto"
        fill="none"
      >
        <motion.path
          d="M 20 60 Q 100 -10 180 60"
          stroke="rgba(255,214,224,0.6)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        {inView && (
          <motion.circle
            r="3"
            fill="#FFD6E0"
            filter="url(#glow-light)"
            initial={{ offsetDistance: '0%' }}
            animate={{ offsetDistance: '100%' }}
            style={{
              offsetPath: 'path("M 20 60 Q 100 -10 180 60")',
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
          />
        )}
        <defs>
          <filter id="glow-light" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx="20" cy="60" r="3" fill="#FFD6E0" />
        <circle cx="180" cy="60" r="3" fill="#FFD6E0" />
        <text x="20" y="75" textAnchor="middle" fill="rgba(10,10,15,0.35)" fontSize="9" fontFamily="monospace">KUL</text>
        <text x="180" y="75" textAnchor="middle" fill="rgba(10,10,15,0.35)" fontSize="9" fontFamily="monospace">SYD</text>
      </svg>
    </Panel>
  )
}

// ─── Panel 3: Dual Timezone Clocks ───
function getTimeInTZ(offsetHours: number) {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const target = new Date(utc + offsetHours * 3600000)
  return {
    h: target.getHours(),
    m: target.getMinutes(),
    s: target.getSeconds(),
  }
}

function DigitalClock({ label, offset }: { label: string; offset: number }) {
  const [time, setTime] = useState(getTimeInTZ(offset))

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeInTZ(offset)), 1000)
    return () => clearInterval(id)
  }, [offset])

  const fmt = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex flex-col items-center">
      <p className="text-deep/40 text-xs tracking-[0.2em] uppercase font-mono mb-2">
        {label}
      </p>
      <p className="font-mono text-deep text-2xl md:text-3xl tracking-tight">
        {fmt(time.h)}
        <motion.span
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          :
        </motion.span>
        {fmt(time.m)}
        <span className="text-deep/30 text-sm ml-1">{fmt(time.s)}</span>
      </p>
    </div>
  )
}

function DualClocks() {
  return (
    <Panel delay={0.15}>
      <p className="text-deep/40 text-xs tracking-[0.2em] uppercase mb-5 font-mono">
        两个时区
      </p>
      <div className="flex items-center justify-between gap-4">
        <DigitalClock label="KUL" offset={8} />
        <div className="flex flex-col items-center gap-1">
          <div className="border-t border-dashed border-deep/10 w-12" />
          <span className="text-deep/25 text-xs font-mono">+2h</span>
          <div className="border-t border-dashed border-deep/10 w-12" />
        </div>
        <DigitalClock label="SYD" offset={10} />
      </div>
    </Panel>
  )
}

// ─── Panel 4: Age Counter ───
function AgeCounter() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <Panel delay={0.2}>
      <p className="text-deep/40 text-xs tracking-[0.2em] uppercase mb-4 font-mono">
        2006 → 2026
      </p>
      <div ref={ref} className="flex items-center justify-center">
        <motion.span
          className="font-mono text-7xl md:text-8xl font-bold text-deep/90"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          {inView && <CountUp to={20} duration={1.5} />}
        </motion.span>
      </div>
      <p className="text-deep/25 text-sm mt-3 text-center font-mono">
        你在这个世界上的第 20 年
      </p>
    </Panel>
  )
}

function CountUp({ to, duration }: { to: number; duration: number }) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / (duration * 1000), 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(eased * to))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [to, duration])

  return <>{val}</>
}

// ─── Panel 5: Goodnights ───
function Goodnights() {
  return (
    <Panel delay={0.25}>
      <p className="text-deep/40 text-xs tracking-[0.2em] uppercase mb-4 font-mono">
        说过的晚安
      </p>
      <div className="flex items-center gap-4">
        <p className="font-mono text-deep text-3xl md:text-4xl tracking-tight">
          ≈ 124 <span className="text-deep/30 text-lg">次</span>
        </p>
        <motion.span
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="text-2xl"
        >
          🌙
        </motion.span>
      </div>
      <p className="text-deep/20 text-xs mt-2 font-mono">
        每一句都是认真的
      </p>
    </Panel>
  )
}

// ─── Main Dashboard ───
export default function Dashboard() {
  return (
    <section className="relative py-20 md:py-28" style={{ backgroundColor: '#FAFAF8' }}>
      <div className="max-w-4xl mx-auto px-5 md:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="font-mono text-deep/30 text-xs tracking-[0.3em] uppercase">
            us in numbers
          </p>
          <div className="h-2" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          <TogetherTimer />
          <DistanceArc />
          <DualClocks />
          <AgeCounter />
          <Goodnights />
        </div>
      </div>
    </section>
  )
}
