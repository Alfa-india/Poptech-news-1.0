/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Article, Category } from '../types';
import { Clock, Eye, Calendar, User } from 'lucide-react';
import { categories } from '../data/mockArticles';

interface ArticleCardProps {
  key?: string | number;
  article: Article;
  layout: 'grid' | 'horizontal' | 'minimal' | 'hero';
  onClick: (articleId: string) => void;
}

export default function ArticleCard({ article, layout, onClick }: ArticleCardProps) {
  const category = categories.find(c => c.id === article.categoryId) || categories[0];
  const formattedDate = new Date(article.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const categoryColor = category.color;

  if (layout === 'hero') {
    return (
      <div 
        id={`card-hero-${article.id}`}
        className="group relative h-[450px] md:h-[550px] w-full overflow-hidden rounded-2xl cursor-pointer shadow-xl transition-all duration-500 hover:shadow-brand-purple/20"
        onClick={() => onClick(article.id)}
      >
        <img 
          src={article.image} 
          alt={article.imageAlt} 
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950 via-purple-950/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col items-start gap-3">
          <span 
            className="rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-black shadow-md font-sans"
            style={{ backgroundColor: categoryColor }}
          >
            {category.name}
          </span>
          
          <h2 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight group-hover:text-brand-purple transition-colors">
            {article.title}
          </h2>
          
          <p className="text-sm md:text-base text-gray-300 max-w-3xl line-clamp-2 font-sans font-light">
            {article.subtitle}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-2 font-sans">
            <div className="flex items-center gap-1.5">
              <img src={article.author.avatar} alt={article.author.name} className="h-5 w-5 rounded-full object-cover border border-purple-500/30" />
              <span>{article.author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{article.readTime} min de leitura</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{article.views} views</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'horizontal') {
    return (
      <div 
        id={`card-horiz-${article.id}`}
        className="group flex flex-col md:flex-row gap-5 bg-purple-950/20 border border-purple-900/20 rounded-xl overflow-hidden cursor-pointer p-3 transition-all duration-300 hover:border-brand-purple/40 hover:bg-purple-950/30"
        onClick={() => onClick(article.id)}
      >
        <div className="relative h-44 md:h-full w-full md:w-56 shrink-0 overflow-hidden rounded-lg">
          <img 
            src={article.image} 
            alt={article.imageAlt} 
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span 
            className="absolute top-2.5 left-2.5 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black font-sans shadow-md"
            style={{ backgroundColor: categoryColor }}
          >
            {category.name}
          </span>
        </div>
        
        <div className="flex flex-col justify-between py-1 gap-2">
          <div className="flex flex-col gap-1.5">
            <h3 className="font-display text-lg md:text-xl font-bold text-white group-hover:text-brand-purple transition-colors leading-snug line-clamp-2">
              {article.title}
            </h3>
            <p className="text-xs text-gray-300/80 line-clamp-2 font-sans font-light">
              {article.subtitle}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400 font-sans mt-2">
            <span className="font-medium text-brand-blue">{article.author.name}</span>
            <span>•</span>
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {article.readTime} min</span>
          </div>
        </div>
      </div>
    );
  }

  if (layout === 'minimal') {
    return (
      <div 
        id={`card-min-${article.id}`}
        className="group flex items-start gap-3 py-3 border-b border-purple-900/30 cursor-pointer hover:bg-purple-950/10 px-2 rounded-lg transition-colors"
        onClick={() => onClick(article.id)}
      >
        <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md">
          <img 
            src={article.image} 
            alt={article.imageAlt} 
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <span 
            className="text-[9px] font-bold uppercase tracking-widest font-sans"
            style={{ color: categoryColor }}
          >
            {category.name}
          </span>
          <h4 className="font-sans text-xs font-semibold text-gray-200 group-hover:text-brand-purple line-clamp-2 leading-snug">
            {article.title}
          </h4>
          <span className="text-[9px] text-gray-500 flex items-center gap-1 font-mono">
            <Eye className="h-2.5 w-2.5" /> {article.views} views
          </span>
        </div>
      </div>
    );
  }

  // Default Grid Card
  return (
    <div 
      id={`card-grid-${article.id}`}
      className="group flex flex-col bg-purple-950/20 border border-purple-900/20 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-brand-purple/40 hover:translate-y-[-4px] hover:shadow-lg hover:shadow-brand-purple/5"
      onClick={() => onClick(article.id)}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={article.image} 
          alt={article.imageAlt} 
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span 
          className="absolute top-3 left-3 rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black font-sans shadow-md"
          style={{ backgroundColor: categoryColor }}
        >
          {category.name}
        </span>
      </div>
      
      <div className="flex flex-col flex-grow p-4 justify-between gap-3">
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-lg font-bold text-white group-hover:text-brand-purple transition-colors leading-snug line-clamp-2">
            {article.title}
          </h3>
          <p className="text-xs text-gray-300 line-clamp-2 font-sans font-light">
            {article.subtitle}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-[10px] text-gray-400 font-sans border-t border-purple-900/20 pt-2.5 mt-1">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-brand-blue" />
            <span className="truncate max-w-[80px]">{article.author.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{article.readTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
