'use client'

import { useEffect, useState } from 'react'
import { getRandomFoodQuote, FOOD_QUOTES } from '@/lib/food-quotes'

type FoodQuote = {
  text: string
  author: string
  context: string | null
}

export function FoodQuoteLoader() {
  const [currentQuote, setCurrentQuote] = useState<FoodQuote>(getRandomFoodQuote())
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    // Rotate quotes every 4 seconds with a smooth fade transition
    const interval = setInterval(() => {
      setIsFading(true)

      // Change quote mid-fade
      setTimeout(() => {
        setCurrentQuote(getRandomFoodQuote())
        setIsFading(false)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-3xl bg-sage/5 border border-sage/20 p-8 md:p-12">
      {/* Decorative quote mark */}
      <div
        className="absolute top-4 left-6 font-display text-8xl md:text-9xl text-sage/10 leading-none select-none -z-10"
        aria-hidden
      >
        "
      </div>

      {/* Quote content */}
      <div
        className={`transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}
      >
        <blockquote className="relative">
          <p className="font-display text-xl md:text-2xl lg:text-3xl font-medium text-forest leading-relaxed">
            {currentQuote.text}
          </p>

          <footer className="mt-6 flex items-center gap-3">
            <div className="h-px w-12 bg-terracotta/50" aria-hidden />
            <cite className="not-italic">
              <span className="text-forest/80 font-medium">{currentQuote.author}</span>
              {currentQuote.context && (
                <>
                  <span className="text-forest/50 mx-2">•</span>
                  <span className="text-forest/60 text-sm">{currentQuote.context}</span>
                </>
              )}
            </cite>
          </footer>
        </blockquote>
      </div>

      {/* Subtle shimmer effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(140, 154, 132, 0.1) 45%, transparent 50%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s infinite'
        }}
      />
    </div>
  )
}

/**
 * A compact version for smaller spaces
 */
export function FoodQuoteLoaderCompact() {
  const [currentQuote, setCurrentQuote] = useState<FoodQuote>(getRandomFoodQuote())
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true)
      setTimeout(() => {
        setCurrentQuote(getRandomFoodQuote())
        setIsFading(false)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative rounded-2xl bg-sage/5 border border-sage/20 p-6">
      <div
        className={`transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}
      >
        <blockquote>
          <p className="font-display text-lg text-forest leading-relaxed">
            {currentQuote.text}
          </p>
          <cite className="not-italic mt-3 block text-forest/60 text-sm">
            — {currentQuote.author}
          </cite>
        </blockquote>
      </div>
    </div>
  )
}
