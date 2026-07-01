/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Article, PortalComment } from '../types';
import { Clock, Eye, Calendar, User, Share2, Twitter, Facebook, MessageSquare, Send, Sparkles, Code, CheckCircle, ArrowLeft } from 'lucide-react';
import ArticleCard from './ArticleCard';
import Sidebar from './Sidebar';
import AdSpace from './AdSpace';

interface ArticleViewProps {
  articleId: string;
  onNavigateHome: () => void;
  onArticleClick: (articleId: string) => void;
  onCategoryClick: (categoryId: string) => void;
}

export default function ArticleView({ articleId, onNavigateHome, onArticleClick, onCategoryClick }: ArticleViewProps) {
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [showSeoSandbox, setShowSeoSandbox] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const article = db.getArticleById(articleId);

  // Increment views only once on component load
  useEffect(() => {
    if (article) {
      db.incrementViews(article.id);
    }
    // Scroll to top
    window.scrollTo({ top: 0 });
  }, [articleId]);

  if (!article) {
    return (
      <div className="text-center py-20 text-white font-sans">
        <p>Artigo não encontrado.</p>
        <button onClick={onNavigateHome} className="mt-4 text-brand-purple hover:underline">Voltar para Home</button>
      </div>
    );
  }

  const category = db.getCategories().find(c => c.id === article.categoryId);
  const comments = db.getComments(article.id);
  
  // Find related articles in same category (up to 3, excluding the current one)
  const relatedArticles = db.getArticles()
    .filter(a => a.categoryId === article.categoryId && a.id !== article.id)
    .slice(0, 3);

  const formattedDate = new Date(article.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    db.createComment(article.id, commentName, commentText);
    setCommentName('');
    setCommentText('');
    setCommentSuccess(true);
    
    setTimeout(() => {
      setCommentSuccess(false);
    }, 4000);
  };

  const handleShareCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // SEO Calculation
  const seoTitle = `${article.title} - PopTech News`;
  const seoDescription = article.summary;
  const seoUrl = `https://poptechnews.com/artigo/${article.id}`;

  // Content paragraph parser to inject AdSense inline
  const renderParagraphsWithAds = () => {
    const paragraphs = article.content.split('\n\n');
    return paragraphs.map((para, idx) => {
      const isHeader = para.startsWith('###');
      const isQuote = para.startsWith('>');
      const isList = para.startsWith('1.') || para.startsWith('*');

      let renderedElement = <p className="leading-relaxed font-sans text-gray-300 font-light mb-5" key={idx}>{para}</p>;

      if (isHeader) {
        renderedElement = <h3 className="font-display text-xl font-bold text-white tracking-wide mt-8 mb-4 uppercase" key={idx}>{para.replace('###', '').trim()}</h3>;
      } else if (isQuote) {
        renderedElement = (
          <blockquote className="border-l-4 border-brand-purple bg-purple-950/20 px-5 py-4 my-6 text-gray-300 font-sans italic rounded-r-lg font-light leading-relaxed" key={idx}>
            {para.replace('>', '').trim()}
          </blockquote>
        );
      } else if (isList) {
        const listItems = para.split('\n').map((li, liIdx) => {
          const text = li.replace(/^[0-9*.]+\s*/, '');
          return <li className="mb-2 list-disc ml-5 text-gray-300 text-sm font-light leading-relaxed" key={liIdx}>{text}</li>;
        });
        renderedElement = <ul className="my-5 flex flex-col gap-1" key={idx}>{listItems}</ul>;
      }

      // Inject an AdSense "inline" unit between paragraphs (e.g. after the second paragraph)
      if (idx === 2) {
        return (
          <React.Fragment key={idx}>
            {renderedElement}
            <AdSpace type="inline" className="my-8" />
          </React.Fragment>
        );
      }

      return renderedElement;
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans" id={`article-view-${article.id}`}>
      
      {/* Breadcrumb Row */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-6 font-mono">
        <button onClick={onNavigateHome} className="hover:text-brand-purple cursor-pointer">HOME</button>
        <span>/</span>
        {category && (
          <button onClick={() => onCategoryClick(category.id)} className="hover:text-brand-purple uppercase cursor-pointer">
            {category.name}
          </button>
        )}
        <span>/</span>
        <span className="text-brand-purple truncate max-w-[200px] sm:max-w-[400px] font-semibold">{article.title}</span>
      </div>

      {/* SEO Simulation Sandbox */}
      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => setShowSeoSandbox(!showSeoSandbox)}
          className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-purple-900/20 hover:bg-purple-900/50 border border-purple-800/40 text-purple-300 py-1 px-2.5 rounded-lg transition-colors cursor-pointer"
          id="article-seo-toggle"
        >
          <Code className="h-3 w-3 text-brand-blue" />
          <span>Ver SEO do Artigo</span>
        </button>
      </div>

      {showSeoSandbox && (
        <div className="bg-purple-950/40 border border-purple-800/30 rounded-xl p-5 mb-8 animate-fade-in font-mono text-xs text-purple-200" id="article-seo-panel">
          <h4 className="font-display text-xs font-bold uppercase tracking-wider text-brand-blue mb-3 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>SEO Engine Simulation (Tags do Artigo)</span>
          </h4>
          <div className="space-y-1.5 bg-black/40 p-3 rounded-lg overflow-x-auto text-[11px] leading-relaxed">
            <div><span className="text-purple-400">&lt;title&gt;</span>{seoTitle}<span className="text-purple-400">&lt;/title&gt;</span></div>
            <div><span className="text-purple-400">&lt;meta name="description" content=</span>"{seoDescription}"<span className="text-purple-400"> /&gt;</span></div>
            <div><span className="text-purple-400">&lt;link rel="canonical" href=</span>"{seoUrl}"<span className="text-purple-400"> /&gt;</span></div>
            <div><span className="text-purple-400">&lt;meta property="og:title" content=</span>"{seoTitle}"<span className="text-purple-400"> /&gt;</span></div>
            <div><span className="text-purple-400">&lt;meta property="og:type" content=</span>"article"<span className="text-purple-400"> /&gt;</span></div>
            <div><span className="text-purple-400">&lt;meta property="og:image" content=</span>"{article.image}"<span className="text-purple-400"> /&gt;</span></div>
            <div><span className="text-purple-400">&lt;meta property="og:description" content=</span>"{seoDescription}"<span className="text-purple-400"> /&gt;</span></div>
            <div><span className="text-purple-400">&lt;meta name="twitter:card" content=</span>"summary_large_image"<span className="text-purple-400"> /&gt;</span></div>
          </div>
          <span className="text-[10px] text-purple-400/60 mt-2 block leading-normal font-sans">
            🚀 URL Amigável ativa: <span className="text-brand-purple font-mono">/artigo/{article.id}</span>. O portal gera dinamicamente essas tags para obter SEO exemplar em redes e indexadores.
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Editorial Body */}
        <div className="flex-1 min-w-0">
          
          {/* Article Header */}
          <div className="mb-6 flex flex-col gap-3">
            {category && (
              <span 
                className="w-fit text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded text-black font-sans shadow-sm"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            )}
            
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {article.title}
            </h1>
            
            <p className="text-base sm:text-lg text-purple-200/80 leading-relaxed font-sans font-light">
              {article.subtitle}
            </p>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 border-y border-purple-900/20 py-3.5 mt-2 font-sans">
              <div className="flex items-center gap-2">
                <img src={article.author.avatar} alt={article.author.name} className="h-6.5 w-6.5 rounded-full object-cover border border-purple-500/20" />
                <div className="flex flex-col">
                  <span className="font-semibold text-white">{article.author.name}</span>
                  <span className="text-[9px] text-purple-400 font-mono">{article.author.role}</span>
                </div>
              </div>
              <span className="text-purple-900/50 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-brand-blue" />
                <span>{formattedDate}</span>
              </div>
              <span className="text-purple-900/50 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{article.readTime} minutos de leitura</span>
              </div>
              <span className="text-purple-900/50 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{article.views} views</span>
              </div>
            </div>
          </div>

          {/* Social share column */}
          <div className="flex items-center gap-2 mb-6" id="article-share-links">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 mr-2 flex items-center gap-1">
              <Share2 className="h-3.5 w-3.5" />
              <span>Compartilhar:</span>
            </span>
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(seoUrl)}`}
              target="_blank" referrerPolicy="no-referrer"
              className="p-1.5 rounded-lg bg-purple-950 border border-purple-900/30 text-purple-300 hover:text-brand-purple hover:border-brand-purple transition-all"
              title="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a 
              href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(seoUrl)}`}
              target="_blank" referrerPolicy="no-referrer"
              className="p-1.5 rounded-lg bg-purple-950 border border-purple-900/30 text-purple-300 hover:text-brand-purple hover:border-brand-purple transition-all"
              title="Facebook"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <button 
              onClick={handleShareCopy}
              className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-purple-950 border border-purple-900/30 text-purple-300 hover:text-brand-purple hover:border-brand-purple transition-all text-[10px] uppercase font-bold tracking-wider cursor-pointer font-sans"
              id="btn-copy-url"
            >
              <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
            </button>
          </div>

          {/* Big Hero Image */}
          <div className="relative overflow-hidden rounded-2xl border border-purple-900/10 mb-8" id="article-image-container">
            <img 
              src={article.image} 
              alt={article.imageAlt} 
              className="w-full h-[250px] sm:h-[450px] object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-2 right-2 bg-black/70 px-2.5 py-1 text-[10px] text-gray-400 rounded">
              Fonte da imagem: Unsplash / {article.imageAlt}
            </div>
          </div>

          {/* Render article body with paragraph parser injecting Ads */}
          <article className="prose prose-invert max-w-none mb-12">
            {renderParagraphsWithAds()}
          </article>

          {/* Tags Block */}
          <div className="flex flex-wrap gap-2 border-t border-purple-900/20 py-6 mb-8" id="article-tags-row">
            {article.tags.map((tag, i) => (
              <span key={i} className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 bg-purple-950 border border-purple-900/40 text-gray-400 rounded font-sans">
                #{tag}
              </span>
            ))}
          </div>

          {/* Related Articles Box */}
          {relatedArticles.length > 0 && (
            <div className="border-t border-purple-900/20 pt-8 mb-12" id="article-related-posts">
              <h3 className="font-display text-lg font-bold text-white mb-5 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-purple" />
                <span>Veja Também</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {relatedArticles.map(art => (
                  <ArticleCard 
                    key={art.id} 
                    article={art} 
                    layout="grid" 
                    onClick={onArticleClick} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Comments System Section (Compliant with specs) */}
          <div className="bg-purple-950/10 border border-purple-900/20 rounded-xl p-5 sm:p-7" id="article-comments-block">
            <h3 className="font-display text-lg font-bold text-white mb-5 flex items-center gap-2 border-b border-purple-900/30 pb-3">
              <MessageSquare className="h-4 w-4 text-brand-blue" />
              <span>Comentários ({comments.length})</span>
            </h3>

            {/* Comment Post Form */}
            <form onSubmit={handlePostComment} className="flex flex-col gap-4 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Nome do Leitor</label>
                  <input
                    type="text"
                    required
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full rounded-lg bg-purple-900/20 border border-purple-800/40 py-2 px-3 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-brand-purple"
                    id="comment-input-name"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Comentário</label>
                <textarea
                  rows={4}
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Escreva sua opinião crítica, dúvidas ou sugestões..."
                  className="w-full rounded-lg bg-purple-900/20 border border-purple-800/40 py-2.5 px-3 text-xs text-white placeholder-purple-400/50 focus:outline-none focus:border-brand-purple resize-none"
                  id="comment-input-text"
                ></textarea>
              </div>

              {commentSuccess && (
                <div className="flex items-center gap-2 bg-green-950/30 border border-green-800/40 text-green-400 text-xs p-2.5 rounded-lg animate-fade-in font-sans">
                  <CheckCircle className="h-4 w-4 shrink-0" />
                  <span>Comentário enviado e publicado com sucesso! Obrigado pela participação.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-fit flex items-center gap-1.5 rounded-lg bg-brand-purple hover:bg-brand-purple/95 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black cursor-pointer shadow-md"
                id="comment-submit-btn"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Publicar Opinião</span>
              </button>
            </form>

            {/* Comments List */}
            {comments.length === 0 ? (
              <p className="text-xs text-gray-500 font-sans text-center py-6 border border-dashed border-purple-900/20 rounded-lg">
                Seja o primeiro a deixar seu comentário sobre este artigo!
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {comments.map(com => (
                  <div key={com.id} className="flex gap-3 bg-purple-950/20 p-3.5 border border-purple-900/10 rounded-xl" id={`comment-item-${com.id}`}>
                    <img 
                      src={com.authorAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(com.authorName)}`} 
                      alt={com.authorName} 
                      className="h-8.5 w-8.5 rounded-full object-cover border border-purple-500/10" 
                    />
                    <div className="flex flex-col gap-1 font-sans">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-white">{com.authorName}</span>
                        <span className="text-[9px] text-gray-500 font-mono">
                          {new Date(com.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 font-light leading-relaxed">
                        {com.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Side Sidebar */}
        <Sidebar 
          onArticleClick={onArticleClick} 
        />

      </div>
    </div>
  );
}
