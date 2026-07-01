/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, UserPlus, ArrowLeft, Mail, User } from 'lucide-react';

interface GoogleAccount {
  email: string;
  name: string;
  avatar: string;
  role: 'admin' | 'editor' | 'subscriber';
}

interface GoogleAuthSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (email: string, name: string, avatar: string) => void;
  prefillEmail?: string;
}

export default function GoogleAuthSimulator({ isOpen, onClose, onSelectAccount, prefillEmail }: GoogleAuthSimulatorProps) {
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newEmail, setNewEmail] = useState(prefillEmail || '');
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  const mockGoogleAccounts: GoogleAccount[] = [
    {
      email: 'alissonrodrigues31122006@gmail.com',
      name: 'Alisson Rodrigues',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'admin'
    },
    {
      email: 'leitor@gmail.com',
      name: 'Carlos Santos',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      role: 'subscriber'
    },
    {
      email: 'editor@poptechnews.com',
      name: 'Sofia Alencar',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      role: 'editor'
    }
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newEmail.trim() || !newName.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (!newEmail.includes('@')) {
      setError('Insira um e-mail do Google válido.');
      return;
    }

    const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(newName)}`;
    onSelectAccount(newEmail.trim().toLowerCase(), newName.trim(), avatarUrl);
  };

  const handleSelect = (acc: GoogleAccount) => {
    onSelectAccount(acc.email, acc.name, acc.avatar);
  };

  // Google Brand Logo SVG
  const GoogleLogo = () => (
    <svg className="h-6 w-6" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer" 
          id="google-auth-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white text-gray-800 shadow-2xl border border-gray-200 font-sans flex flex-col cursor-default"
            id="google-auth-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header section with Google branding */}
            <div className="p-6 pb-4 border-b border-gray-100 flex flex-col items-center text-center bg-gray-50/50">
              <div className="mb-3">
                <GoogleLogo />
              </div>
              <h3 className="font-sans text-xl font-medium text-gray-900 tracking-tight">
                {showAddAccount ? 'Criar conta do Google' : 'Fazer login com o Google'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                para continuar no <strong className="text-purple-700">PopTech News</strong>
              </p>
            </div>

            {/* Main content body */}
            <div className="p-6 max-h-[400px] overflow-y-auto flex-grow">
              {!showAddAccount ? (
                <div className="flex flex-col gap-2.5">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Contas salvas neste navegador
                  </span>

                  {mockGoogleAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      onClick={() => handleSelect(acc)}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-150 hover:border-blue-500 hover:bg-blue-50/30 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="h-10 w-10 rounded-full object-cover border border-gray-200"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">
                            {acc.name}
                          </span>
                          <span className="text-xs text-gray-500">{acc.email}</span>
                        </div>
                      </div>
                      {acc.role === 'admin' && (
                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                          Admin
                        </span>
                      )}
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setShowAddAccount(true);
                      setError('');
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50/10 transition-all text-left group mt-2 cursor-pointer"
                  >
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">
                        Usar outra conta
                      </span>
                      <span className="text-xs text-gray-500">Cadastre um novo e-mail do Google</span>
                    </div>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4 animate-fade-in">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddAccount(false);
                      setError('');
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 mb-2 cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Voltar para seleção de contas</span>
                  </button>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 flex items-center gap-1">
                      <User className="h-3 w-3" /> Nome Completo no Google
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Ex: Alisson Rodrigues"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-900 bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-gray-500 flex items-center gap-1">
                      <Mail className="h-3 w-3" /> E-mail do Google
                    </label>
                    <input
                      type="email"
                      required
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="seuemail@gmail.com"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-900 bg-white"
                    />
                  </div>

                  {error && (
                    <span className="text-xs text-red-600 bg-red-50 border border-red-150 p-2.5 rounded-lg flex items-center gap-1.5 font-medium leading-tight">
                      {error}
                    </span>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer shadow-md mt-2 flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Confirmar Identidade</span>
                  </button>
                </form>
              )}
            </div>

            {/* Footer security information */}
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-gray-500 leading-normal">
                Para continuar, o Google compartilhará de forma segura seu nome, endereço de e-mail e foto de perfil 
                com o portal <strong>PopTech News</strong> para que você possa registrar comentários e acessar conteúdos.
              </p>
            </div>

            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="text-center py-3.5 border-t border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 transition-colors cursor-pointer"
            >
              Cancelar login
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
