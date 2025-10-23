import * as React from "react"
import { motion, PanInfo } from "framer-motion"
import { cn } from "@/lib/utils"

interface Testimonial {
  id: number | string
  name: string
  avatar: string
  description: string
  role: string
}

interface TestimonialCarouselProps
  extends React.HTMLAttributes<HTMLDivElement> {
  testimonials: Testimonial[]
  showArrows?: boolean
  showDots?: boolean
}

const TestimonialCarousel = React.forwardRef<
  HTMLDivElement,
  TestimonialCarouselProps
>(
  (
    { className, testimonials, showArrows = true, showDots = true, ...props },
    ref,
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(0)
    const [exitX, setExitX] = React.useState<number>(0)

    const handleDragEnd = (
      event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo,
    ) => {
      if (Math.abs(info.offset.x) > 100) {
        setExitX(info.offset.x)
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % testimonials.length)
          setExitX(0)
        }, 200)
      }
    }

    const goToNext = () => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }

    const goToPrev = () => {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "h-80 w-full flex items-center justify-center",
          className
        )}
        {...props}
      >
        <div className="relative w-96 h-72">
          {testimonials.map((testimonial, index) => {
            const isCurrentCard = index === currentIndex
            const isPrevCard =
              index === (currentIndex + 1) % testimonials.length
            const isNextCard =
              index === (currentIndex + 2) % testimonials.length

            if (!isCurrentCard && !isPrevCard && !isNextCard) return null

            return (
              <motion.div
                key={testimonial.id}
                className={cn(
                  "absolute w-full h-full rounded-2xl cursor-grab active:cursor-grabbing",
                  "bg-white dark:bg-brand-surface shadow-xl border border-slate-200 dark:border-slate-700",
                )}
                style={{
                  zIndex: isCurrentCard ? 3 : isPrevCard ? 2 : 1,
                }}
                drag={isCurrentCard ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={isCurrentCard ? handleDragEnd : undefined}
                initial={{
                  scale: 0.95,
                  opacity: 0,
                  y: isCurrentCard ? 0 : isPrevCard ? 8 : 16,
                  rotate: isCurrentCard ? 0 : isPrevCard ? -2 : -4,
                }}
                animate={{
                  scale: isCurrentCard ? 1 : 0.95,
                  opacity: isCurrentCard ? 1 : isPrevCard ? 0.6 : 0.3,
                  x: isCurrentCard ? exitX : 0,
                  y: isCurrentCard ? 0 : isPrevCard ? 8 : 16,
                  rotate: isCurrentCard ? exitX / 20 : isPrevCard ? -2 : -4,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                {showArrows && isCurrentCard && (
                  <div className="absolute inset-x-0 top-4 flex justify-between px-6">
                    <button 
                      onClick={goToPrev}
                      className="text-2xl select-none cursor-pointer text-slate-400 hover:text-brand-primary transition-colors"
                    >
                      &larr;
                    </button>
                    <button 
                      onClick={goToNext}
                      className="text-2xl select-none cursor-pointer text-slate-400 hover:text-brand-primary transition-colors"
                    >
                      &rarr;
                    </button>
                  </div>
                )}

                <div className="p-6 flex flex-col items-center gap-3 h-full justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-teal-400 flex items-center justify-center border-4 border-brand-primary/20">
                    <span className="text-3xl">{testimonial.avatar}</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
                      {testimonial.name}
                    </h3>
                    <p className="text-xs text-brand-primary font-medium mb-2">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      "{testimonial.description}"
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
          {showDots && (
            <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-colors",
                    index === currentIndex
                      ? "bg-brand-primary"
                      : "bg-slate-300 dark:bg-slate-600",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  },
)
TestimonialCarousel.displayName = "TestimonialCarousel"

export { TestimonialCarousel, type Testimonial }
