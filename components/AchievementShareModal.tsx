import React, { useRef } from 'react';
import { XIcon } from './icons/AppIcons';
import html2canvas from 'html2canvas';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'fire' | 'target';
  date?: string;
}

interface AchievementShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: Achievement | null;
  userName: string;
}

const AchievementShareModal: React.FC<AchievementShareModalProps> = ({ 
  isOpen, 
  onClose, 
  achievement,
  userName 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !achievement) return null;

  const getIconEmoji = (icon: string) => {
    return icon === 'fire' ? '🔥' : '🎯';
  };

  const captureCardAsImage = async (): Promise<Blob | null> => {
    if (!cardRef.current) return null;
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // Higher quality
        logging: false,
      });
      
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      });
    } catch (error) {
      console.error('Error capturing card:', error);
      return null;
    }
  };

  const shareToWhatsApp = async () => {
    // Generate shareable text with emojis - NEW FORMAT
    const emoji = achievement.icon === 'fire' ? '🔥' : '🎯';
    const text = `I just unlocked the "${achievement.title}" achievement on ReWise AI! 🥳\n\n✅ ${achievement.description}\n\n👽 Join me in mastering any subjects with AI-powered flashcards!\n\n🦉 https://rewiseai.com\n\n#StudySmart #ReWiseAI #Achievement`;
    
    try {
      // Capture the card as image
      const imageBlob = await captureCardAsImage();
      
      if (!imageBlob) {
        throw new Error('Failed to capture image');
      }

      const file = new File([imageBlob], `${achievement.title.replace(/\s+/g, '_')}_Achievement.png`, { type: 'image/png' });
      
      // Try Web Share API (works on mobile with WhatsApp installed)
      if (navigator.share) {
        try {
          // Check if we can share files
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `Achievement Unlocked: ${achievement.title}`,
              text: text,
              files: [file]
            });
            return; // Success! Image + text shared
          }
        } catch (shareError: any) {
          // User cancelled or error occurred
          if (shareError.name !== 'AbortError') {
            console.error('Share failed:', shareError);
          } else {
            return; // User cancelled, don't show error
          }
        }
      }
      
      // Fallback for desktop or if Web Share API not available
      // Download image automatically and open WhatsApp
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${achievement.title.replace(/\s+/g, '_')}_Achievement.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Copy text to clipboard
      await navigator.clipboard.writeText(text);
      
      // Open WhatsApp
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
      
      // Show instructions
      setTimeout(() => {
        alert(`✅ Achievement card downloaded!\n📋 Text copied to clipboard!\n\n📱 WhatsApp is opening...\n\nTo complete sharing:\n1. In WhatsApp, click the attachment (📎) icon\n2. Select "Photos & Videos" or "Document"\n3. Choose the downloaded achievement image\n4. The text is already in the message\n5. Send! 🚀`);
      }, 500);
      
    } catch (error) {
      console.error('Error in shareToWhatsApp:', error);
      // Ultimate fallback - just open WhatsApp with text
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
      alert('⚠️ Please take a screenshot of the golden achievement card and attach it manually in WhatsApp!');
    }
  };

  const shareToInstagram = async () => {
    const emoji = achievement.icon === 'fire' ? '🔥' : '🎯';
    const text = `I just unlocked the "${achievement.title}" achievement on ReWise AI! 🥳\n\n✅ ${achievement.description}\n\n👽 Join me in mastering any subjects with AI-powered flashcards!\n\n🦉 https://rewiseai.com\n\n#StudySmart #ReWiseAI #Achievement`;
    
    try {
      // Capture the card as image
      const imageBlob = await captureCardAsImage();
      
      if (!imageBlob) {
        throw new Error('Failed to capture image');
      }

      const file = new File([imageBlob], `${achievement.title.replace(/\s+/g, '_')}_Achievement.png`, { type: 'image/png' });
      
      // Try Web Share API (works on mobile)
      if (navigator.share) {
        try {
          // Check if we can share files
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `Achievement Unlocked: ${achievement.title}`,
              text: text,
              files: [file]
            });
            return; // Success! Image + text shared
          }
        } catch (shareError: any) {
          // User cancelled or error occurred
          if (shareError.name !== 'AbortError') {
            console.error('Share failed:', shareError);
          } else {
            return; // User cancelled, don't show error
          }
        }
      }
      
      // Fallback for desktop - download image and copy text
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${achievement.title.replace(/\s+/g, '_')}_Achievement.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Copy text to clipboard
      await navigator.clipboard.writeText(text);
      
      // Show instructions
      setTimeout(() => {
        alert(`✅ Achievement card downloaded!\n📋 Text copied to clipboard!\n\n📸 To share on Instagram:\n\n1. Open Instagram app\n2. Tap + to create a Story\n3. Select the downloaded achievement image\n4. Paste the copied text as caption\n5. Add link sticker: rewiseai.com\n6. Share! 🚀\n\n💡 On mobile, you can also select Instagram from the share menu!`);
      }, 500);
      
    } catch (error) {
      console.error('Error in shareToInstagram:', error);
      alert('⚠️ Please take a screenshot of the golden achievement card and share it manually on Instagram!');
    }
  };

  const downloadCard = async () => {
    const imageBlob = await captureCardAsImage();
    
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${achievement.title.replace(/\s+/g, '_')}_Achievement.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('✅ Achievement card downloaded! You can now share it on WhatsApp, Instagram, or any social media!');
    } else {
      alert('❌ Failed to download card. Please take a screenshot instead.');
    }
  };

  const copyLink = () => {
    const emoji = achievement.icon === 'fire' ? '🔥' : '🎯';
    const text = `I just unlocked the "${achievement.title}" achievement on ReWise AI! 🥳\n\n✅ ${achievement.description}\n\n👽 Join me in mastering any subjects with AI-powered flashcards!\n\n🦉 https://rewiseai.com\n\n#StudySmart #ReWiseAI #Achievement`;
    
    navigator.clipboard.writeText(text);
    alert('✅ Achievement text copied! Paste it with your screenshot when sharing on social media!');
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="relative max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <XIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>

        {/* Pokemon-style Achievement Card */}
        <div 
          ref={cardRef}
          className="relative bg-gradient-to-br from-yellow-50 via-white to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-purple-900 rounded-2xl p-5 shadow-2xl border-4 border-yellow-400 dark:border-yellow-600"
          style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #ffffff 50%, #f3e8ff 100%)',
          }}
        >
          {/* Holographic shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent rounded-2xl pointer-events-none"></div>
          
          {/* Card Header */}
          <div className="text-center mb-4 relative z-10">
            <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-3 shadow-lg">
              ACHIEVEMENT UNLOCKED
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">{achievement.title}</h2>
            <p className="text-xs text-slate-600">{achievement.description}</p>
          </div>

          {/* Icon/Image */}
          <div className="flex justify-center mb-4 relative z-10">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 blur-xl opacity-50 animate-pulse"></div>
              
              {/* Icon container */}
              <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-xl">
                <span className="text-5xl">{getIconEmoji(achievement.icon)}</span>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center mb-4 relative z-10">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Achieved by</p>
              <p className="text-base font-bold text-brand-primary">{userName}</p>
              {achievement.date && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {new Date(achievement.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>

          {/* ReWise AI Branding */}
          <div className="text-center relative z-10">
            <div className="inline-block bg-gradient-to-r from-brand-primary to-teal-400 text-white px-4 py-1.5 rounded-full font-bold text-xs shadow-lg">
              <span style={{color: '#ffffff'}}>re</span>wise <span>ai</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">rewiseai.com</p>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-3 border-l-3 border-yellow-400 rounded-tl-lg"></div>
          <div className="absolute top-3 right-3 w-6 h-6 border-t-3 border-r-3 border-yellow-400 rounded-tr-lg"></div>
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-3 border-l-3 border-yellow-400 rounded-bl-lg"></div>
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-3 border-r-3 border-yellow-400 rounded-br-lg"></div>
        </div>

        {/* Share Options */}
        <div className="mt-4 bg-white dark:bg-slate-800 rounded-xl p-3 shadow-xl border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 text-center">
            Share Your Achievement
          </h3>
          
          {/* All 4 options in one row */}
          <div className="grid grid-cols-4 gap-2">
            {/* Download Card */}
            <button
              onClick={downloadCard}
              className="flex flex-col items-center gap-1 p-2 rounded-lg border-2 border-brand-primary hover:bg-brand-primary/10 transition-all hover:scale-105"
            >
              <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="text-[9px] font-semibold text-brand-primary text-center leading-tight">Download<br/>Card</span>
            </button>

            {/* Copy Text */}
            <button
              onClick={copyLink}
              className="flex flex-col items-center gap-1 p-2 rounded-lg border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all hover:scale-105"
            >
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-[9px] font-semibold text-blue-600 text-center leading-tight">Copy<br/>Text</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={shareToWhatsApp}
              className="flex flex-col items-center gap-1 p-2 rounded-lg border-2 border-green-200 dark:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all hover:scale-105"
            >
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.52 3.48A11.8 11.8 0 0012.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.14 1.6 5.95L0 24l6.38-1.66a11.77 11.77 0 005.66 1.45h.01c6.53 0 11.84-5.3 11.84-11.84 0-3.17-1.23-6.16-3.37-8.47zM12.05 21.5h-.01a9.7 9.7 0 01-4.95-1.36l-.36-.21-3.78.98 1.01-3.68-.24-.38a9.68 9.68 0 01-1.5-5.2c0-5.35 4.36-9.71 9.72-9.71a9.7 9.7 0 019.72 9.71c0 5.35-4.37 9.71-9.71 9.71zm5.45-7.16c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.48-.88-.79-1.47-1.76-1.64-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.5-.5-.67-.5h-.57c-.2 0-.52.08-.8.38-.27.3-1.05 1.03-1.05 2.51s1.08 2.9 1.23 3.1c.15.2 2.13 3.25 5.17 4.55.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.71.25-1.32.17-1.45-.07-.13-.27-.2-.57-.35z"/>
              </svg>
              <span className="text-[9px] font-semibold text-green-600 text-center leading-tight">WhatsApp</span>
            </button>

            {/* Instagram */}
            <button
              onClick={shareToInstagram}
              className="flex flex-col items-center gap-1 p-2 rounded-lg border-2 border-pink-200 dark:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all hover:scale-105"
            >
              <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="text-[9px] font-semibold text-pink-600 text-center leading-tight">Instagram</span>
            </button>
          </div>

          <div className="mt-3 p-2 bg-brand-primary/10 rounded-lg border border-brand-primary/20">
            <p className="text-[10px] text-center text-slate-600 dark:text-slate-400">
              💡 Download card, then share on WhatsApp/Instagram with the copied text!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementShareModal;

