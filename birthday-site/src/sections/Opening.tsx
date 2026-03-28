import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function Opening() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, -60])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#FAFAF8' }}
    >
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="text-center px-6 flex flex-col items-center"
      >
        {/* 虾虾 — 逐字出现 */}
        <div className="flex justify-center gap-1 mb-4">
          {'虾虾'.split('').map((char, i) => (
            <motion.span
              key={i}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.5 + i * 0.3,
              }}
              className="font-display text-6xl md:text-8xl font-semibold tracking-tight text-deep inline-block"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* 生日快乐 */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 0.9,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 1.6,
          }}
          className="font-display text-3xl md:text-5xl font-medium tracking-wide text-deep/80"
        >
          生日快乐
        </motion.p>

        {/* 手写体小字 */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 1,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 2.9,
          }}
          className="font-handwriting text-xl md:text-2xl text-blush mt-8"
        >
          你的第20年，我不会缺席。
        </motion.p>

        {/* 向下箭头 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 4 }}
          className="mt-16 animate-float"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-deep/30"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
