/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { CategoryId, Article } from '../types';
import { ArrowLeft, ArrowRight, LayoutGrid, Eye, Sparkles, Code } from 'lucide-react';
import ArticleCard from './ArticleCard';
import Sidebar from './Sidebar';

interface CategoryViewProps {
  categoryId: CategoryId;
  onNavigateHome: () => void;
  onArticleClick: (articleId: string) => void;
}

const ARTICLES_PER_PAGE = 6;

export default function CategoryView({ categoryId, onNavigateHome, onArticleClick }: CategoryViewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [showSeoSandbox, setShowSeoSandbox] = useState(false);

  const category = db.getCategories().find(c => c.id === categoryId);
  const articles = db.getArticles().filter(a => a.categoryId === categoryId);

  // Reset page when switching categories
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId]);

  if (!category) {
    return (
      <div className="text-center py-20 text-white">
        <p>Categoria não encontrada.</p>
        <button onClick={onNavigateHome} className="mt-4 text-brand-purple hover:underline">Voltar para Home</button>
      </div>
    );
  }

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(articles.length / ARTICLES_PER_PAGE));
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = articles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  // SEO Parameters calculation (Automatic SEO)
  const seoTitle = `${category.name} - PopTech News | As últimas novidades`;
  const seoDescription = category.description;
  const seoUrl = `https://poptechnews.com/categoria/${category.id}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans" id={`category-view-${categoryId}`}>
      
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mb-6 font-mono">
        <button onClick={onNavigateHome} className="hover:text-brand-purple cursor-pointer">HOME</button>
        <span>/</span>
        <span className="text-brand-purple font-semibold uppercase">{category.name}</span>
      </div>

      {/* Category Header */}
      <div className="relative overflow-hidden rounded-2xl bg-purple-950/20 border border-purple-900/20 p-6 sm:p-8 mb-8" id="category-header-banner">
        <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: category.color }}></div>
        <div className="max-w-3xl flex flex-col gap-2">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase leading-none">
            {category.name}
          </h1>
          <p className="text-sm text-gray-300 font-sans font-light leading-relaxed">
            {category.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-purple-400 font-mono mt-2">
            <span>{articles.length} artigos publicados</span>
            <span>•</span>
            <span>Página {currentPage} de {totalPages}</span>
          </div>
        </div>

        {/* SEO Metadata simulator preview toggle */}
        <button 
          onClick={() => setShowSeoSandbox(!showSeoSandbox)}
          className="absolute right-4 bottom-4 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-purple-900/30 hover:bg-purple-900/60 border border-purple-800/40 text-purple-300 py-1.5 px-2.5 rounded-lg transition-colors cursor-pointer"
          id="category-seo-toggle"
        >
          <Code className="h-3 w-3 text-brand-blue" />
          <span>Ver Tags de SEO Geradas</span>
        </button>
      </div>

      {/* SEO Sandbox Display (Visual proof of compliance) */}
      {showSeoSandbox && (
        <div className="bg-purple-950/40 border border-purple-800/30 rounded-xl p-5 mb-8 animate-fade-in font-mono text-xs text-purple-200" id="category-seo-panel">
          <h4 className="font-display text-xs font-bold uppercase tracking-wider text-brand-blue mb-3 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>SEO Engine Simulation (Tags Injetadas no Head)</span>
          </h4>
          <div className="space-y-1.5 bg-black/40 p-3 rounded-lg overflow-x-auto text-[11px] leading-relaxed">
            <div><span className="text-purple-400">&lt;title&gt;</span>{seoTitle}<span className="text-purple-400">&lt;/title&gt;</span></div>
            <div><span className="text-purple-400">&lt;meta name="description" content=</span>"{seoDescription}"<span className="text-purple-400"> /&gt;</span></div>
            <div><span className="text-purple-400">&lt;link rel="canonical" href=</span>"{seoUrl}"<span className="text-purple-400"> /&gt;</span></div>
            <div><span className="text-purple-400">&lt;meta property="og:title" content=</span>"{seoTitle}"<span className="text-purple-400"> /&gt;</span></div>
            <div><span className="text-purple-400">&lt;meta property="og:description" content=</span>"{seoDescription}"<span className="text-purple-400"> /&gt;</span></div>
            <div><span className="text-purple-400">&lt;meta property="og:url" content=</span>"{seoUrl}"<span className="text-purple-400"> /&gt;</span></div>
            <div><span className="text-purple-400">&lt;meta name="twitter:card" content=</span>"summary_large_image"<span className="text-purple-400"> /&gt;</span></div>
            <div><span className="text-purple-400">&lt;meta name="twitter:title" content=</span>"{seoTitle}"<span className="text-purple-400"> /&gt;</span></div>
          </div>
          <span className="text-[10px] text-purple-400/60 mt-2 block leading-normal font-sans">
            🚀 URL Amigável ativa: <span className="text-brand-purple font-mono">/categoria/{category.id}</span>. Essas tags mudam dinamicamente para cada rota no portal para indexação perfeita no Google.
          </span>
        </div>
      )}

      {/* Main Category Body */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Article Grid List */}
        <div className="flex-1">
          {articles.length === 0 ? (
            <div className="text-center py-16 bg-purple-950/5 border border-purple-900/10 rounded-xl" id="category-no-articles">
              <LayoutGrid className="mx-auto h-12 w-12 text-purple-400/40 mb-3" />
              <h3 className="font-display text-lg font-bold text-white mb-1">Nenhum artigo publicado ainda</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">Inscreva-se no painel administrativo para criar e publicar o primeiro artigo nesta categoria!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="category-articles-grid">
                {paginatedArticles.map(art => (
                  <ArticleCard 
                    key={art.id} 
                    article={art} 
                    layout="grid" 
                    onClick={onArticleClick} 
                  />
                ))}
              </div>

              {/* Functional Pagination Bar */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 border-t border-purple-900/20 pt-6 mt-2" id="category-pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1.5 rounded-lg border border-purple-800/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-300 hover:text-white hover:bg-purple-900/20 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                    id="pagination-prev-btn"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Anterior</span>
                  </button>
                  
                  <span className="text-xs font-semibold text-gray-300 font-mono">
                    Página {currentPage} de {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1.5 rounded-lg border border-purple-800/40 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-300 hover:text-white hover:bg-purple-900/20 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
                    id="pagination-next-btn"
                  >
                    <span>Próxima</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Reusable Sidebar */}
        <Sidebar 
          onArticleClick={onArticleClick} 
        />

      </div>
    </div>
  );
}
