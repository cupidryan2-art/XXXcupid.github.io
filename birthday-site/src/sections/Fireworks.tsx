import { useRef, useEffect, useCallback, useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

interface Rocket {
  x: number
  y: number
  vy: number
  targetY: number
  color: string
  trail: { x: number; y: number; alpha: number }[]
}

const COLORS = [
  '#FFD6E0', '#FFB3C6', '#FFDAB9', '#B5EAD7',
  '#C3B1E1', '#A0D2DB', '#F8C8DC', '#FFEEAD',
]

function pickColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null);
  const particlesRef = useRef<Particle[]>([])
  const rocketsRef = useRef<Rocket[]>([])
  const animRef = useRef<number>(0)
  const isVisibleRef = useRef(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const spawnFirework = useCallback((cx: number, cy: number) => {
    const color = pickColor()
    const count = 60 + Math.floor(Math.random() * 40)
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3
      const speed = 1.5 + Math.random() * 3
      particlesRef.current.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 60 + Math.random() * 40,
        color,
        size: 1.5 + Math.random() * 1.5,
      })
    }
  }, [])

  const launchRocket = useCallback((x: number, canvasH: number) => {
    const color = pickColor()
    rocketsRef.current.push({
      x,
      y: canvasH,
      vy: -(8 + Math.random() * 4),
      targetY: canvasH * (0.15 + Math.random() * 0.35),
      color,
      trail: [],
    })
  }, [])

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    setHasInteracted(true)
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    spawnFirework(x, y)
  }, [spawnFirework])

  const handleTouch = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    setHasInteracted(true)
    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top
    spawnFirework(x, y)
  }, [spawnFirework])

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    // Intersection observer to only animate when visible
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting },
      { threshold: 0.2 }
    )
    observer.observe(section)

    // Auto-launch rockets periodically
    let autoTimer: ReturnType<typeof setInterval>
    const startAuto = () => {
      autoTimer = setInterval(() => {
        if (!isVisibleRef.current) return
        const w = canvas.offsetWidth
        launchRocket(w * (0.15 + Math.random() * 0.7), canvas.offsetHeight)
      }, 1200 + Math.random() * 1500)
    }
    startAuto()

    const animate = () => {
      animRef.current = requestAnimationFrame(animate)
      if (!isVisibleRef.current) return

      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      // Update & draw rockets
      const rockets = rocketsRef.current
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.y += r.vy
        r.vy *= 0.98
        r.trail.push({ x: r.x, y: r.y, alpha: 1 })
        if (r.trail.length > 12) r.trail.shift()

        // Draw trail
        for (const t of r.trail) {
          t.alpha *= 0.85
          ctx.beginPath()
          ctx.arc(t.x, t.y, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${t.alpha * 0.5})`
          ctx.fill()
        }

        // Draw head
        ctx.beginPath()
        ctx.arc(r.x, r.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = r.color
        ctx.fill()

        if (r.y <= r.targetY) {
          spawnFirework(r.x, r.y)
          rockets.splice(i, 1)
        }
      }

      // Update & draw particles
      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.03 // gravity
        p.vx *= 0.99
        p.vy *= 0.99
        p.life -= 1 / p.maxLife

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        const { r, g, b } = hexToRgb(p.color)
        const alpha = p.life * 0.8
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.fill()
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(animRef.current)
      clearInterval(autoTimer)
      window.removeEventListener('resize', resize)
      observer.disconnect()
    }
  }, [spawnFirework, launchRocket])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-deep flex items-center justify-center overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onTouchStart={handleTouch}
        className="absolute inset-0 w-full h-full cursor-pointer"
      />
      <div className="relative z-10 text-center pointer-events-none px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p className="font-handwriting text-blush/70 text-lg md:text-xl mb-3">
            点击屏幕放烟花
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-semibold text-warm-white/90 tracking-tight">
            Happy Birthday
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: hasInteracted ? 0 : 0.4 }}
            className="text-warm-white text-sm mt-6 font-mono"
          >
            tap anywhere ✦
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
