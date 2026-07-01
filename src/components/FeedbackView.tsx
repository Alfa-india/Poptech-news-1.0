/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, CheckCircle2, Heart, Lightbulb, AlertTriangle, MessageCircle, ArrowLeft } from 'lucide-react';
import { db } from '../lib/db';

interface FeedbackViewProps {
  onBackToHome: () => void;
}

export default function FeedbackView({ onBackToHome }: FeedbackViewProps) {
  const currentUser = db.getCurrentUser();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState<'sugestao' | 'elogio' | 'critica' | 'bug' | 'outro'>('sugestao');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Prefill user data if logged in
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Por favor, digite seu nome.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, digite um e-mail válido.');
      return;
    }

    if (!message.trim()) {
      setError('Por favor, digite sua sugestão ou feedback.');
      return;
    }

    if (message.trim().length < 10) {
      setError('Sua mensagem precisa ter pelo menos 10 caracteres.');
      return;
    }

    try {
      db.createFeedback(name, email, type, message);
      setIsSubmitted(true);
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Houve um erro ao enviar seu feedback.');
    }
  };

  const typeOptions = [
    { value: 'sugestao', label: 'Sugestão', icon: Lightbulb, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { value: 'elogio', label: 'Elogio', icon: Heart, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { value: 'critica', label: 'Crítica', icon: MessageCircle, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { value: 'bug', label: 'Reportar Bug', icon: AlertTriangle, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { value: 'outro', label: 'Outro', icon: MessageSquare, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12 text-white font-sans" id="feedback-view-container">
      {/* Back link */}
      <button
        onClick={onBackToHome}
        className="group mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 hover:text-white transition-colors cursor-pointer"
        id="feedback-back-btn"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        <span>Voltar ao Portal</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left column: Information */}
        <div className="md:col-span-5 flex flex-col gap-5">
          <div>
            <span className="text-[10px] bg-brand-purple/20 text-brand-purple border border-brand-purple/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block mb-3">
              Fale Conosco
            </span>
            <h1 className="font-display text-3xl font-black tracking-tight leading-none text-white mb-2">
              Feedbacks & Sugestões
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed font-light">
              Sua opinião move o **PopTech News**. Queremos construir o portal mais completo e interativo sobre a cultura pop e tecnológica, e suas palavras nos ajudam a evoluir todos os dias.
            </p>
          </div>

          <div className="h-px bg-purple-900/30"></div>

          <div className="flex flex-col gap-4">
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">Como tratamos sua opinião?</h4>
            
            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 rounded-lg bg-purple-950/80 border border-purple-900/40 flex items-center justify-center text-brand-purple shrink-0 mt-0.5">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-white">Análise de Recursos</h5>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">Avaliamos ideias de novos recursos, filtros e categorias de conteúdo todas as semanas.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="h-8 w-8 rounded-lg bg-purple-950/80 border border-purple-900/40 flex items-center justify-center text-brand-blue shrink-0 mt-0.5">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <h5 className="text-xs font-semibold text-white">Correções de Bugs</h5>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">Erros e travamentos reportados são encaminhados diretamente para correção prioritária.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Form */}
        <div className="md:col-span-7">
          <div className="bg-purple-950/15 border border-purple-900/30 rounded-2xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden" id="feedback-form-box">
            
            {/* Success screen */}
            {isSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center text-center py-8"
              >
                <div className="h-16 w-16 bg-green-500/10 border border-green-500/30 text-green-400 rounded-full flex items-center justify-center mb-5 animate-bounce">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Muito Obrigado!</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-sm mb-6 font-light">
                  Seu feedback foi registrado e já está na nossa central. Nosso time de administradores analisará com carinho suas sugestões.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="bg-purple-900/40 hover:bg-purple-900/60 border border-purple-800/40 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  Enviar Outro Feedback
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <h3 className="font-display text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <MessageSquare className="h-4.5 w-4.5 text-brand-purple" />
                  <span>Envie sua mensagem</span>
                </h3>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Seu Nome</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Alisson Rodrigues"
                      className="w-full bg-purple-950/60 border border-purple-900/50 rounded-lg py-2.5 px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/30 font-sans"
                      id="feedback-input-name"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Seu E-mail</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className="w-full bg-purple-950/60 border border-purple-900/50 rounded-lg py-2.5 px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/30 font-sans"
                      id="feedback-input-email"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Tipo de Mensagem</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2" id="feedback-type-selector">
                    {typeOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = type === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setType(opt.value as any)}
                          className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                            isSelected 
                              ? `${opt.color} ring-1 ring-white/10 scale-[1.03] font-bold` 
                              : 'bg-purple-950/30 border-purple-900/30 text-gray-400 hover:text-white hover:border-purple-800/50'
                          }`}
                        >
                          <Icon className="h-4 w-4 mb-1" />
                          <span className="text-[10px] whitespace-nowrap">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Mensagem</label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escreva aqui suas sugestões, críticas, elogios ou detalhes de algum problema encontrado no portal..."
                    rows={5}
                    className="w-full bg-purple-950/60 border border-purple-900/50 rounded-lg py-2.5 px-3.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/30 font-sans leading-relaxed resize-none"
                    id="feedback-input-message"
                  />
                </div>

                {error && (
                  <span className="text-xs text-red-400 bg-red-950/30 border border-red-900/30 p-2.5 rounded-lg flex items-center gap-1.5 font-medium leading-tight">
                    <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                    <span>{error}</span>
                  </span>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 text-black font-bold text-xs uppercase tracking-wider py-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  id="feedback-submit-btn"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Enviar Feedback</span>
                </button>
              </form>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
