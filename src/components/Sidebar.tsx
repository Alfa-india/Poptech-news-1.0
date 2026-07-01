/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { db } from '../lib/db';
import { Tag, Article } from '../types';
import { Mail, Sparkles, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import ArticleCard from './ArticleCard';
import AdSpace from './AdSpace';

interface SidebarProps {
  onArticleClick: (articleId: string) => void;
  activeTag?: string;
  onTagClick?: (tagName: string) => void;
}

export default function Sidebar({ onArticleClick, activeTag, onTagClick }: SidebarProps) {
  const [email, setEmail] = useState('');
  const [subscribedState, setSubscribedState] = useState<'idle' | 'success' | 'already' | 'error'>('idle');

  // Load popular articles sorted by view counts (top 4)
  const popularArticles = db.getArticles()
    .sort((a, b) => b.views - a.views)
    .slice(0, 4);

  // Load tags
  const tags = db.getTags();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setSubscribedState('error');
      return;
    }

    const success = db.subscribeNewsletter(email);
    if (success) {
      setSubscribedState('success');
      setEmail('');
    } else {
      setSubscribedState('already');
    }

    setTimeout(() => {
      setSubscribedState('idle');
    }, 4000);
  };

  return (
    <aside className="flex flex-col gap-8 w-full lg:w-[320px] shrink-0" id="sidebar-container">
      {/* Popular articles widget */}
      <div className="bg-purple-950/15 border border-purple-900/10 rounded-xl p-5" id="sidebar-popular">
        <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-purple-900/30 pb-2.5">
          <TrendingUp className="h-4 w-4 text-brand-purple" />
          <span>Mais Lidas</span>
        </h3>
        
        <div className="flex flex-col gap-1">
          {popularArticles.map(article => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              layout="minimal" 
              onClick={onArticleClick} 
            />
          ))}
        </div>
      </div>

      {/* Google AdSense slot */}
      <AdSpace type="sidebar" />

      {/* Newsletter signup widget */}
      <div className="bg-gradient-to-br from-purple-950/45 to-purple-900/15 border border-purple-800/20 rounded-xl p-6 relative overflow-hidden" id="sidebar-newsletter">
        <div className="absolute -right-6 -bottom-6 text-brand-purple/5">
          <Mail className="h-32 w-32" />
        </div>
        
        <h3 className="font-display text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-blue" />
          <span>Mantenha-se Atualizado</span>
        </h3>
        <p className="text-xs text-gray-300 leading-relaxed mb-4 font-sans font-light">
          Inscreva-se na nossa newsletter semanal **PopTech Insights** e receba as maiores revoluções da tecnologia e entretenimento direto na sua caixa de entrada.
        </p>

        <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5">
          <input 
            type="email" 
            placeholder="Seu melhor e-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-purple-950/60 border border-purple-800/50 rounded-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/30 font-sans"
            required
            id="newsletter-email-input"
          />
          <button 
            type="submit"
            className="w-full bg-brand-purple hover:bg-brand-purple/95 text-black font-semibold text-xs py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            id="newsletter-submit-btn"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Inscrever-se</span>
          </button>
        </form>

        {/* Feedback Messages */}
        {subscribedState === 'success' && (
          <div className="mt-3 flex items-center gap-1.5 bg-green-950/30 border border-green-800/40 text-green-400 text-[11px] p-2 rounded-lg animate-fade-in">
            <CheckCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Inscrição realizada! Boas-vindas à nossa lista.</span>
          </div>
        )}
        {subscribedState === 'already' && (
          <div className="mt-3 flex items-center gap-1.5 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-[11px] p-2 rounded-lg animate-fade-in">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Você já faz parte da nossa newsletter! Obrigado.</span>
          </div>
        )}
        {subscribedState === 'error' && (
          <div className="mt-3 flex items-center gap-1.5 bg-red-950/30 border border-red-800/40 text-red-400 text-[11px] p-2 rounded-lg animate-fade-in">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Por favor, insira um endereço de e-mail válido.</span>
          </div>
        )}
      </div>

      {/* Tags Cloud widget */}
      <div className="bg-purple-950/15 border border-purple-900/10 rounded-xl p-5" id="sidebar-tags">
        <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-purple-900/30 pb-2.5">
          <span>Tags Recomendadas</span>
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => {
            const isSelected = activeTag === tag.name;
            return (
              <button
                key={tag.id}
                onClick={() => onTagClick && onTagClick(tag.name)}
                className={`text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer font-sans ${
                  isSelected 
                    ? 'bg-brand-purple text-black font-bold' 
                    : 'bg-purple-950/50 border border-purple-900/40 text-gray-400 hover:text-white hover:border-brand-blue/40'
                }`}
                id={`tag-btn-${tag.slug}`}
              >
                #{tag.name}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
