import { useState } from 'react'
import { motion } from 'framer-motion'

const cards = [
  '你笑的时候我总是会走神，像窗外忽然起了一阵好风。',
  '和你并排走路的时候，我觉得世界终于是对称的。',
  '你说话的声音让我想到一件事——安静原来是有温度的。',
  '我从前不懂为什么有人写情诗，遇见你之后我觉得那些人写得还不够好。',
  '你偶尔生气的样子像一只猫，可爱胜过凶',
  '我爱你',
  '你本身就是我见过最好的作品。',
  '虾虾这两个字，现在是我打字最快的词。',
]

function FlipCard({ index, text }: { index: number; text: string }) {
  const [flipped, setFlipped] = useState(false)
  const num = String(index + 1).padStart(2, '0')

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.06 }}
      className="w-full"
      style={{ perspective: 1000 }}
    >
      <div
        onClick={() => setFlipped((f) => !f)}
        className="relative w-full aspect-[3/4] cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-300"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #FFD6E0 0%, #FFFFFF 100%)',
          }}
        >
          <span className="font-display text-5xl md:text-6xl font-semibold text-deep/70 select-none">
            {num}
          </span>
        </motion.div>

        {/* Back */}
        <motion.div
          animate={{ rotateY: flipped ? 0 : -180 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 rounded-2xl flex items-center justify-center p-6 md:p-8 shadow-md bg-white"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <p className="font-body text-deep/80 text-base md:text-lg leading-relaxed text-center">
            {text}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Cards() {
  return (
    <section className="relative py-20 md:py-28 bg-warm-white">
      <div className="max-w-5xl mx-auto px-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-14 md:mb-20"
        >
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-deep tracking-tight">
            有些事，只有我知道
          </h2>
          <p className="font-handwriting text-blush text-lg md:text-xl mt-4">
            tap to flip
          </p>
        </motion.div>

        {/* Card grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {cards.map((text, i) => (
            <FlipCard key={i} index={i} text={text} />
          ))}
        </div>
      </div>
    </section>
  )
}
