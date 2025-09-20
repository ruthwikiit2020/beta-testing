import React from 'react';
import { GoogleIcon, StudyIcon, RevisionIcon, ProgressIcon, SunIcon, MoonIcon } from './icons/AppIcons';
import { BackgroundNoiseWrapper } from './ui/background-noise-effect';
import { PricingSectionDemo } from './blocks/pricing-demo';

interface LandingPageProps {
  onGoogleSignIn: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-white dark:bg-brand-surface p-6 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="text-brand-primary mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400">{description}</p>
    </div>
);

const StepCard: React.FC<{ number: string; title: string; description: string; }> = ({ number, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand-primary/10 text-brand-primary rounded-full font-bold text-xl">
            {number}
        </div>
        <div>
            <h3 className="text-xl font-bold mb-1">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </div>
);

// FIX: Mocking framer-motion components to fix type errors by removing the dependency.
// This approach is consistent with other components like LoadingScreen.tsx.
// The animation-specific props are stripped to avoid warnings in the console.
const motion = {
    h1: ({ initial, animate, transition, ...props }: any) => <h1 {...props} />,
    p: ({ initial, animate, transition, ...props }: any) => <p {...props} />,
    div: ({ initial, animate, transition, ...props }: any) => <div {...props} />,
};

const LandingPage: React.FC<LandingPageProps> = ({ onGoogleSignIn, theme, toggleTheme }) => {
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
                    className="text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-colors font-medium"
                  >
                    Features
                  </button>
                  <button 
                    onClick={() => scrollToSection('how-it-works')} 
                    className="text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-colors font-medium"
                  >
                    How It Works
                  </button>
                  <button 
                    onClick={() => scrollToSection('pricing')} 
                    className="text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-colors font-medium"
                  >
                    Pricing
                  </button>
              </div>

              <div className="flex items-center gap-4">
                  <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      {theme === 'dark' ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-slate-800" />}
                  </button>
                  <button onClick={onGoogleSignIn} className="bg-brand-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-teal-500 transition-colors">
                      Get Started
                  </button>
              </div>
          </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 text-center container mx-auto px-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight"
            >
                Transform Your Study Notes <br /> into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-teal-400">Interactive Flashcards</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8"
            >
                Upload any PDF, and let our AI create smart, swipeable flashcards to help you master any subject faster.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex justify-center"
            >
                <button onClick={onGoogleSignIn} className="flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold py-3 px-8 rounded-lg text-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-md hover:shadow-lg transition-shadow">
                    <GoogleIcon className="w-6 h-6" />
                    Sign in with Google
                </button>
            </motion.div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-20 bg-slate-100 dark:bg-brand-surface">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">In three simple steps.</p>
                </div>
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
                    <StepCard number="1" title="Upload Your PDF" description="Easily upload your lecture notes, textbook chapters, or any study material." />
                    <StepCard number="2" title="AI Generates Cards" description="Our smart AI analyzes the content and creates organized flashcard decks by chapter." />
                    <StepCard number="3" title="Start Swiping" description="Study effectively with an intuitive swipe interface. Left to revise, right if you know it." />
                </div>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
             <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">A Smarter Way to Study</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 mt-2">Features designed for effective learning.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <FeatureCard icon={<StudyIcon className="w-10 h-10" />} title="Intuitive Swiping" description="Engage with your material like never before. The simple swipe mechanic makes studying feel less like a chore." />
                    <FeatureCard icon={<RevisionIcon className="w-10 h-10" />} title="AI-Powered Revision" description="Cards you struggle with are saved. Dive deeper with AI explanations and chat with a tutor to clarify doubts." />
                    <FeatureCard icon={<ProgressIcon className="w-10 h-10" />} title="Track Your Progress" description="Visualize your learning with streaks, mastery levels, and weekly reports. Stay motivated and watch your knowledge grow." />
                </div>
            </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing">
            <PricingSectionDemo onFreePlanClick={onGoogleSignIn} />
        </section>
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-brand-dark">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
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
                <li><a href="#features" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm">Features</a></li>
                <li><a href="#how-it-works" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm">How It Works</a></li>
                <li><a href="#pricing" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm">Pricing</a></li>
                <li><a href="#faq" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm">FAQ</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="mailto:support@rewiseai.com" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@rewiseai.com
                </a></li>
                <li><a href="mailto:help@rewiseai.com" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help Center
                </a></li>
                <li><a href="#contact" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Contact Us
                </a></li>
              </ul>
            </div>

            {/* Social Media & Contact */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Connect With Us</h3>
              <div className="space-y-3">
                <a href="https://instagram.com/rewiseai" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z"/>
                  </svg>
                  @rewiseai
                </a>
                <a href="mailto:hello@rewiseai.com" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  hello@rewiseai.com
                </a>
                <a href="https://twitter.com/rewiseai" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-brand-primary transition-colors text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  @rewiseai
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
                <a href="#privacy" className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors">Privacy Policy</a>
                <a href="#terms" className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors">Terms of Service</a>
                <a href="#cookies" className="text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </BackgroundNoiseWrapper>
  );
};

export default LandingPage;