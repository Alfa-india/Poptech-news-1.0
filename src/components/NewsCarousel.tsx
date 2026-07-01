/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ArticleCard from './ArticleCard';

interface NewsCarouselProps {
  articles: Article[];
  onArticleClick: (articleId: string) => void;
}

export default function NewsCarousel({ articles, onArticleClick }: NewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featured = articles.filter(a => a.featured && a.published);

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % featured.length);
    }, 7000); // Auto rotating every 7 seconds
    return () => clearInterval(interval);
  }, [featured.length]);

  if (featured.length === 0) {
    return null;
  }

  const activeArticle = featured[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + featured.length) % featured.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % featured.length);
  };

  return (
    <div className="relative w-full group overflow-hidden rounded-2xl" id="featured-news-carousel">
      {/* Active Slide */}
      <ArticleCard 
        article={activeArticle} 
        layout="hero" 
        onClick={onArticleClick} 
      />

      {/* Manual Slide Toggles (visible on hover) */}
      {featured.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white border border-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-brand-purple hover:text-black focus:outline-none"
            aria-label="Notícia em destaque anterior"
            id="carousel-prev-btn"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white border border-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-brand-purple hover:text-black focus:outline-none"
            aria-label="Próxima notícia em destaque"
            id="carousel-next-btn"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Slider Position Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {featured.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === index ? 'w-6 bg-brand-purple' : 'w-1.5 bg-gray-500/80 hover:bg-white'
                }`}
                aria-label={`Ir para destaque número ${index + 1}`}
                id={`carousel-indicator-${index}`}
              ></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
