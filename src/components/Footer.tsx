/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, Shield, MessageSquare, Twitter, Youtube, Twitch, ArrowUp, FileText } from 'lucide-react';
import AdSpace from './AdSpace';

interface FooterProps {
  onNavigate: (view: 'home' | 'category' | 'admin' | 'article' | 'privacy' | 'terms', activeId?: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-purple-950 text-gray-300 border-t border-purple-900/40 font-sans mt-16" id="main-footer">
      
      {/* Monetization Footer ad space banner */}
      <div className="mx-auto max-w-7xl px-4 py-8 border-b border-purple-900/30">
        <AdSpace type="footer-banner" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Editorial column */}
        <div className="flex flex-col gap-4">
          <div onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer select-none">
            <div className="flex h-8 items-center justify-center rounded-md bg-gradient-to-tr from-brand-purple to-brand-blue px-2.5 font-display text-sm font-black tracking-wider text-black">
              POPTECH
            </div>
            <span className="font-display text-xs font-bold tracking-widest text-white">NEWS</span>
          </div>
          <p className="text-xs text-purple-200/60 leading-relaxed font-light">
            O PopTech News é seu portal definitivo sobre inovação, tecnologia de ponta, inteligência artificial avançada e todo o universo da cultura pop, animes, mangás, HQs e games. Criado para mentes curiosas.
          </p>
          <div className="flex items-center gap-3 text-purple-300 mt-1">
            <a href="https://twitter.com" target="_blank" referrerPolicy="no-referrer" className="p-1.5 rounded-full bg-purple-900/30 hover:bg-brand-purple hover:text-black transition-colors" id="footer-social-twitter">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="https://youtube.com" target="_blank" referrerPolicy="no-referrer" className="p-1.5 rounded-full bg-purple-900/30 hover:bg-brand-purple hover:text-black transition-colors" id="footer-social-youtube">
              <Youtube className="h-4 w-4" />
            </a>
            <a href="https://twitch.tv" target="_blank" referrerPolicy="no-referrer" className="p-1.5 rounded-full bg-purple-900/30 hover:bg-brand-purple hover:text-black transition-colors" id="footer-social-twitch">
              <Twitch className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Categories Fast Links Column */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider border-l-2 border-brand-purple pl-2">
            Categorias
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button onClick={() => onNavigate('category', 'tecnologia')} className="text-left hover:text-brand-purple transition-colors cursor-pointer font-light">Tecnologia</button>
            <button onClick={() => onNavigate('category', 'ia')} className="text-left hover:text-brand-purple transition-colors cursor-pointer font-light">Inteligência Artificial</button>
            <button onClick={() => onNavigate('category', 'games')} className="text-left hover:text-brand-purple transition-colors cursor-pointer font-light">Games</button>
            <button onClick={() => onNavigate('category', 'filmes')} className="text-left hover:text-brand-purple transition-colors cursor-pointer font-light">Filmes</button>
            <button onClick={() => onNavigate('category', 'series')} className="text-left hover:text-brand-purple transition-colors cursor-pointer font-light">Séries</button>
            <button onClick={() => onNavigate('category', 'animes')} className="text-left hover:text-brand-purple transition-colors cursor-pointer font-light">Animes</button>
            <button onClick={() => onNavigate('category', 'mangas')} className="text-left hover:text-brand-purple transition-colors cursor-pointer font-light">Mangás</button>
            <button onClick={() => onNavigate('category', 'hqs')} className="text-left hover:text-brand-purple transition-colors cursor-pointer font-light">HQs</button>
          </div>
        </div>

        {/* Institucional / Legal Column */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider border-l-2 border-brand-purple pl-2">
            Institucional
          </h4>
          <div className="flex flex-col gap-2 text-xs">
            <button onClick={() => onNavigate('privacy')} className="flex items-center gap-1.5 text-left hover:text-brand-purple transition-colors cursor-pointer font-light" id="footer-privacy-btn">
              <Shield className="h-3.5 w-3.5 text-brand-blue" />
              <span>Política de Privacidade</span>
            </button>
            <button onClick={() => onNavigate('terms')} className="flex items-center gap-1.5 text-left hover:text-brand-purple transition-colors cursor-pointer font-light" id="footer-terms-btn">
              <FileText className="h-3.5 w-3.5 text-brand-blue" />
              <span>Termos de Uso</span>
            </button>
            <span className="flex items-center gap-1.5 text-purple-300/80 font-light">
              <Mail className="h-3.5 w-3.5 text-brand-blue" />
              <span>contato@poptechnews.com</span>
            </span>
            <span className="text-[10px] text-purple-400/50 leading-relaxed font-light">
              Anunciar no Portal:<br />
              <span className="text-brand-purple font-mono">comercial@poptechnews.com</span>
            </span>
          </div>
        </div>

        {/* AdSense compliance info disclaimer column */}
        <div className="flex flex-col gap-3">
          <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider border-l-2 border-brand-purple pl-2">
            Monetização e Transparência
          </h4>
          <p className="text-xs text-purple-200/50 leading-relaxed font-light">
            Este site foi desenvolvido seguindo as diretrizes e boas práticas do programa <strong>Google AdSense</strong>. Respeitamos a experiência de leitura do usuário, otimizando os espaços publicitários com rotulagem explícita e carregamento assíncrono não invasivo.
          </p>
        </div>

      </div>

      {/* Copyright area with Back to Top */}
      <div className="border-t border-purple-900/30 bg-purple-950/40 text-xs py-6 text-center text-purple-300/60 font-sans" id="footer-copyright-row">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>
            © 2026 PopTech News. Desenvolvido para máxima performance e acessibilidade de acordo com as diretrizes do WCAG.
          </span>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-1 text-[11px] font-semibold text-brand-blue hover:text-brand-purple transition-colors uppercase tracking-wider cursor-pointer font-sans"
            id="back-to-top-btn"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
