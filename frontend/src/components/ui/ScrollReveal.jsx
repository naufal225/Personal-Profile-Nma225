import { useEffect, useRef, useState } from 'react'

export default function ScrollReveal({
  children,
  direction = 'up',
  duration = 700,
  delay = 0,
  distance = '2rem',
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once animated, stop observing
          if (ref.current) {
            observer.unobserve(ref.current)
          }
        }
      },
      {
        threshold: 0.1, // trigger when 10% visible
        rootMargin: '0px 0px -50px 0px', // trigger slightly before entering viewport
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  const getDirectionStyle = () => {
    if (isVisible) return { transform: 'none', opacity: 1 }

    switch (direction) {
      case 'up':
        return { transform: `translateY(${distance})`, opacity: 0 }
      case 'down':
        return { transform: `translateY(-${distance})`, opacity: 0 }
      case 'left':
        return { transform: `translateX(${distance})`, opacity: 0 }
      case 'right':
        return { transform: `translateX(-${distance})`, opacity: 0 }
      default:
        return { transform: 'none', opacity: 0 }
    }
  }

  const style = {
    ...getDirectionStyle(),
    transitionProperty: 'transform, opacity',
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: 'cubic-bezier(0.21, 1.02, 0.43, 1.01)',
  }

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  )
}
