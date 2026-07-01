/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Cookie, X, ExternalLink } from 'lucide-react';

interface CookieConsentProps {
  onNavigate: (view: 'home' | 'category' | 'admin' | 'article' | 'privacy' | 'terms', activeId?: string) => void;
  isDarkMode: boolean;
}

export default function CookieConsent({ onNavigate, isDarkMode }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/declined cookies
    const consent = localStorage.getItem('poptech_cookie_consent');
    if (!consent) {
      // Show banner after 1.5s delay for natural entrance
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('poptech_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('poptech_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 150 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 p-5 rounded-2xl shadow-2xl border backdrop-blur-xl font-sans transition-colors duration-300"
          style={{
            backgroundColor: isDarkMode ? 'rgba(15, 6, 32, 0.95)' : 'rgba(255, 255, 255, 0.98)',
            borderColor: isDarkMode ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.15)',
            boxShadow: isDarkMode 
              ? '0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 20px 0 rgba(168, 85, 247, 0.1)' 
              : '0 10px 30px -10px rgba(109, 40, 217, 0.15)',
          }}
          id="cookie-consent-container"
        >
          {/* Header section with icon and dismiss button */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-brand-purple">
                <Cookie className="h-5 w-5" />
              </div>
              <h4 className={`font-display text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} tracking-wide uppercase`}>
                Cookies e Privacidade
              </h4>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className={`p-1 rounded-lg hover:bg-purple-500/10 transition-colors cursor-pointer ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
              title="Fechar aviso temporariamente"
              id="close-cookie-banner-btn"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Description */}
          <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Nós utilizamos cookies e tecnologias semelhantes para melhorar sua experiência de leitura, 
            analisar o tráfego do portal e personalizar anúncios em parceria com o <strong>Google AdSense</strong>. 
            Ao continuar navegando, você concorda com a nossa{' '}
            <button
              onClick={() => {
                onNavigate('privacy');
                setIsVisible(false);
              }}
              className="text-brand-blue font-semibold hover:underline inline-flex items-center gap-0.5 cursor-pointer"
            >
              Política de Privacidade <ExternalLink className="h-2.5 w-2.5" />
            </button>.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={handleDecline}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg hover:underline transition-all cursor-pointer ${
                isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-800'
              }`}
              id="decline-cookies-btn"
            >
              Recusar
            </button>
            <button
              onClick={handleAccept}
              className="flex items-center gap-1.5 bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple/90 hover:to-brand-blue/90 text-black px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              id="accept-cookies-btn"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Aceitar tudo</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
