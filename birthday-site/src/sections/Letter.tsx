import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const paragraphs = [
  '虾虾：',
  '读到这封信的时候，你已经20岁了。',
  '2006年5月30号到2026年5月30号，整整20年。这20年里的大部分时间我都不在，但没关系，剩下的时间我都想在。',
  '我们在一起的时间不算长，但我已经见过你笑的样子、哭的样子、生气的样子、撒娇的样子。每一面我都喜欢。',
  '我们吵过很多次，但每次都会和好。后来我想明白了——能吵完还不走的人，才是真正想留下来的人。',
  '悉尼离吉隆坡那么远，但你从来没让我觉得你远。',
  '20岁是特别的一年，从定义上来看，你不再是teenager了。但你永远是我的虾虾。',
  '生日快乐。做你喜欢的事，成为你想成为的人。我会一直在。',
]

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

// ─── Envelope ───
function Envelope({ onOpen }: { onOpen: () => void }) {
  const [flapOpen, setFlapOpen] = useState(false)

  const handleClick = () => {
    if (flapOpen) return
    setFlapOpen(true)
    // After flap opens, trigger letter rise
    setTimeout(onOpen, 900)
  }

  return (
    <motion.div
      className="relative cursor-pointer"
      style={{ width: 320, height: 220 }}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      exit={{ opacity: 0, scale: 0.8, y: 40 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Envelope body */}
      <div
        className="absolute inset-0 rounded-lg"
        style={{
          background: 'linear-gradient(135deg, #FFD6E0 0%, #FFBECE 50%, #FFD6E0 100%)',
          boxShadow: '0 8px 32px rgba(255,182,206,0.3), 0 2px 8px rgba(0,0,0,0.06)',
        }}
      />

      {/* Envelope back flaps (visible behind the flap) */}
      <div
        className="absolute left-0 right-0 top-0"
        style={{
          height: '50%',
          background: 'linear-gradient(180deg, #FFC4D4 0%, #FFD6E0 100%)',
          borderRadius: '8px 8px 0 0',
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          opacity: 0.5,
        }}
      />

      {/* Letter peek (visible when flap opens) */}
      <AnimatePresence>
        {flapOpen && (
          <motion.div
            className="absolute left-[10%] right-[10%] rounded-sm"
            style={{
              height: '70%',
              bottom: '15%',
              backgroundColor: '#FFFDF9',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
            initial={{ y: 0 }}
            animate={{ y: -60 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="flex items-center justify-center h-full">
              <p className="font-handwriting text-deep/40 text-sm">一封信...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Envelope flap */}
      <motion.div
        className="absolute left-0 right-0 top-0"
        style={{
          height: '55%',
          transformOrigin: 'top center',
          perspective: 800,
        }}
        animate={flapOpen ? { rotateX: 180 } : { rotateX: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Flap front */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #FFBECE 0%, #FFD6E0 100%)',
            borderRadius: '8px 8px 0 0',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            backfaceVisibility: 'hidden',
          }}
        />
        {/* Flap back */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(0deg, #FFC8D8 0%, #FFE0E8 100%)',
            borderRadius: '8px 8px 0 0',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
          }}
        />
      </motion.div>

      {/* Heart seal */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 z-10 flex items-center justify-center"
        style={{ top: '35%' }}
        animate={flapOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, #ff8aab 0%, #ff6b8a 100%)',
            boxShadow: '0 2px 8px rgba(255,107,138,0.4)',
          }}
        >
          <span className="text-white text-sm">♥</span>
        </div>
      </motion.div>

      {/* Tap hint */}
      {!flapOpen && (
        <motion.p
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-8 left-0 right-0 text-center text-xs font-mono text-deep/30"
        >
          点击打开
        </motion.p>
      )}
    </motion.div>
  )
}

// ─── Letter Paper ───
function LetterPaper() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className="relative rounded-sm px-8 py-10 md:px-14 md:py-14"
        style={{
          backgroundColor: '#FFFDF9',
          backgroundImage: `
            repeating-linear-gradient(
              to bottom,
              transparent,
              transparent calc(2em - 1px),
              rgba(200, 180, 160, 0.18) calc(2em - 1px),
              rgba(200, 180, 160, 0.18) 2em
            )
          `,
          backgroundPosition: '0 3.5em',
          boxShadow: '0 2px 24px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
        }}
      >
        {/* Fold crease — horizontal center */}
        <div
          className="absolute left-4 right-4 pointer-events-none"
          style={{
            top: '50%',
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.04) 20%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0.04) 80%, transparent 100%)',
          }}
        />
        {/* Fold crease shadow — subtle depth */}
        <div
          className="absolute left-4 right-4 pointer-events-none"
          style={{
            top: 'calc(50% + 1px)',
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 20%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.6) 80%, transparent 100%)',
          }}
        />

        {/* Second fold crease — 1/3 position */}
        <div
          className="absolute left-6 right-6 pointer-events-none"
          style={{
            top: '33.3%',
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.025) 25%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.025) 75%, transparent 100%)',
          }}
        />
        <div
          className="absolute left-6 right-6 pointer-events-none"
          style={{
            top: 'calc(33.3% + 1px)',
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 25%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 75%, transparent 100%)',
          }}
        />

        {/* Third fold crease — 2/3 position */}
        <div
          className="absolute left-6 right-6 pointer-events-none"
          style={{
            top: '66.6%',
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.025) 25%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.025) 75%, transparent 100%)',
          }}
        />
        <div
          className="absolute left-6 right-6 pointer-events-none"
          style={{
            top: 'calc(66.6% + 1px)',
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 25%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.4) 75%, transparent 100%)',
          }}
        />

        {/* Left margin line */}
        <div
          className="absolute top-0 bottom-0 left-10 md:left-14 w-px"
          style={{ backgroundColor: 'rgba(220, 120, 120, 0.2)' }}
        />

        {/* Subtle noise overlay */}
        <div
          className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Date in top right */}
        <motion.p
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-right font-handwriting text-sm md:text-base mb-8"
          style={{ color: 'rgba(44,44,44,0.4)' }}
        >
          2026.5.30
        </motion.p>

        {/* Letter body */}
        <div className="relative space-y-[2em]" style={{ lineHeight: '2em' }}>
          {paragraphs.map((text, i) => (
            <motion.p
              key={i}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
                delay: i * 0.08,
              }}
              className={`font-handwriting text-lg md:text-xl ${
                i === 0 ? 'mb-2' : ''
              }`}
              style={{ color: '#2C2C2C' }}
            >
              {text}
            </motion.p>
          ))}
        </div>

        {/* Signature */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
          className="mt-12 text-right"
        >
          <p
            className="font-handwriting text-2xl md:text-3xl"
            style={{ color: '#2C2C2C' }}
          >
            Q
          </p>

          {/* Heartbeat heart */}
          <motion.span
            animate={{ scale: [1, 1.2, 1, 1.15, 1] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: 'easeInOut',
              repeatDelay: 0.8,
            }}
            className="inline-block mt-3 text-blush text-xl"
          >
            ♥
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─── Main ───
export default function Letter() {
  const [opened, setOpened] = useState(false)

  return (
    <section
      className="relative py-20 md:py-28"
      style={{ backgroundColor: '#F5F0EB' }}
    >
      <div className="max-w-2xl mx-auto px-5 md:px-8">
        <AnimatePresence mode="wait">
          {!opened ? (
            <motion.div
              key="envelope"
              className="flex flex-col items-center justify-center min-h-[50vh]"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="font-handwriting text-deep/50 text-lg md:text-xl mb-10"
              >
                有一封信，给你的
              </motion.p>
              <Envelope onOpen={() => setOpened(true)} />
            </motion.div>
          ) : (
            <motion.div key="letter">
              <LetterPaper />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
