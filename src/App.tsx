/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NewsCarousel from './components/NewsCarousel';
import ArticleCard from './components/ArticleCard';
import Sidebar from './components/Sidebar';
import AdSpace from './components/AdSpace';
import CategoryView from './components/CategoryView';
import ArticleView from './components/ArticleView';
import AdminDashboard from './components/AdminDashboard';
import CookieConsent from './components/CookieConsent';
import FeedbackView from './components/FeedbackView';
import { db } from './lib/db';
import { Article, CategoryId, ViewState } from './types';
import { Sparkles, Cpu, Film, Flame, ShieldAlert, CheckCircle, Tag, X, HelpCircle, FileText } from 'lucide-react';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [viewState, setViewState] = useState<ViewState>({ currentView: 'home' });
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Load articles
  useEffect(() => {
    setArticles(db.getArticles());
  }, [viewState]);

  // Apply dark mode styling to body tag
  useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.style.backgroundColor = '#0b0219'; // deep space purple black
      body.style.color = '#f3f4f6';
    } else {
      body.style.backgroundColor = '#fbf7ff'; // warm off-white
      body.style.color = '#111827';
    }
  }, [isDarkMode]);

  const handleNavigate = (view: 'home' | 'category' | 'admin' | 'article' | 'privacy' | 'terms' | 'feedback', id?: string) => {
    if (view === 'category' && id) {
      setViewState({ currentView: 'category', activeCategory: id as CategoryId });
    } else if (view === 'article' && id) {
      setViewState({ currentView: 'article', activeArticleId: id });
    } else {
      setViewState({ currentView: view as any });
    }
    // Remove tags filter when navigating away
    if (view !== 'home') {
      setSelectedTag(null);
    }
  };

  const handleTagFilter = (tagName: string) => {
    setSelectedTag(tagName);
    setViewState({ currentView: 'home' });
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  const handleToggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Filter articles based on tag
  const filteredArticles = selectedTag 
    ? articles.filter(a => a.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase()))
    : articles;

  const technologyArticles = filteredArticles.filter(a => a.categoryId === 'tecnologia');
  const popCultureArticles = filteredArticles.filter(a => a.categoryId !== 'tecnologia');

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      isDarkMode ? 'dark bg-[#0b0219] text-gray-100' : 'light bg-[#fbf7ff] text-gray-900'
    }`} id="applet-wrapper">
      
      {/* Monetization AdSense Header Banner */}
      <div className="w-full bg-purple-950/20 py-3 border-b border-purple-950/40">
        <AdSpace type="top-banner" />
      </div>

      {/* Main Header */}
      <Header 
        onNavigate={handleNavigate} 
        currentView={viewState.currentView}
        activeCategoryId={viewState.activeCategory}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Primary Routing Section */}
      <main className="flex-grow">
        
        {/* VIEW: HOME */}
        {viewState.currentView === 'home' && (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8 animate-fade-in" id="home-view-container">
            
            {/* Interactive Carousel Banner */}
            {!selectedTag && (
              <section aria-label="Notícias em Destaque">
                <NewsCarousel 
                  articles={articles} 
                  onArticleClick={(id) => handleNavigate('article', id)} 
                />
              </section>
            )}

            {/* Active Tag filter notice bar */}
            {selectedTag && (
              <div className="flex items-center justify-between bg-purple-950/45 border border-brand-purple/30 rounded-xl p-4 animate-fade-in" id="active-tag-banner">
                <div className="flex items-center gap-2">
                  <Tag className="h-4.5 w-4.5 text-brand-purple" />
                  <span className="text-sm font-semibold text-gray-200">
                    Filtrando notícias por: <strong className="text-brand-purple font-mono">#{selectedTag}</strong>
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedTag(null)}
                  className="flex items-center gap-1 text-xs uppercase font-bold text-gray-400 hover:text-white cursor-pointer"
                  id="dismiss-tag-filter-btn"
                >
                  <span>Limpar Filtro</span>
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Grid Split Content & Sidebar */}
            <div className="flex flex-col lg:flex-row gap-8">
              
              {/* Left Column: News feeds grouped by taxonomy */}
              <div className="flex-1 flex flex-col gap-10 min-w-0" id="home-left-feed">
                
                {/* 1. Tecnologia & IA Feed: Horizontal Cards Layout */}
                {technologyArticles.length > 0 && (
                  <section className="flex flex-col gap-4" id="home-sec-technology">
                    <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight border-b-2 border-brand-purple pb-2 flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-brand-purple" />
                      <span>Tecnologia & Hardware</span>
                    </h2>
                    
                    <div className="flex flex-col gap-4">
                      {technologyArticles.slice(0, 3).map(art => (
                        <ArticleCard 
                          key={art.id} 
                          article={art} 
                          layout="horizontal" 
                          onClick={(id) => handleNavigate('article', id)} 
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Monetization Inline Ad Placement */}
                <AdSpace type="inline" className="my-2" />

                {/* 2. Pop Culture Feed: Beautiful Bento-like Grid layout */}
                {popCultureArticles.length > 0 && (
                  <section className="flex flex-col gap-4" id="home-sec-pop-culture">
                    <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white tracking-tight border-b-2 border-brand-blue pb-2 flex items-center gap-2">
                      <Film className="h-5 w-5 text-brand-blue" />
                      <span>Cultura Pop & Entretenimento</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {popCultureArticles.slice(0, 6).map(art => (
                        <ArticleCard 
                          key={art.id} 
                          article={art} 
                          layout="grid" 
                          onClick={(id) => handleNavigate('article', id)} 
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Handle Empty State */}
                {technologyArticles.length === 0 && popCultureArticles.length === 0 && (
                  <div className="text-center py-16 bg-purple-950/10 border border-purple-900/10 rounded-xl font-sans text-gray-400">
                    <ShieldAlert className="h-12 w-12 text-purple-400/50 mx-auto mb-3" />
                    <h3 className="font-display text-lg font-bold text-white mb-1">Nenhuma notícia correspondente</h3>
                    <p className="text-xs max-w-sm mx-auto">Tente limpar os filtros de tag ou acesse o painel administrativo para criar novas notícias!</p>
                  </div>
                )}

              </div>

              {/* Right Column: Reusable responsive sidebar */}
              <Sidebar 
                onArticleClick={(id) => handleNavigate('article', id)} 
                activeTag={selectedTag || undefined}
                onTagClick={handleTagFilter}
              />

            </div>

            {/* Bottom: Recommended Articles Reel */}
            {articles.length > 4 && (
              <section className="border-t border-purple-900/25 pt-10 pb-4" id="home-sec-recommended">
                <h2 className="font-display text-xl font-bold text-white tracking-tight mb-6 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-brand-purple" />
                  <span>Editoriais Recomendados</span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                  {articles.slice(1, 5).map(art => (
                    <ArticleCard 
                      key={art.id} 
                      article={art} 
                      layout="grid" 
                      onClick={(id) => handleNavigate('article', id)} 
                    />
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

        {/* VIEW: CATEGORY NEWS FEED */}
        {viewState.currentView === 'category' && viewState.activeCategory && (
          <CategoryView 
            categoryId={viewState.activeCategory} 
            onNavigateHome={() => handleNavigate('home')}
            onArticleClick={(id) => handleNavigate('article', id)}
          />
        )}

        {/* VIEW: DETAILED ARTICLE PAGE */}
        {viewState.currentView === 'article' && viewState.activeArticleId && (
          <ArticleView 
            articleId={viewState.activeArticleId} 
            onNavigateHome={() => handleNavigate('home')}
            onArticleClick={(id) => handleNavigate('article', id)}
            onCategoryClick={(catId) => handleNavigate('category', catId)}
          />
        )}

        {/* VIEW: PROTECTED ADMIN PANEL */}
        {viewState.currentView === 'admin' && (
          <AdminDashboard 
            onNavigateHome={() => handleNavigate('home')}
            onArticleClick={(id) => handleNavigate('article', id)}
          />
        )}

        {/* VIEW: POLICY PRIVACY (AdSense Compliant) */}
        {viewState.currentView === 'privacy' && (
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 font-sans animate-fade-in" id="view-privacy-policy">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase mb-2">
              Política de Privacidade
            </h1>
            <span className="text-xs text-purple-400 font-mono block mb-8">Última atualização: 29 de junho de 2026</span>
            
            <div className="prose prose-invert text-gray-300 font-light leading-relaxed flex flex-col gap-5 text-sm">
              <p>
                No portal <strong>PopTech News</strong>, privacidade e transparência são prioridades fundamentais. Esta política descreve como coletamos, utilizamos e protegemos as informações fornecidas por nossos usuários de acordo com as diretrizes da LGPD (Lei Geral de Proteção de Dados) e as exigências do programa Google AdSense.
              </p>
              
              <h2 className="font-display text-xl font-bold text-white tracking-wide mt-4 uppercase">1. Coleta de Dados e Consentimento</h2>
              <p>
                Coletamos informações básicas como e-mail quando o usuário voluntariamente se inscreve em nossa newsletter (PopTech Insights) ou preenche o cadastro básico para registrar opiniões na seção de comentários de artigos. Nossos comentários usam avatares gerados automaticamente via Dicebear e não expõem dados sensíveis.
              </p>

              <h2 className="font-display text-xl font-bold text-white tracking-wide mt-4 uppercase">2. Uso de Cookies e Google AdSense</h2>
              <p>
                Este portal utiliza cookies de terceiros para veicular anúncios monetizados do <strong>Google AdSense</strong>. O Google usa cookies (como o cookie DART) para exibir anúncios aos leitores com base nas visitas feitas a este e a outros sites na internet. 
              </p>
              <p>
                Os leitores podem desativar a veiculação de publicidade personalizada acessando as configurações de anúncios do Google em sua conta ou configurando as preferências de cookies diretamente em seu navegador.
              </p>

              <h2 className="font-display text-xl font-bold text-white tracking-wide mt-4 uppercase">3. Cookies HTTPOnly e Segurança</h2>
              <p>
                Para manter as sessões administrativas e de usuários totalmente protegidas de ataques XSS (Cross-Site Scripting), os identificadores de sessão simulados utilizam práticas compatíveis com cookies <strong>HttpOnly</strong> em produção, blindando tokens e dados confidenciais de acessos de scripts maliciosos.
              </p>

              <h2 className="font-display text-xl font-bold text-white tracking-wide mt-4 uppercase">4. Links para Terceiros</h2>
              <p>
                Nossos artigos contêm links para parceiros, canais sociais oficiais e fontes externas de imagens. O PopTech News não se responsabiliza pelas políticas de privacidade ou cookies operados por esses sites de terceiros. Recomenda-se a leitura atenta de seus respectivos termos.
              </p>

              <h2 className="font-display text-xl font-bold text-white tracking-wide mt-4 uppercase">5. Seus Direitos de Exclusão</h2>
              <p>
                A qualquer momento, o leitor pode solicitar a exclusão total de seu e-mail de nossa lista de newsletter ou remoção de seus comentários postados enviando e-mail para <span className="text-brand-purple font-mono font-bold">contato@poptechnews.com</span>.
              </p>
            </div>
            
            <button 
              onClick={() => handleNavigate('home')}
              className="mt-10 rounded-lg bg-brand-purple hover:bg-brand-purple/95 px-5 py-2.5 text-xs font-bold text-black font-sans uppercase tracking-wider cursor-pointer shadow-md"
            >
              Voltar para a Página Inicial
            </button>
          </div>
        )}

        {/* VIEW: TERMS OF USE */}
        {viewState.currentView === 'terms' && (
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 font-sans animate-fade-in" id="view-terms-of-use">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase mb-2">
              Termos de Uso do Portal
            </h1>
            <span className="text-xs text-purple-400 font-mono block mb-8">Última atualização: 29 de junho de 2026</span>
            
            <div className="prose prose-invert text-gray-300 font-light leading-relaxed flex flex-col gap-5 text-sm">
              <p>
                Seja bem-vindo(a) ao <strong>PopTech News</strong>. Ao acessar, ler ou interagir com os conteúdos publicados em nosso portal de notícias, você concorda expressamente em respeitar e seguir integralmente os termos de uso descritos abaixo.
              </p>
              
              <h2 className="font-display text-xl font-bold text-white tracking-wide mt-4 uppercase">1. Propriedade Intelectual e Uso Aceitável</h2>
              <p>
                Todo o material editorial, incluindo notícias, resenhas críticas, resumos de capítulos de mangás, HQs ou animes e imagens com texto alternativo são protegidos por direitos intelectuais. É estritamente proibida a reprodução em massa de artigos inteiros em outros portais sem atribuição clara de link e citação ao PopTech News.
              </p>

              <h2 className="font-display text-xl font-bold text-white tracking-wide mt-4 uppercase">2. Conduta nas Seções de Comentários</h2>
              <p>
                Oferecemos uma seção de discussões aberta para fomentar debates nerds e tecnológicos saudáveis. Reservamo-nos o direito de moderar, editar ou excluir de forma sumária quaisquer comentários contendo termos pejorativos, ataques pessoais, spam promocional de afiliados ou difamação.
              </p>

              <h2 className="font-display text-xl font-bold text-white tracking-wide mt-4 uppercase">3. Isenção de Responsabilidade sobre Monetização</h2>
              <p>
                Os blocos de anúncios veiculados no topo, lateral, entre artigos e rodapé são operados de forma automatizada pelo Google AdSense ou parceiros autorizados. Não controlamos ou garantimos as ofertas, cupons ou produtos veiculados por esses anunciantes. Quaisquer transações financeiras externas ocorrem por conta e risco do próprio leitor.
              </p>

              <h2 className="font-display text-xl font-bold text-white tracking-wide mt-4 uppercase">4. Modificações de Termos</h2>
              <p>
                O PopTech News pode revisar estes termos periodicamente para se adaptar a novas regulamentações digitais. O uso contínuo do portal após publicação de emendas constituirá consentimento tácito das novas diretrizes.
              </p>
            </div>
            
            <button 
              onClick={() => handleNavigate('home')}
              className="mt-10 rounded-lg bg-brand-purple hover:bg-brand-purple/95 px-5 py-2.5 text-xs font-bold text-black font-sans uppercase tracking-wider cursor-pointer shadow-md"
            >
              Voltar para a Página Inicial
            </button>
          </div>
        )}

        {/* VIEW: FEEDBACK & SUGGESTIONS */}
        {viewState.currentView === 'feedback' && (
          <FeedbackView onBackToHome={() => handleNavigate('home')} />
        )}

      </main>

      {/* Main Footer */}
      <Footer 
        onNavigate={handleNavigate} 
      />

      {/* Cookie Consent Banner */}
      <CookieConsent 
        onNavigate={handleNavigate} 
        isDarkMode={isDarkMode} 
      />

    </div>
  );
}
