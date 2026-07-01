/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/db';
import { Category, UserProfile, Article } from '../types';
import { Search, Sun, Moon, User, LogOut, LayoutDashboard, Shield, Eye, HelpCircle, X, Menu, Compass, Link as LinkIcon, Unlink, Camera, MessageSquare, ArrowLeft } from 'lucide-react';
import GoogleAuthSimulator from './GoogleAuthSimulator';

interface HeaderProps {
  onNavigate: (view: 'home' | 'category' | 'admin' | 'article' | 'privacy' | 'terms' | 'feedback', activeId?: string) => void;
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
  const [showGoogleAuth, setShowGoogleAuth] = useState(false);
  const [authSuccessMessage, setAuthSuccessMessage] = useState('');
  
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
  }, [showAuthModal, currentView]);

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
    setAuthSuccessMessage('Sessão encerrada com sucesso! Tokens Supabase revogados.');
    setTimeout(() => setAuthSuccessMessage(''), 4500);
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

  const handleGoogleSelect = (email: string, name: string, avatar: string) => {
    try {
      // If user is already logged in, they are linking their account
      if (currentUser) {
        handleLinkGoogle(email);
        return;
      }
      
      const user = db.signInOrUpWithGoogle(email, name, avatar);
      setCurrentUser(user);
      setShowGoogleAuth(false);
      setShowAuthModal(false);
      resetAuthForm();
    } catch (err: any) {
      setAuthError(err.message || 'Ocorreu um erro no login do Google.');
    }
  };

  const handleLinkGoogle = (googleEmail: string) => {
    if (!currentUser) return;
    try {
      const updatedUser = db.linkGoogleAccount(currentUser.id, googleEmail);
      setCurrentUser(updatedUser);
      setShowGoogleAuth(false);
      setAuthSuccessMessage('Conta Google vinculada com sucesso!');
      setTimeout(() => setAuthSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Erro ao vincular conta Google.');
    }
  };

  const handleUnlinkGoogle = () => {
    if (!currentUser) return;
    try {
      const updatedUser = db.unlinkGoogleAccount(currentUser.id);
      setCurrentUser(updatedUser);
      setAuthSuccessMessage('Conta Google desvinculada.');
      setTimeout(() => setAuthSuccessMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Erro ao desvincular conta Google.');
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2.5MB to be safe and compatible with localStorage limits)
    if (file.size > 2.5 * 1024 * 1024) {
      alert('A imagem escolhida é muito grande. Escolha uma foto de perfil de até 2.5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (currentUser && dataUrl) {
        try {
          const updatedUser = db.updateUserAvatar(currentUser.id, dataUrl);
          setCurrentUser(updatedUser);
          setAuthSuccessMessage('Foto de perfil atualizada com sucesso!');
          setTimeout(() => setAuthSuccessMessage(''), 4000);
        } catch (err: any) {
          alert(err.message || 'Erro ao atualizar foto de perfil.');
        }
      }
    };
    reader.readAsDataURL(file);
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

            {/* Sair da Página (Exit Page) Button - Displays on any page except home */}
            {currentView !== 'home' && (
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 bg-red-500/5 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer mr-1"
                title="Sair da Página Atual e Voltar ao Início"
                id="header-exit-page-btn"
              >
                <ArrowLeft className="h-3.5 w-3.5 shrink-0 font-bold" />
                <span className="hidden sm:inline">Sair da Página</span>
              </button>
            )}

            {/* Dark/Light mode toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg border border-purple-900/30 text-purple-300 hover:text-white cursor-pointer hover:bg-purple-900/10"
              aria-label="Alternar tema claro/escuro"
              id="theme-toggle-btn"
            >
              {isDarkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Central de Feedback & Sugestões shortcut */}
            <button
              onClick={() => onNavigate('feedback')}
              className={`p-2 rounded-lg border border-purple-900/30 text-purple-300 hover:text-white cursor-pointer hover:bg-purple-900/10 flex items-center justify-center transition-colors ${
                currentView === 'feedback' ? 'bg-brand-purple/20 text-brand-purple border-brand-purple/40 font-bold' : ''
              }`}
              title="Feedbacks & Sugestões dos Leitores"
              id="header-feedback-trigger-btn"
            >
              <MessageSquare className="h-4.5 w-4.5" />
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
                  <div className="relative group">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="relative h-7 w-7 rounded-full overflow-hidden border border-brand-purple/40 cursor-pointer block group-hover:scale-105 transition-all focus:outline-none"
                      title="Clique para alterar foto de perfil"
                      id="upload-avatar-trigger-btn"
                    >
                      <img 
                        src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.name)}`} 
                        alt={currentUser.name} 
                        className="h-full w-full object-cover"
                      />
                      {/* Hover overlay with Camera Icon */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="h-3.5 w-3.5 text-white" />
                      </div>
                    </button>
                    {currentUser.googleConnected && (
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-purple-900/30 flex items-center justify-center pointer-events-none" title={`Conta Google Conectada (${currentUser.googleEmail})`}>
                        <svg className="h-2 w-2" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* Hidden Input for uploading photo */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleAvatarChange} 
                    id="user-avatar-file-input"
                  />
                  <div className="hidden lg:flex flex-col items-start leading-none">
                    <span className="text-xs font-semibold text-white truncate max-w-[80px]">{currentUser.name}</span>
                    <span className="text-[9px] uppercase tracking-wider text-brand-purple font-semibold">{currentUser.role}</span>
                  </div>
                  
                  {/* Google Connection button */}
                  <button
                    onClick={currentUser.googleConnected ? handleUnlinkGoogle : () => setShowGoogleAuth(true)}
                    className={`p-1 rounded cursor-pointer ml-1 transition-colors ${
                      currentUser.googleConnected 
                        ? 'text-green-400 hover:text-red-400' 
                        : 'text-purple-400 hover:text-brand-purple'
                    }`}
                    title={currentUser.googleConnected ? `Desvincular Google (${currentUser.googleEmail})` : 'Vincular com o Google'}
                    id="user-google-toggle-btn"
                  >
                    <LinkIcon className="h-3 w-3" />
                  </button>

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

          <button
            onClick={() => {
              onNavigate('feedback');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-brand-purple/30 bg-brand-purple/15 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-purple cursor-pointer hover:bg-brand-purple/20 transition-colors"
            id="mobile-feedback-btn"
          >
            <MessageSquare className="h-4.5 w-4.5" />
            <span>Feedbacks & Sugestões</span>
          </button>
        </div>
      )}

      {/* Custom Auth Modal (Login / Signup) */}
      {showAuthModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm cursor-pointer" 
          id="auth-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAuthModal(false);
              resetAuthForm();
            }
          }}
        >
          <div 
            className="relative w-full max-w-sm rounded-2xl border border-purple-900/40 bg-purple-950 p-6 text-white shadow-2xl animate-scale-in cursor-default" 
            id="auth-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => {
                setShowAuthModal(false);
                resetAuthForm();
              }}
              className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-900/20 hover:bg-purple-900/50 text-purple-300 hover:text-white border border-purple-800/35 transition-all text-[10px] uppercase tracking-wider font-bold cursor-pointer"
              id="auth-modal-close"
              title="Fechar página de cadastramento"
            >
              <X className="h-3.5 w-3.5" />
              <span>Fechar</span>
            </button>

            <div className="flex flex-col items-center justify-center mb-5 text-center">
              <div className="flex h-10 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue px-4 font-display text-lg font-black tracking-wider text-black mb-2">
                PopTech News
              </div>
              <h3 className="text-sm font-semibold text-gray-300">
                {isRegister ? 'Crie uma conta de leitor' : 'Faça login para interagir'}
              </h3>
            </div>

            {/* Google Authentication Pill */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => {
                  setShowGoogleAuth(true);
                }}
                className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-800 cursor-pointer shadow-sm transition-all active:scale-95"
                id="social-google-auth-btn"
              >
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>{isRegister ? 'Registrar com o Google' : 'Continuar com o Google'}</span>
              </button>

              <div className="relative mt-4 mb-2 flex items-center justify-center">
                <div className="absolute inset-x-0 h-px bg-purple-900/30"></div>
                <span className="relative bg-purple-950 px-3 text-[10px] uppercase font-bold tracking-widest text-purple-400">ou use e-mail</span>
              </div>
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
                className="w-full rounded-lg bg-brand-purple hover:bg-brand-purple/95 py-2.5 text-xs font-bold uppercase tracking-wider text-black cursor-pointer shadow-md mt-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
                id="auth-submit-btn"
              >
                {isRegister ? 'Registrar Conta' : 'Acessar Conta'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowAuthModal(false);
                  resetAuthForm();
                }}
                className="w-full rounded-lg bg-purple-900/20 hover:bg-purple-900/40 border border-purple-800/35 py-2.5 text-xs font-bold uppercase tracking-wider text-purple-300 cursor-pointer shadow-sm mt-1.5 transition-all hover:text-white"
                id="auth-cancel-btn"
              >
                Cancelar e Voltar ao Portal
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

      {/* Success Notification Toast */}
      {authSuccessMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-black px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold font-sans uppercase tracking-wide border border-green-400/30 animate-fade-in" id="auth-success-toast">
          <Shield className="h-4 w-4" />
          <span>{authSuccessMessage}</span>
        </div>
      )}

      {/* Google Sign In Simulator Window */}
      <GoogleAuthSimulator 
        isOpen={showGoogleAuth}
        onClose={() => setShowGoogleAuth(false)}
        onSelectAccount={handleGoogleSelect}
        prefillEmail={authEmail}
      />
    </header>
  );
}
