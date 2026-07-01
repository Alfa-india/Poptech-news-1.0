/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Category, UserProfile, Article } from '../types';
import { Search, Sun, Moon, User, LogOut, LayoutDashboard, Shield, Eye, HelpCircle, X, Menu, Compass } from 'lucide-react';

interface HeaderProps {
  onNavigate: (view: 'home' | 'category' | 'admin' | 'article', activeId?: string) => void;
  currentView: string;
  activeCategoryId?: string;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function Header({ onNavigate, currentView, activeCategoryId, isDarkMode, onToggleTheme }: HeaderProps) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Search bar states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Mobile menu states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load categories
  const categories = db.getCategories();

  useEffect(() => {
    setCurrentUser(db.getCurrentUser());
  }, [showAuthModal]);

  // Handle Search input changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const matches = db.getArticles().filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setSearchResults(matches.slice(0, 5));
  }, [searchQuery]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail) {
      setAuthError('E-mail é obrigatório.');
      return;
    }

    try {
      if (isRegister) {
        if (!authName) {
          setAuthError('Nome é obrigatório.');
          return;
        }
        // Auto sign up
        const user = db.signUp(authEmail, authName);
        setCurrentUser(user);
        setShowAuthModal(false);
        resetAuthForm();
      } else {
        // Sign in
        const user = db.signIn(authEmail);
        setCurrentUser(user);
        setShowAuthModal(false);
        resetAuthForm();
      }
    } catch (err: any) {
      setAuthError(err.message || 'Ocorreu um erro.');
    }
  };

  const handleLogout = () => {
    db.signOut();
    setCurrentUser(null);
    onNavigate('home');
  };

  const resetAuthForm = () => {
    setAuthEmail('');
    setAuthName('');
    setAuthError('');
    setIsRegister(false);
  };

  const handleSearchSelect = (articleId: string) => {
    onNavigate('article', articleId);
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-900/30 bg-purple-950/90 backdrop-blur-md text-white transition-colors dark:bg-purple-950/90 light:bg-white light:text-gray-900" id="main-header">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900/20"
            id="mobile-menu-trigger"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo PopTech News */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2 cursor-pointer select-none"
            id="header-logo"
          >
            <div className="flex h-9 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue px-3 py-1 font-display text-lg font-black tracking-wider text-black">
              POPTECH
            </div>
            <span className="hidden sm:inline font-display text-sm font-bold tracking-widest text-white hover:text-brand-purple transition-colors">
              NEWS
            </span>
          </div>

          {/* Desktop Categories Menu */}
          <nav className="hidden md:flex items-center gap-1 xl:gap-2">
            {categories.slice(0, 8).map(cat => {
              const isActive = currentView === 'category' && activeCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onNavigate('category', cat.id)}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded transition-colors cursor-pointer ${
                    isActive 
                      ? 'bg-purple-900/40 text-brand-purple font-bold' 
                      : 'text-gray-300 hover:text-brand-purple'
                  }`}
                  id={`nav-cat-${cat.id}`}
                >
                  {cat.name}
                </button>
              );
            })}
          </nav>

          {/* Right Side Tools */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 flex-grow md:flex-grow-0 justify-end md:justify-start">
            
            {/* Live Search Engine */}
            <div className="relative max-w-xs flex-grow hidden sm:block">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Pesquisar notícias..."
                className="w-full rounded-lg bg-purple-950/60 border border-purple-900/30 py-1.5 pl-9 pr-4 text-xs text-white placeholder-purple-400/60 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/20"
                id="header-search-input"
              />

              {/* Dynamic search results dropdown */}
              {showDropdown && searchQuery.trim() && (
                <div className="absolute top-11 right-0 w-80 rounded-xl border border-purple-900/40 bg-purple-950 p-2 shadow-2xl z-50">
                  <div className="flex items-center justify-between border-b border-purple-900/30 pb-2 mb-2 px-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Resultados da Busca</span>
                    <button 
                      onClick={() => setShowDropdown(false)} 
                      className="text-purple-400 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-xs text-purple-400 font-sans">
                      Nenhuma notícia encontrada para "{searchQuery}"
                    </div>
                  ) : (
                    <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
                      {searchResults.map(art => (
                        <div
                          key={art.id}
                          onClick={() => handleSearchSelect(art.id)}
                          className="flex items-center gap-2 p-2 hover:bg-purple-900/20 rounded-lg cursor-pointer transition-colors"
                        >
                          <img src={art.image} alt={art.imageAlt} className="h-8 w-11 rounded object-cover" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-semibold text-white truncate">{art.title}</span>
                            <span className="text-[9px] text-brand-blue font-sans capitalize">{art.categoryId}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dark/Light mode toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg border border-purple-900/30 text-purple-300 hover:text-white cursor-pointer hover:bg-purple-900/10"
              aria-label="Alternar tema claro/escuro"
              id="theme-toggle-btn"
            >
              {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Auth area */}
            {currentUser ? (
              <div className="flex items-center gap-2" id="user-logged-in-panel">
                {/* Dashboard button for admin/editor */}
                {(currentUser.role === 'admin' || currentUser.role === 'editor') && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="p-2 text-brand-blue border border-brand-blue/30 rounded-lg hover:bg-brand-blue/10 cursor-pointer hidden md:flex items-center gap-1 text-xs font-bold uppercase tracking-wider"
                    title="Painel Administrativo"
                    id="admin-panel-btn"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Painel</span>
                  </button>
                )}

                <div className="flex items-center gap-1.5 border border-purple-900/30 bg-purple-950/60 p-1 rounded-full pr-3 max-w-[150px] sm:max-w-none">
                  <img 
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.name)}`} 
                    alt={currentUser.name} 
                    className="h-7 w-7 rounded-full object-cover border border-brand-purple/40"
                  />
                  <div className="hidden lg:flex flex-col items-start leading-none">
                    <span className="text-xs font-semibold text-white truncate max-w-[80px]">{currentUser.name}</span>
                    <span className="text-[9px] uppercase tracking-wider text-brand-purple font-semibold">{currentUser.role}</span>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="p-1 text-purple-400 hover:text-red-400 rounded cursor-pointer ml-1"
                    title="Sair da Conta"
                    id="user-logout-btn"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-brand-purple hover:bg-brand-purple/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-black cursor-pointer shadow-md"
                id="header-login-btn"
              >
                <User className="h-3.5 w-3.5" />
                <span>Entrar</span>
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-purple-900/20 bg-purple-950 px-4 py-3 flex flex-col gap-2.5 animate-slide-up" id="mobile-drawer-menu">
          <div className="relative w-full mb-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-purple-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar..."
              className="w-full rounded-lg bg-purple-900/20 border border-purple-800/30 py-1.5 pl-9 pr-4 text-xs text-white placeholder-purple-400 focus:outline-none"
              id="mobile-search-input"
            />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  onNavigate('category', cat.id);
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded text-left text-gray-300 bg-purple-950/50 hover:bg-purple-900/30 hover:text-brand-purple"
                id={`mobile-nav-cat-${cat.id}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'editor') && (
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-brand-blue/30 bg-brand-blue/10 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-blue"
              id="mobile-admin-panel-btn"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Acessar Painel Admin</span>
            </button>
          )}
        </div>
      )}

      {/* Custom Auth Modal (Login / Signup) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="auth-modal-overlay">
          <div className="relative w-full max-w-sm rounded-2xl border border-purple-900/40 bg-purple-950 p-6 text-white shadow-2xl animate-scale-in" id="auth-modal-content">
            <button 
              onClick={() => {
                setShowAuthModal(false);
                resetAuthForm();
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-purple-900/30 text-purple-400 hover:text-white"
              id="auth-modal-close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center justify-center mb-6 text-center">
              <div className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue px-4 font-display text-lg font-black tracking-wider text-black mb-2">
                PopTech News
              </div>
              <h3 className="text-sm font-semibold text-gray-300">
                {isRegister ? 'Crie uma conta de leitor' : 'Faça login para interagir'}
              </h3>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              {isRegister && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full rounded-lg bg-purple-900/30 border border-purple-800/40 py-2 px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                    id="auth-input-name"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Endereço de E-mail</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="exemplo@poptech.com"
                  className="w-full rounded-lg bg-purple-900/30 border border-purple-800/40 py-2 px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                  id="auth-input-email"
                />
              </div>

              {authError && (
                <span className="text-[10px] text-red-400 bg-red-950/20 border border-red-900/30 p-2 rounded-lg flex items-center gap-1 font-sans">
                  <Shield className="h-3.5 w-3.5 shrink-0" />
                  {authError}
                </span>
              )}

              {!isRegister && (
                <div className="bg-purple-900/10 border border-purple-800/20 rounded-lg p-2 text-[10px] text-gray-400 leading-normal font-sans">
                  💡 <strong>Quer testar o Painel?</strong> Entre com <span className="text-brand-blue font-semibold font-mono">admin@poptechnews.com</span> ou com o e-mail cadastrado <span className="text-brand-blue font-semibold font-mono">alissonrodrigues31122006@gmail.com</span>. Nenhuma senha é exigida neste ambiente simulado.
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-lg bg-brand-purple hover:bg-brand-purple/95 py-2.5 text-xs font-bold uppercase tracking-wider text-black cursor-pointer shadow-md mt-2"
                id="auth-submit-btn"
              >
                {isRegister ? 'Registrar Conta' : 'Acessar Conta'}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-gray-400 border-t border-purple-900/20 pt-4 font-sans">
              {isRegister ? (
                <>
                  Já possui conta?{' '}
                  <button onClick={() => setIsRegister(false)} className="text-brand-purple hover:underline font-semibold cursor-pointer">
                    Fazer Login
                  </button>
                </>
              ) : (
                <>
                  Ainda não tem conta?{' '}
                  <button onClick={() => setIsRegister(true)} className="text-brand-purple hover:underline font-semibold cursor-pointer">
                    Cadastre-se grátis
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
