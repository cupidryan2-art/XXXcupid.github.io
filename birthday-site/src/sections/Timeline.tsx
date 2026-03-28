import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Frame {
  date: string
  title: string
  subtitle: string
  type: 'photo' | 'glow'
  photo?: string
}

const frames: Frame[] = [
  {
    date: '2025.8.3',
    title: '第一次遇见',
    subtitle: '八月的某一天，人海里多看了你一眼。',
    type: 'photo',
    photo: '/photos/timeline-1.jpg',
  },
  {
    date: '2025.12.25',
    title: '圣诞节 · 吉隆坡',
    subtitle: '你从悉尼飞来，那是最好的圣诞礼物。',
    type: 'photo',
    photo: '/photos/timeline-2.jpg',
  },
  {
    date: '2026.1.21',
    title: '西湖',
    subtitle: '和你走过断桥，什么传说都不如我们真实。',
    type: 'photo',
    photo: '/photos/timeline-3.jpg',
  },
  {
    date: '2026.1.26',
    title: '在一起',
    subtitle: '从这天起，正式的。',
    type: 'photo',
    photo: '/photos/timeline-4.jpg',
  },
  {
    date: '2026.3.18–3.22',
    title: '新加坡 · 五天四夜',
    subtitle: '第一次一起旅行，吵过也笑过，但每一秒都是我们的。',
    type: 'photo',
    photo: '/photos/timeline-5.jpg',
  },
  {
    date: '2026.5.30',
    title: '今天',
    subtitle: '你20岁了。而我在这里。',
    type: 'glow',
  },
]

function FilmPerforations({ side }: { side: 'top' | 'bottom' }) {
  return (
    <div
      className={`absolute left-0 right-0 flex justify-between px-4 pointer-events-none ${
        side === 'top' ? 'top-2' : 'bottom-2'
      }`}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="w-3 h-2 rounded-[1px] bg-deep/[0.08]" />
      ))}
    </div>
  )
}

function FilmFrame({ frame }: { frame: Frame }) {
  return (
    <div className="film-frame relative flex-shrink-0 w-[75vw] md:w-[50vw] lg:w-[40vw] mx-3 md:mx-6 opacity-0 scale-95">
      <div
        className="relative rounded-sm py-8 px-5 md:px-8 h-full"
        style={{
          background: 'rgba(255,255,255,0.7)',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        }}
      >
        <FilmPerforations side="top" />
        <FilmPerforations side="bottom" />

        {/* Date */}
        <p className="font-handwriting text-blush text-sm md:text-base mb-5 tracking-wide">
          {frame.date}
        </p>

        {/* Image area or glow */}
        <div className="relative w-full aspect-video rounded-sm overflow-hidden mb-5">
          {frame.type === 'photo' ? (
            <img
              src={frame.photo}
              alt={frame.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget
                target.style.display = 'none'
                target.parentElement!.classList.add('bg-deep/[0.03]')
                const span = document.createElement('span')
                span.textContent = 'photo'
                span.className = 'absolute inset-0 flex items-center justify-center text-deep/20 text-sm tracking-widest uppercase'
                target.parentElement!.appendChild(span)
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blush/[0.05]">
              <div className="glow-orb w-32 h-32 md:w-40 md:h-40 rounded-full bg-blush/20 blur-2xl" />
              <div className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full bg-blush/30 blur-xl" />
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display text-2xl md:text-3xl font-semibold text-center mb-2" style={{ color: '#2C2C2C' }}>
          {frame.title}
        </h3>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-center leading-relaxed" style={{ color: 'rgba(0,0,0,0.5)' }}>
          {frame.subtitle}
        </p>
      </div>
    </div>
  )
}

export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const frameEls = track.querySelectorAll<HTMLElement>('.film-frame')
    const totalScroll = track.scrollWidth - window.innerWidth
    const revealed = new Set<number>()

    const revealVisible = () => {
      frameEls.forEach((frame, i) => {
        if (revealed.has(i)) return
        const rect = frame.getBoundingClientRect()
        if (rect.left < window.innerWidth * 0.85) {
          revealed.add(i)
          gsap.to(frame, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
          })
        }
      })
    }

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 1,
          end: () => `+=${totalScroll}`,
          invalidateOnRefresh: true,
          onEnter: () => {
            revealVisible()
          },
          onUpdate: () => {
            revealVisible()
          },
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: '#FAFAF8' }}
    >
      {/* Fixed header */}
      <div className="absolute top-8 md:top-12 left-0 right-0 z-10 text-center">
        <p className="font-handwriting text-blush text-lg md:text-xl tracking-wide">
          我们的时间线
        </p>
      </div>

      {/* Horizontal track */}
      <div className="h-screen flex items-center">
        <div
          ref={trackRef}
          className="flex items-center pl-[10vw] pr-[20vw]"
        >
          {frames.map((frame, i) => (
            <FilmFrame key={i} frame={frame} />
          ))}
        </div>
      </div>
    </section>
  )
}
