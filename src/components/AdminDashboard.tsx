/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { Article, Category, CategoryId, UserProfile, PortalComment } from '../types';
import { 
  BarChart, FileText, Users, MessageSquare, Plus, Edit, Trash, Eye, 
  CheckCircle, AlertCircle, Save, FolderPlus, Tag, Database, HelpCircle, 
  ChevronRight, ArrowLeft, Settings, Mail, RefreshCw, X
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateHome: () => void;
  onArticleClick: (articleId: string) => void;
}

type TabType = 'stats' | 'articles' | 'categories' | 'users' | 'supabase';

export default function AdminDashboard({ onNavigateHome, onArticleClick }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Form states for Articles
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formImageAlt, setFormImageAlt] = useState('');
  const [formCategory, setFormCategory] = useState<CategoryId>('tecnologia');
  const [formTags, setFormTags] = useState('');
  const [formPublished, setFormPublished] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);

  // Notification alert state
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Category list edit states
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatId, setNewCatId] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('#D946EF');

  // Users state
  const [users, setUsers] = useState<UserProfile[]>([]);

  // Supabase connection credentials state
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    const user = db.getCurrentUser();
    setCurrentUser(user);
    refreshData();
  }, []);

  const refreshData = () => {
    setArticles(db.getArticles(true));
    setCategories(db.getCategories());
    setUsers(db.getUsers());
  };

  const triggerAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  // Guard access
  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'editor')) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-white font-sans">
        <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold mb-2">Acesso Negado</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-6 text-sm">Este painel é protegido. Faça login com uma credencial de Administrador para acessar.</p>
        <button onClick={onNavigateHome} className="bg-brand-purple text-black font-bold uppercase tracking-wider py-2 px-5 rounded-lg text-xs hover:bg-brand-purple/90">
          Voltar para Home
        </button>
      </div>
    );
  }

  // Handle Save Article
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim() || !formContent.trim() || !formImage.trim()) {
      triggerAlert('error', 'Preencha todos os campos obrigatórios (Título, Capa e Conteúdo).');
      return;
    }

    const tagList = formTags.split(',').map(t => t.trim()).filter(t => t.length > 0);

    const articleData = {
      title: formTitle,
      subtitle: formSubtitle,
      summary: formSummary || formTitle.substring(0, 150) + '...',
      content: formContent,
      image: formImage,
      imageAlt: formImageAlt || formTitle,
      categoryId: formCategory,
      tags: tagList,
      published: formPublished,
      featured: formFeatured,
      readTime: Math.max(1, Math.ceil(formContent.split(/\s+/).length / 180)),
      author: {
        name: currentUser.name,
        avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: currentUser.role === 'admin' ? 'Administrador' : 'Editor'
      }
    };

    try {
      if (editingArticleId) {
        db.updateArticle(editingArticleId, articleData);
        triggerAlert('success', 'Artigo atualizado com sucesso!');
      } else {
        db.createArticle(articleData);
        triggerAlert('success', 'Artigo criado e publicado com sucesso!');
      }
      resetArticleForm();
      refreshData();
    } catch (err: any) {
      triggerAlert('error', err.message || 'Erro ao gravar artigo.');
    }
  };

  const handleEditArticleClick = (art: Article) => {
    setEditingArticleId(art.id);
    setFormTitle(art.title);
    setFormSubtitle(art.subtitle);
    setFormSummary(art.summary);
    setFormContent(art.content);
    setFormImage(art.image);
    setFormImageAlt(art.imageAlt);
    setFormCategory(art.categoryId);
    setFormTags(art.tags.join(', '));
    setFormPublished(art.published);
    setFormFeatured(!!art.featured);
    setIsEditingArticle(true);
  };

  const handleDeleteArticleClick = (id: string) => {
    if (confirm('Deseja realmente excluir este artigo permanentemente?')) {
      db.deleteArticle(id);
      triggerAlert('success', 'Artigo excluído.');
      refreshData();
    }
  };

  const handleTogglePublish = (art: Article) => {
    db.updateArticle(art.id, { published: !art.published });
    triggerAlert('success', art.published ? 'Artigo movido para Rascunho.' : 'Artigo publicado com sucesso!');
    refreshData();
  };

  const resetArticleForm = () => {
    setEditingArticleId(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormSummary('');
    setFormContent('');
    setFormImage('');
    setFormImageAlt('');
    setFormCategory('tecnologia');
    setFormTags('');
    setFormPublished(true);
    setFormFeatured(false);
    setIsEditingArticle(false);
  };

  // Handle Save Category
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatId || !newCatName || !newCatDesc) {
      triggerAlert('error', 'Preencha todos os campos da categoria.');
      return;
    }

    try {
      db.createCategory({
        id: newCatId.toLowerCase().trim() as CategoryId,
        name: newCatName.trim(),
        description: newCatDesc.trim(),
        color: newCatColor
      });
      triggerAlert('success', 'Categoria criada com sucesso!');
      setNewCatId('');
      setNewCatName('');
      setNewCatDesc('');
      refreshData();
    } catch (err: any) {
      triggerAlert('error', err.message || 'Erro ao criar categoria.');
    }
  };

  const handleDeleteCategory = (id: CategoryId) => {
    if (confirm('Deseja deletar esta categoria?')) {
      db.deleteCategory(id);
      triggerAlert('success', 'Categoria deletada.');
      refreshData();
    }
  };

  // User list actions
  const handleChangeRole = (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'subscriber' ? 'editor' : currentRole === 'editor' ? 'admin' : 'subscriber';
    db.updateUserRole(userId, nextRole);
    triggerAlert('success', 'Nível de privilégio do usuário atualizado!');
    refreshData();
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Deseja realmente banir/remover este usuário?')) {
      db.deleteUser(userId);
      triggerAlert('success', 'Usuário removido.');
      refreshData();
    }
  };

  // Supabase mock connect helper
  const handleSupabaseConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.startsWith('http') || supabaseKey.length < 20) {
      triggerAlert('error', 'Por favor insira uma URL de API e Chave anônima válidas do Supabase.');
      return;
    }
    setIsSupabaseConnected(true);
    triggerAlert('success', 'Conexão com banco Supabase estabelecida com sucesso! Esquemas sincronizados.');
  };

  // Compute portal analytics stats
  const stats = db.getPortalStats();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans" id="admin-dashboard-container">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-900/20 pb-6 mb-8">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-brand-blue font-mono">Controle de Editoria</span>
          <h1 className="font-display text-3xl font-extrabold text-white tracking-tight uppercase">
            Painel PopTech News
          </h1>
          <p className="text-xs text-gray-400 font-sans font-light mt-0.5">
            Bem-vindo(a), <strong className="text-brand-purple">{currentUser.name}</strong> ({currentUser.role === 'admin' ? 'Administrador' : 'Editor'}). Gerencie seu conteúdo de forma dinâmica.
          </p>
        </div>

        <button 
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-purple-900/20 hover:bg-purple-900/40 border border-purple-800/40 text-purple-300 py-2 px-4 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao Portal</span>
        </button>
      </div>

      {/* Floating Notifications */}
      {alert && (
        <div 
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl p-4 shadow-xl border animate-slide-up max-w-md ${
            alert.type === 'success' 
              ? 'bg-green-950/90 border-green-800/80 text-green-300' 
              : 'bg-red-950/90 border-red-900/80 text-red-300'
          }`}
          id="admin-toast-notification"
        >
          {alert.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span className="text-xs font-semibold leading-snug">{alert.message}</span>
        </div>
      )}

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-purple-900/20 pb-4 mb-8" id="admin-tabs-nav">
        <button
          onClick={() => { setActiveTab('stats'); setIsEditingArticle(false); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'stats' && !isEditingArticle
              ? 'bg-brand-purple text-black font-extrabold' 
              : 'text-gray-400 hover:text-white hover:bg-purple-950/35'
          }`}
        >
          <BarChart className="h-4 w-4" />
          <span>Métricas</span>
        </button>
        
        <button
          onClick={() => { setActiveTab('articles'); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'articles'
              ? 'bg-brand-purple text-black font-extrabold' 
              : 'text-gray-400 hover:text-white hover:bg-purple-950/35'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Notícias</span>
        </button>

        <button
          onClick={() => { setActiveTab('categories'); setIsEditingArticle(false); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'categories'
              ? 'bg-brand-purple text-black font-extrabold' 
              : 'text-gray-400 hover:text-white hover:bg-purple-950/35'
          }`}
        >
          <FolderPlus className="h-4 w-4" />
          <span>Categorias</span>
        </button>

        {currentUser.role === 'admin' && (
          <button
            onClick={() => { setActiveTab('users'); setIsEditingArticle(false); }}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-brand-purple text-black font-extrabold' 
                : 'text-gray-400 hover:text-white hover:bg-purple-950/35'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Leitores e Staff</span>
          </button>
        )}

        <button
          onClick={() => { setActiveTab('supabase'); setIsEditingArticle(false); }}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'supabase'
              ? 'bg-brand-purple text-black font-extrabold' 
              : 'text-gray-400 hover:text-white hover:bg-purple-950/35'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Supabase DB</span>
        </button>
      </div>

      {/* METRICS VIEW (TAB) */}
      {activeTab === 'stats' && !isEditingArticle && (
        <div className="flex flex-col gap-8 animate-fade-in" id="tab-metrics">
          
          {/* Quick counters grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-purple-950/20 border border-purple-900/30 rounded-xl p-5 flex items-center gap-4">
              <div className="p-3.5 bg-brand-purple/10 text-brand-purple rounded-xl shrink-0">
                <Eye className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400/80">Visualizações</span>
                <span className="text-2xl font-black text-white font-mono">{stats.totalViews.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            <div className="bg-purple-950/20 border border-purple-900/30 rounded-xl p-5 flex items-center gap-4">
              <div className="p-3.5 bg-brand-blue/10 text-brand-blue rounded-xl shrink-0">
                <FileText className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400/80">Total Artigos</span>
                <span className="text-2xl font-black text-white font-mono">{stats.totalArticles}</span>
              </div>
            </div>

            <div className="bg-purple-950/20 border border-purple-900/30 rounded-xl p-5 flex items-center gap-4">
              <div className="p-3.5 bg-green-500/10 text-green-400 rounded-xl shrink-0">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400/80">Comentários</span>
                <span className="text-2xl font-black text-white font-mono">{stats.totalComments}</span>
              </div>
            </div>

            <div className="bg-purple-950/20 border border-purple-900/30 rounded-xl p-5 flex items-center gap-4">
              <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
                <Mail className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-400/80">Inscritos News</span>
                <span className="text-2xl font-black text-white font-mono">{stats.totalSubscribers}</span>
              </div>
            </div>

          </div>

          {/* Interactive SVG charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Views Chart */}
            <div className="bg-purple-950/15 border border-purple-900/20 rounded-xl p-5">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-5 pb-3 border-b border-purple-900/20">
                Histórico de Visualizações (Últimos 7 dias)
              </h3>
              
              <div className="h-64 flex flex-col justify-end">
                {/* Visual SVG representation */}
                <div className="relative h-48 w-full flex items-end justify-between px-2">
                  
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    <div className="w-full border-t border-purple-900/20 h-0"></div>
                    <div className="w-full border-t border-purple-900/20 h-0"></div>
                    <div className="w-full border-t border-purple-900/20 h-0"></div>
                  </div>

                  {stats.viewsOverTime.map((d, idx) => {
                    const maxVal = Math.max(...stats.viewsOverTime.map(item => item.views));
                    const heightPercent = maxVal > 0 ? (d.views / maxVal) * 100 : 10;
                    return (
                      <div className="group flex flex-col items-center flex-1 relative" key={idx}>
                        {/* Hover Tooltip tooltip */}
                        <span className="absolute -top-10 scale-0 group-hover:scale-100 bg-brand-purple text-black text-[10px] font-bold py-1 px-1.5 rounded transition-transform font-mono shadow-lg">
                          {d.views} views
                        </span>
                        
                        {/* Interactive SVG Column */}
                        <div 
                          className="w-10 bg-gradient-to-t from-purple-950 to-brand-blue/80 group-hover:to-brand-purple rounded-t transition-all duration-500 hover:brightness-110"
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                        
                        {/* Label */}
                        <span className="text-[9px] text-gray-500 font-semibold font-mono mt-2 truncate">
                          {d.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Distribution Chart */}
            <div className="bg-purple-950/15 border border-purple-900/20 rounded-xl p-5">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-5 pb-3 border-b border-purple-900/20">
                Notícias por Categoria (Volume)
              </h3>
              
              <div className="h-64 flex flex-col justify-center gap-4 px-2">
                {stats.categoryDistribution.length === 0 ? (
                  <p className="text-xs text-gray-500 font-sans text-center">Nenhum artigo publicado nas categorias para computar estatísticas.</p>
                ) : (
                  stats.categoryDistribution.map((item, idx) => {
                    const maxVal = Math.max(...stats.categoryDistribution.map(c => c.value));
                    const widthPercent = maxVal > 0 ? (item.value / maxVal) * 100 : 10;
                    return (
                      <div className="flex items-center gap-3" key={idx}>
                        <span className="w-24 text-xs font-semibold text-gray-300 truncate">{item.name}</span>
                        <div className="flex-1 bg-purple-950/40 h-3.5 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${widthPercent}%`, 
                              backgroundColor: item.color 
                            }}
                          ></div>
                        </div>
                        <span className="w-8 text-right text-xs font-bold text-white font-mono">{item.value}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ARTICLES MANAGER VIEW (TAB) */}
      {activeTab === 'articles' && (
        <div className="flex flex-col gap-8 animate-fade-in" id="tab-articles">
          
          {/* List and CRUD Switcher */}
          {!isEditingArticle ? (
            <div className="flex flex-col gap-6" id="articles-list-container">
              
              {/* Header inside tab */}
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Artigos Editáveis
                </h3>
                
                <button
                  onClick={() => setIsEditingArticle(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-brand-purple hover:bg-brand-purple/95 text-black font-bold text-xs py-2 px-4 shadow-md cursor-pointer"
                  id="create-new-article-btn"
                >
                  <Plus className="h-4 w-4" />
                  <span>Novo Artigo</span>
                </button>
              </div>

              {/* Articles Data Table */}
              <div className="overflow-x-auto rounded-xl border border-purple-900/20 bg-purple-950/10">
                <table className="w-full border-collapse text-left text-xs text-gray-300 font-sans">
                  <thead className="bg-purple-950/40 text-[10px] uppercase font-bold tracking-wider text-purple-400 border-b border-purple-900/20">
                    <tr>
                      <th className="py-3 px-4">Artigo</th>
                      <th className="py-3 px-4">Categoria</th>
                      <th className="py-3 px-4">Métricas</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-900/10">
                    {articles.map(art => {
                      const cat = categories.find(c => c.id === art.categoryId);
                      return (
                        <tr key={art.id} className="hover:bg-purple-950/20 transition-colors">
                          <td className="py-3.5 px-4 max-w-sm">
                            <div className="flex items-center gap-3">
                              <img src={art.image} alt={art.imageAlt} className="h-9 w-12 rounded object-cover shrink-0" />
                              <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-white truncate hover:text-brand-purple cursor-pointer" onClick={() => onArticleClick(art.id)}>{art.title}</span>
                                <span className="text-[10px] text-gray-500 font-mono truncate">{art.author.name} • {new Date(art.createdAt).toLocaleDateString('pt-BR')}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold uppercase tracking-wider text-[10px]" style={{ color: cat?.color }}>
                            {cat?.name || art.categoryId}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px]">
                            <div className="flex flex-col">
                              <span>👁️ {art.views} views</span>
                              <span>💬 {db.getComments(art.id).length} coment.</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleTogglePublish(art)}
                              className={`rounded px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider cursor-pointer ${
                                art.published 
                                  ? 'bg-green-950/40 text-green-400 border border-green-800/20' 
                                  : 'bg-amber-950/40 text-amber-400 border border-amber-800/20'
                              }`}
                              title={art.published ? "Clique para reverter para Rascunho" : "Clique para Publicar Agora"}
                            >
                              {art.published ? 'Publicado' : 'Rascunho'}
                            </button>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleEditArticleClick(art)}
                                className="p-1 text-brand-blue hover:bg-purple-900/20 rounded"
                                title="Editar Artigo"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteArticleClick(art.id)}
                                className="p-1 text-red-400 hover:bg-purple-900/20 rounded"
                                title="Deletar permanentemente"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          ) : (
            
            /* WRITE / EDIT ARTICLE COMPONENT FORM */
            <form onSubmit={handleSaveArticle} className="bg-purple-950/15 border border-purple-900/20 rounded-xl p-5 sm:p-7 flex flex-col gap-6" id="article-crud-form">
              <div className="flex items-center justify-between border-b border-purple-900/20 pb-4 mb-2">
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5 text-brand-purple" />
                  <span>{editingArticleId ? 'Editar Notícia' : 'Criar Nova Notícia'}</span>
                </h3>
                
                <button
                  type="button"
                  onClick={resetArticleForm}
                  className="p-1.5 rounded-full hover:bg-purple-900/30 text-purple-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Grid fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Title */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Título Principal *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="ex: GTA VI quebra recordes em trailers"
                    className="w-full rounded-lg bg-purple-900/20 border border-purple-800/40 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                    id="form-title"
                  />
                </div>

                {/* Subtitle */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Subtítulo explicativo</label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="ex: Análise de cada frame e mecânica revelada..."
                    className="w-full rounded-lg bg-purple-900/20 border border-purple-800/40 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                    id="form-subtitle"
                  />
                </div>

                {/* Cover Image URL */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">URL da Imagem de Capa *</label>
                  <input
                    type="url"
                    required
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full rounded-lg bg-purple-900/20 border border-purple-800/40 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                    id="form-image"
                  />
                </div>

                {/* Category Picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Categoria do Portal *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CategoryId)}
                    className="w-full rounded-lg bg-purple-950 border border-purple-800/40 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                    id="form-category"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Tags (comma separated) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Tags Recomendadas (Separadas por vírgula)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="ex: PlayStation 5, Games, Ray Tracing"
                    className="w-full rounded-lg bg-purple-900/20 border border-purple-800/40 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                    id="form-tags"
                  />
                </div>

                {/* Image alternate text */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Texto Alternativo da Imagem (Acessibilidade)</label>
                  <input
                    type="text"
                    value={formImageAlt}
                    onChange={(e) => setFormImageAlt(e.target.value)}
                    placeholder="Descreva o conteúdo da imagem..."
                    className="w-full rounded-lg bg-purple-900/20 border border-purple-800/40 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                    id="form-image-alt"
                  />
                </div>

              </div>

              {/* Summary */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Resumo da Notícia (SEO e Listas)</label>
                <textarea
                  rows={2}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Escreva um breve resumo chamativo..."
                  className="w-full rounded-lg bg-purple-900/20 border border-purple-800/40 py-2 px-3 text-xs text-white focus:outline-none focus:border-brand-purple resize-none"
                  id="form-summary"
                ></textarea>
              </div>

              {/* Content Markup */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Conteúdo do Artigo (Formatado em Parágrafos) *</label>
                <div className="bg-purple-900/10 border border-purple-800/20 rounded-lg p-2.5 text-[10px] text-gray-400 leading-normal font-sans mb-1">
                  💡 <strong>Dicas de Formatação:</strong> Use parágrafos normais separados por duas quebras de linha para formatar. Comece um parágrafo com <span className="font-mono text-brand-purple">###</span> para criar um Cabeçalho secundário, ou comece com <span className="font-mono text-brand-purple">&gt;</span> para fazer uma citação destacada.
                </div>
                <textarea
                  rows={12}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Escreva a notícia com profundidade..."
                  className="w-full rounded-lg bg-purple-900/20 border border-purple-800/40 py-2.5 px-3 text-xs text-white focus:outline-none focus:border-brand-purple font-sans leading-relaxed"
                  id="form-content"
                ></textarea>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 py-2 border-t border-purple-900/15">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formPublished}
                    onChange={(e) => setFormPublished(e.target.checked)}
                    className="rounded border-purple-800 bg-purple-900/30 text-brand-purple focus:ring-brand-purple h-4 w-4"
                  />
                  <span>Publicar imediatamente (Visível aos leitores)</span>
                </label>
                
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="rounded border-purple-800 bg-purple-900/30 text-brand-purple focus:ring-brand-purple h-4 w-4"
                  />
                  <span className="text-brand-blue">Destacar no Carrossel Inicial</span>
                </label>
              </div>

              {/* Form buttons */}
              <div className="flex items-center gap-3 justify-end border-t border-purple-900/15 pt-5">
                <button
                  type="button"
                  onClick={resetArticleForm}
                  className="rounded-lg border border-purple-800/40 hover:bg-purple-900/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-purple-300 cursor-pointer"
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  className="rounded-lg bg-brand-purple hover:bg-brand-purple/95 text-black px-5 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center gap-1 shadow-md"
                  id="form-submit-btn"
                >
                  <Save className="h-4 w-4" />
                  <span>Salvar Artigo</span>
                </button>
              </div>

            </form>
          )}

        </div>
      )}

      {/* CATEGORIES MANAGER VIEW (TAB) */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" id="tab-categories">
          
          {/* Create Category Form */}
          <div className="lg:col-span-1">
            <form onSubmit={handleCreateCategory} className="bg-purple-950/15 border border-purple-900/20 rounded-xl p-5 flex flex-col gap-4">
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-purple-900/20">
                Nova Categoria
              </h3>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">ID da Categoria *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: hardware"
                  value={newCatId}
                  onChange={(e) => setNewCatId(e.target.value)}
                  className="w-full rounded-lg bg-purple-900/20 border border-purple-800/40 py-2 px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Nome de Exibição *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Hardware"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full rounded-lg bg-purple-900/20 border border-purple-800/40 py-2 px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Cor Identificadora *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    required
                    value={newCatColor}
                    onChange={(e) => setNewCatColor(e.target.value)}
                    className="h-9 w-12 rounded bg-purple-900/20 border border-purple-800/40 p-1 focus:outline-none cursor-pointer"
                  />
                  <span className="font-mono text-xs text-gray-300 uppercase">{newCatColor}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">Descrição Curta *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Hardware de computadores, testes e benchmarking de placas..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full rounded-lg bg-purple-900/20 border border-purple-800/40 py-2 px-3 text-xs text-white focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-brand-purple hover:bg-brand-purple/95 text-black font-bold text-xs py-2 rounded-lg cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar</span>
              </button>
            </form>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
              Categorias Existentes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="bg-purple-950/20 border border-purple-900/20 p-4 rounded-xl flex flex-col gap-2 relative">
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                    <button 
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1 text-red-400 hover:bg-purple-900/20 rounded cursor-pointer"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h4 className="font-display text-base font-bold text-white">{cat.name}</h4>
                  <span className="font-mono text-[9px] text-purple-400">ID: /{cat.id}</span>
                  <p className="text-xs text-gray-400 leading-normal font-sans font-light line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* USERS MANAGER VIEW (TAB) */}
      {activeTab === 'users' && currentUser.role === 'admin' && (
        <div className="flex flex-col gap-6 animate-fade-in font-sans" id="tab-users">
          <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
            Usuários Registrados
          </h3>

          <div className="overflow-x-auto rounded-xl border border-purple-900/20 bg-purple-950/10">
            <table className="w-full border-collapse text-left text-xs text-gray-300">
              <thead className="bg-purple-950/40 text-[10px] uppercase font-bold tracking-wider text-purple-400 border-b border-purple-900/20">
                <tr>
                  <th className="py-3 px-4">Leitor / Colaborador</th>
                  <th className="py-3 px-4">E-mail</th>
                  <th className="py-3 px-4">Inscrição</th>
                  <th className="py-3 px-4">Nível de Acesso</th>
                  <th className="py-3 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/10">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-purple-950/20 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.name)}`} alt={u.name} className="h-7 w-7 rounded-full object-cover" />
                        <span className="font-semibold text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-purple-300">{u.email}</td>
                    <td className="py-3.5 px-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td className="py-3.5 px-4">
                      <button 
                        onClick={() => handleChangeRole(u.id, u.role)}
                        className={`rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider cursor-pointer ${
                          u.role === 'admin' 
                            ? 'bg-purple-950 text-brand-purple border border-brand-purple/30' 
                            : u.role === 'editor' 
                            ? 'bg-purple-950 text-brand-blue border border-brand-blue/30' 
                            : 'bg-purple-950 text-gray-400 border border-purple-900/30'
                        }`}
                        title="Clique para rotacionar nível"
                      >
                        {u.role}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {u.id !== currentUser.id ? (
                        <button 
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-1 text-red-400 hover:bg-purple-900/20 rounded cursor-pointer"
                          title="Banir usuário permanentemente"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-600 italic">Você</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUPABASE CONNECTOR ASSISTANT VIEW (TAB) */}
      {activeTab === 'supabase' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in" id="tab-supabase">
          
          {/* Connector credentials */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSupabaseConnect} className="bg-purple-950/15 border border-purple-900/20 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center gap-1 text-brand-blue">
                <Database className="h-5 w-5" />
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Configuração de API
                </h3>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">SUPABASE_URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://xyz.supabase.co"
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  className="w-full rounded-lg bg-purple-900/20 border border-purple-800/40 py-2 px-3 text-xs text-white focus:outline-none"
                  disabled={isSupabaseConnected}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-purple-400">SUPABASE_ANON_KEY</label>
                <input
                  type="password"
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  className="w-full rounded-lg bg-purple-900/20 border border-purple-800/40 py-2 px-3 text-xs text-white focus:outline-none"
                  disabled={isSupabaseConnected}
                />
              </div>

              {!isSupabaseConnected ? (
                <button
                  type="submit"
                  className="w-full bg-brand-purple hover:bg-brand-purple/95 text-black font-bold text-xs py-2.5 rounded-lg cursor-pointer"
                >
                  Conectar ao Supabase
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 bg-green-950/30 border border-green-800/40 text-green-400 text-xs p-2 rounded-lg font-semibold">
                    <CheckCircle className="h-4 w-4" />
                    <span>Conexão Simulada Ativa!</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsSupabaseConnected(false); setSupabaseUrl(''); setSupabaseKey(''); }}
                    className="w-full bg-red-950/20 border border-red-900/30 text-red-400 font-bold text-xs py-2 rounded-lg"
                  >
                    Desconectar Banco
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Database Setup blueprint schemas checklist instructions */}
          <div className="lg:col-span-2 flex flex-col gap-5 bg-purple-950/10 border border-purple-900/15 p-5 sm:p-6 rounded-xl">
            <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-brand-purple" />
              <span>Instruções de Migração Supabase</span>
            </h3>

            <p className="text-xs text-gray-300 leading-relaxed font-sans font-light">
              Para efetivar a sincronia durável deste portal com o seu projeto real do <strong>Supabase</strong> em produção, execute o seguinte script SQL no <strong>Supabase SQL Editor</strong> para criar as tabelas e índices necessários com URLs amigáveis:
            </p>

            <div className="bg-black/50 p-4 rounded-xl max-h-56 overflow-y-auto font-mono text-[10px] text-purple-200 leading-relaxed">
              {`-- 1. Tabela de Categorias
CREATE TABLE categorias (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(10) DEFAULT '#D946EF'
);

-- 2. Tabela de Artigos
CREATE TABLE artigos (
  id VARCHAR(150) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  summary TEXT,
  content TEXT NOT NULL,
  image VARCHAR(255),
  image_alt VARCHAR(255),
  category_id VARCHAR(50) REFERENCES categorias(id),
  tags TEXT[],
  author_name VARCHAR(100) NOT NULL,
  author_avatar VARCHAR(255),
  author_role VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  read_time INT DEFAULT 5,
  views INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false
);

-- 3. Tabela de Comentários
CREATE TABLE comentarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id VARCHAR(150) REFERENCES artigos(id) ON DELETE CASCADE,
  author_name VARCHAR(100) NOT NULL,
  author_avatar VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  approved BOOLEAN DEFAULT true
);

-- 4. Tabela de Newsletters
CREATE TABLE newsletter_inscritos (
  email VARCHAR(255) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);`}
            </div>

            <div className="flex flex-col gap-2.5 font-sans border-t border-purple-900/20 pt-4 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-brand-blue" />
                <span>Vantagens do Supabase prontas para expansão:</span>
              </span>
              <ul className="list-disc pl-5 flex flex-col gap-1.5 text-gray-400 font-light text-[11px]">
                <li><strong>Row Level Security (RLS)</strong>: Bloqueie a gravação de artigos apenas para usuários autenticados com permissão "admin" no JWT do Supabase.</li>
                <li><strong>Imagens de Capa</strong>: Configure um bucket de Supabase Storage chamado "capas" e faça upload diretamente de arquivos de imagem no formulário de notícias.</li>
                <li><strong>Contagem em tempo real</strong>: Use Supabase Realtime para refletir curtidas e visualizações dinamicamente na página de artigos sem recarregar.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
