import React, { useState } from 'react';
import { GoogleIcon, StudyIcon, RevisionIcon, ProgressIcon, SunIcon, MoonIcon } from './icons/AppIcons';
import { BackgroundNoiseWrapper } from './ui/background-noise-effect';
import { PricingSectionDemo } from './blocks/pricing-demo';
import { TestimonialCarouselDemo } from './blocks/testimonials-demo';
import PrivacyPolicyModal from './PrivacyPolicyModal';

interface LandingPageProps {
  onGoogleSignIn: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}


// FIX: Mocking framer-motion components to fix type errors by removing the dependency.
// This approach is consistent with other components like LoadingScreen.tsx.
// The animation-specific props are stripped to avoid warnings in the console.
const motion = {
    h1: ({ initial, animate, transition, ...props }: any) => <h1 {...props} />,
    p: ({ initial, animate, transition, ...props }: any) => <p {...props} />,
    div: ({ initial, animate, transition, ...props }: any) => <div {...props} />,
};

const LandingPage: React.FC<LandingPageProps> = ({ onGoogleSignIn, theme, toggleTheme }) => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <BackgroundNoiseWrapper 
      variant={theme === 'dark' ? 'dark' : 'light'} 
      className="min-h-screen w-full"
    >
      <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-brand-dark/80 backdrop-blur-sm z-50 border-b border-slate-200 dark:border-slate-800">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                    <span style={{color: '#429E9D'}}>re</span><span className="text-slate-600 dark:text-slate-200">wise</span> <span className="text-slate-600 dark:text-slate-300">ai</span>
              </h1>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-8">
                  <button 
                    onClick={() => scrollToSection('features')} 
                    className="text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-all duration-300 font-medium hover:scale-110"
                  >
                    Features
                  </button>
                  <button 
                    onClick={() => scrollToSection('how-it-works')} 
                    className="text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-all duration-300 font-medium hover:scale-110"
                  >
                    How It Works
                  </button>
                  <button 
                    onClick={() => scrollToSection('pricing')} 
                    className="text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-all duration-300 font-medium hover:scale-110"
                  >
                    Pricing
                  </button>
                  <button 
                    onClick={() => scrollToSection('testimonials')} 
                    className="text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-all duration-300 font-medium hover:scale-110"
                  >
                    Testimonials
                  </button>
              </div>

              <div className="flex items-center gap-4">
                  <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-110">
                      {theme === 'dark' ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-slate-800" />}
                  </button>
                  <button onClick={onGoogleSignIn} className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-500 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      Get Started
                  </button>
              </div>
          </nav>
      </header>

      <main>
        {/* Hero Section - Full Screen */}
        <section className="h-screen flex items-center justify-center text-center container mx-auto px-6 py-20">
            <div className="max-w-5xl mx-auto">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
                >
                    Transform Your Study Notes <br /> into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-teal-400">Interactive Flashcards</span>
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto mb-10"
                >
                    Upload any PDF, and let our AI create smart, swipeable flashcards to help you master any subject faster.
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex justify-center"
                >
                    <button onClick={onGoogleSignIn} className="flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold py-4 px-10 rounded-lg text-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-md hover:shadow-lg transition-shadow">
                        <GoogleIcon className="w-7 h-7" />
                        Sign in with Google
                    </button>
                </motion.div>
            </div>
        </section>

        {/* How it Works Section - Full Screen */}
        <section id="how-it-works" className="h-screen flex items-center justify-center bg-slate-100 dark:bg-brand-surface py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400">In three simple steps.</p>
                </div>
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
                    <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-105">
                        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-brand-primary/10 text-brand-primary rounded-full font-bold text-2xl mb-4 transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white group-hover:shadow-lg">
                            1
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 group-hover:text-brand-primary">Upload Your PDF</h3>
                        <p className="text-base text-slate-500 dark:text-slate-400">Easily upload your lecture notes, textbook chapters, or any study material.</p>
                    </div>
                    <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-105">
                        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-brand-primary/10 text-brand-primary rounded-full font-bold text-2xl mb-4 transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white group-hover:shadow-lg">
                            2
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 group-hover:text-brand-primary">AI Generates Cards</h3>
                        <p className="text-base text-slate-500 dark:text-slate-400">Our smart AI analyzes the content and creates organized flashcard decks by chapter.</p>
                    </div>
                    <div className="flex flex-col items-center group cursor-pointer transition-transform duration-300 hover:scale-105">
                        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-brand-primary/10 text-brand-primary rounded-full font-bold text-2xl mb-4 transition-all duration-300 group-hover:bg-brand-primary group-hover:text-white group-hover:shadow-lg">
                            3
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 group-hover:text-brand-primary">Start Swiping</h3>
                        <p className="text-base text-slate-500 dark:text-slate-400">Study effectively with an intuitive swipe interface. Left to revise, right if you know it.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Features Section - Full Screen */}
        <section id="features" className="h-screen flex items-center justify-center py-20">
             <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">A Smarter Way to Study</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400">Features designed for effective learning.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="bg-white dark:bg-brand-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-brand-primary cursor-pointer group">
                        <div className="text-brand-primary mb-4 flex justify-center transition-transform duration-300 group-hover:scale-110">
                            <StudyIcon className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 group-hover:text-brand-primary">Intuitive Swiping</h3>
                        <p className="text-base text-slate-500 dark:text-slate-400">Engage with your material like never before. The simple swipe mechanic makes studying feel less like a chore.</p>
                    </div>
                    <div className="bg-white dark:bg-brand-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-brand-primary cursor-pointer group">
                        <div className="text-brand-primary mb-4 flex justify-center transition-transform duration-300 group-hover:scale-110">
                            <RevisionIcon className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 group-hover:text-brand-primary">AI-Powered Revision</h3>
                        <p className="text-base text-slate-500 dark:text-slate-400">Cards you struggle with are saved. Dive deeper with AI explanations and chat with a tutor to clarify doubts.</p>
                    </div>
                    <div className="bg-white dark:bg-brand-surface p-6 rounded-xl border border-slate-200 dark:border-slate-700 text-center transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-brand-primary cursor-pointer group">
                        <div className="text-brand-primary mb-4 flex justify-center transition-transform duration-300 group-hover:scale-110">
                            <ProgressIcon className="w-12 h-12" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-3 transition-colors duration-300 group-hover:text-brand-primary">Track Your Progress</h3>
                        <p className="text-base text-slate-500 dark:text-slate-400">Visualize your learning with streaks, mastery levels, and weekly reports. Stay motivated and watch your knowledge grow.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Pricing Section - Full Screen */}
        <section id="pricing" className="h-screen flex items-center justify-center py-20">
            <PricingSectionDemo onFreePlanClick={onGoogleSignIn} />
        </section>

        {/* Testimonials Section - Full Screen */}
        <section id="testimonials" className="h-screen flex items-center justify-center py-20">
            <div className="container mx-auto px-6">
                <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Testimonials</h2>
                    <p className="text-base text-slate-500 dark:text-slate-400">Real feedback from learners across India</p>
                </div>
                <TestimonialCarouselDemo />
            </div>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-brand-dark">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* About Section */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">About ReWise AI</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Transform your study materials into interactive flashcards with AI-powered learning. 
                Master any subject faster with our intuitive swipe-based study system.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-all duration-300 text-sm hover:translate-x-1 inline-block">Features</a></li>
                <li><a href="#how-it-works" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-all duration-300 text-sm hover:translate-x-1 inline-block">How It Works</a></li>
                <li><a href="#pricing" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-all duration-300 text-sm hover:translate-x-1 inline-block">Pricing</a></li>
                <li><a href="#testimonials" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-all duration-300 text-sm hover:translate-x-1 inline-block">Testimonials</a></li>
                <li><a href="#faq" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-all duration-300 text-sm hover:translate-x-1 inline-block">FAQ</a></li>
              </ul>
            </div>

          

            {/* Social Media & Contact */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Connect With Us</h3>
              <div className="space-y-3">
                <a href="https://www.instagram.com/rewise_ai/" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                  </svg>
                  rewise_ai
                </a>
                <a href="mailto:rewiseai@gmail.com" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  rewiseai@gmail.com
                </a>
                <a href="https://wa.me/919182127853" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.52 3.48A11.8 11.8 0 0012.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.14 1.6 5.95L0 24l6.38-1.66a11.77 11.77 0 005.66 1.45h.01c6.53 0 11.84-5.3 11.84-11.84 0-3.17-1.23-6.16-3.37-8.47zM12.05 21.5h-.01a9.7 9.7 0 01-4.95-1.36l-.36-.21-3.78.98 1.01-3.68-.24-.38a9.68 9.68 0 01-1.5-5.2c0-5.35 4.36-9.71 9.72-9.71a9.7 9.7 0 019.72 9.71c0 5.35-4.37 9.71-9.71 9.71zm5.45-7.16c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.48-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.5-.5-.67-.5h-.57c-.2 0-.52.08-.8.38-.27.3-1.05 1.03-1.05 2.51s1.08 2.9 1.23 3.1c.15.2 2.13 3.25 5.17 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.71.25-1.32.17-1.45-.07-.13-.27-.2-.57-.35z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} ReWise AI. All Rights Reserved.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <button onClick={() => setShowPrivacyPolicy(true)} className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors">Privacy Policy</button>
                <a href="#terms" className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors">Terms of Service</a>
                <a href="#cookies" className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />
    </BackgroundNoiseWrapper>
  );
};

export default LandingPage;