import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ReactElement } from 'react'

const AnimatedLoadingMessage = (): ReactElement => {
  const text = 'Generating'
  const [showDots, setShowDots] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        setShowDots(true)
      },
      text.length * 100 + 400
    ) // delay after character animation finishes
    return () => clearTimeout(timeout)
  }, [])

  const textVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05
      }
    }
  } as const

  const charVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 200
      }
    }
  } as const

  const dotVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        repeat: Infinity,
        repeatType: 'mirror',
        duration: 0.5
      }
    }
  } as const

  return (
    <motion.div
      style={{ display: 'flex', alignItems: 'baseline' }}
      variants={textVariants}
      initial="hidden"
      animate="visible"
    >
      {text.split('').map((char, index) => (
        <motion.span key={index} variants={charVariants}>
          {char}
        </motion.span>
      ))}
      {showDots && (
        <motion.div style={{ display: 'flex', marginLeft: '0.5rem' }}>
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              style={{
                width: '0.3rem',
                height: '0.3rem',
                backgroundColor: '#333',
                borderRadius: '50%',
                margin: '0 0.2rem'
              }}
              variants={dotVariants}
              initial="hidden"
              animate="visible"
              transition={{
                delay: i * 0.2,
                ...dotVariants.visible.transition
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export default AnimatedLoadingMessage
