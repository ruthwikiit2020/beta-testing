import { TestimonialCarousel } from "@/components/ui/testimonial"

const TESTIMONIAL_DATA = [
  {
    id: 1,
    name: "Dedeepya",
    avatar: "📚",
    role: "Class 10th Student",
    description: "ReWise AI makes studying fun! I love the swipe interface and how it turns my boring textbooks into interactive flashcards. My parents are amazed at how much more I'm retaining from my studies."
  },
  {
    id: 2,
    name: "Shalini",
    avatar: "💡",
    role: "BTech 1st Year, Computer Science",
    description: "ReWise AI has completely transformed how I study! The flashcards are so intuitive and the AI explanations help me understand complex concepts easily. My grades have improved significantly since I started using it."
  },
  {
    id: 3,
    name: "Sathwika",
    avatar: "🎯",
    role: "JEE Aspirant",
    description: "As a JEE aspirant, I needed an efficient way to revise physics and chemistry concepts. ReWise AI creates perfect flashcards from my textbooks and helps me retain information much better than traditional methods."
  },
  {
    id: 4,
    name: "Vishnu Saai",
    avatar: "🚀",
    role: "Founder, Elevate Labs",
    description: "ReWise AI is a game-changer for continuous learning. As a founder, I need to constantly upskill across multiple domains. The AI-powered flashcards help me retain critical information efficiently while managing a busy schedule."
  },
  {
    id: 5,
    name: "Shwejan",
    avatar: "💻",
    role: "Software Developer, Infosys",
    description: "I use ReWise AI to stay updated with new technologies and prepare for interviews. The spaced repetition feature ensures I don't forget important concepts. It's like having a personal tutor available 24/7!"
  },
  {
    id: 6,
    name: "Rushi",
    avatar: "📊",
    role: "Data Scientist",
    description: "As a working professional, I need to learn new algorithms and frameworks quickly. ReWise AI helps me create flashcards from technical documentation and research papers. It's become an essential part of my learning routine."
  }
]

export function TestimonialCarouselDemo() {
  return (
    <TestimonialCarousel 
      testimonials={TESTIMONIAL_DATA}
      className="max-w-4xl mx-auto"
    />
  )
}
