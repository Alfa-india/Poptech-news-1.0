/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Article, Category, PortalComment, UserProfile, Tag, PortalStats, CategoryId, PortalFeedback } from '../types';
import { initialArticles, categories, initialTags, initialComments } from '../data/mockArticles';

// Default mock profiles
const defaultProfiles: UserProfile[] = [
  {
    id: 'admin-1',
    email: 'admin@poptechnews.com',
    name: 'Admin Principal',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-01-01T12:00:00Z'
  },
  {
    id: 'admin-2',
    email: 'alissonrodrigues31122006@gmail.com',
    name: 'Alisson Rodrigues',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-06-29T06:55:00Z'
  },
  {
    id: 'editor-1',
    email: 'editor@poptechnews.com',
    name: 'Sofia Alencar',
    role: 'editor',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-02-15T09:00:00Z'
  },
  {
    id: 'sub-1',
    email: 'leitor@gmail.com',
    name: 'Carlos Santos',
    role: 'subscriber',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    createdAt: '2026-03-10T14:30:00Z'
  }
];

class LocalDatabase {
  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem('poptech_articles')) {
      localStorage.setItem('poptech_articles', JSON.stringify(initialArticles));
    }
    if (!localStorage.getItem('poptech_categories')) {
      localStorage.setItem('poptech_categories', JSON.stringify(categories));
    }
    if (!localStorage.getItem('poptech_tags')) {
      localStorage.setItem('poptech_tags', JSON.stringify(initialTags));
    }
    if (!localStorage.getItem('poptech_comments')) {
      localStorage.setItem('poptech_comments', JSON.stringify(initialComments));
    }
    if (!localStorage.getItem('poptech_users')) {
      localStorage.setItem('poptech_users', JSON.stringify(defaultProfiles));
    }
    if (!localStorage.getItem('poptech_subscribers')) {
      localStorage.setItem('poptech_subscribers', JSON.stringify(['leitor@gmail.com', 'teste@poptech.com']));
    }
    if (!localStorage.getItem('poptech_views_count')) {
      localStorage.setItem('poptech_views_count', '18320');
    }
  }

  // --- AUTH METHODS ---
  signUp(email: string, name: string, role: 'admin' | 'editor' | 'subscriber' = 'subscriber'): UserProfile {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('E-mail já cadastrado.');
    }

    const newUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      name,
      role,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('poptech_users', JSON.stringify(users));
    this.setCurrentUser(newUser);
    return newUser;
  }

  signIn(email: string): UserProfile {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // For developer convenience, let's auto-create subscriber if not exist or throw error for admin credentials
      if (email.toLowerCase().includes('admin') || email === 'alissonrodrigues31122006@gmail.com') {
        // Find existing or auto-create the admin
        const adminEmail = email.toLowerCase();
        let targetAdmin = users.find(u => u.email === adminEmail);
        if (!targetAdmin) {
          targetAdmin = {
            id: 'usr_admin_auto',
            email: adminEmail,
            name: adminEmail === 'alissonrodrigues31122006@gmail.com' ? 'Alisson Rodrigues' : 'Administrador',
            role: 'admin',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            createdAt: new Date().toISOString()
          };
          users.push(targetAdmin);
          localStorage.setItem('poptech_users', JSON.stringify(users));
        }
        this.setCurrentUser(targetAdmin);
        return targetAdmin;
      }
      throw new Error('Usuário não encontrado. Registre-se primeiro ou use "admin@poptechnews.com" para testar o Painel.');
    }
    this.setCurrentUser(user);
    return user;
  }

  signInOrUpWithGoogle(email: string, name: string, avatar: string): UserProfile {
    const users = this.getUsers();
    const normalizedEmail = email.toLowerCase();
    let user = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (user) {
      // Link Google if not already connected
      user.googleConnected = true;
      user.googleEmail = normalizedEmail;
      if (!user.avatar) {
        user.avatar = avatar;
      }
    } else {
      // Auto-register new Google user
      const isSystemAdmin = normalizedEmail === 'alissonrodrigues31122006@gmail.com' || normalizedEmail.includes('admin@poptechnews.com');
      user = {
        id: isSystemAdmin ? 'usr_admin_auto' : 'usr_' + Math.random().toString(36).substr(2, 9),
        email: normalizedEmail,
        name,
        role: isSystemAdmin ? 'admin' : 'subscriber',
        avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
        createdAt: new Date().toISOString(),
        googleConnected: true,
        googleEmail: normalizedEmail
      };
      users.push(user);
    }

    localStorage.setItem('poptech_users', JSON.stringify(users));
    this.setCurrentUser(user);
    return user;
  }

  linkGoogleAccount(userId: string, googleEmail: string): UserProfile {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado.');
    }

    // Check if googleEmail is already connected to another user
    const otherUser = users.find(u => u.id !== userId && u.googleEmail?.toLowerCase() === googleEmail.toLowerCase());
    if (otherUser) {
      throw new Error('Esta conta do Google já está vinculada a outro usuário do portal.');
    }

    users[userIndex].googleConnected = true;
    users[userIndex].googleEmail = googleEmail.toLowerCase();
    
    localStorage.setItem('poptech_users', JSON.stringify(users));
    
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(users[userIndex]);
    }
    return users[userIndex];
  }

  unlinkGoogleAccount(userId: string): UserProfile {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado.');
    }

    users[userIndex].googleConnected = false;
    delete users[userIndex].googleEmail;

    localStorage.setItem('poptech_users', JSON.stringify(users));
    
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(users[userIndex]);
    }
    return users[userIndex];
  }

  updateUserAvatar(userId: string, avatarDataUrl: string): UserProfile {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado.');
    }

    users[userIndex].avatar = avatarDataUrl;

    localStorage.setItem('poptech_users', JSON.stringify(users));
    
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(users[userIndex]);
    }
    return users[userIndex];
  }

  signOut() {
    localStorage.removeItem('poptech_current_user');
    
    // Revogar sessão e limpar tokens de autenticação do Supabase
    localStorage.removeItem('supabase.auth.token');
    
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('sb-') || key.includes('supabase'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (e) {
      console.warn('Erro ao revogar sessão e limpar tokens do Supabase:', e);
    }
  }

  getCurrentUser(): UserProfile | null {
    const userStr = localStorage.getItem('poptech_current_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private setCurrentUser(user: UserProfile) {
    localStorage.setItem('poptech_current_user', JSON.stringify(user));
  }

  private checkRole(allowedRoles: ('admin' | 'editor')[]) {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('Acesso negado: Usuário não autenticado no portal.');
    }
    if (!allowedRoles.includes(user.role as any)) {
      throw new Error(`Acesso negado: Seu nível de acesso (${user.role}) não tem permissão para realizar esta operação.`);
    }
  }

  getUsers(): UserProfile[] {
    const usersStr = localStorage.getItem('poptech_users');
    return usersStr ? JSON.parse(usersStr) : defaultProfiles;
  }

  deleteUser(id: string) {
    this.checkRole(['admin']);
    const currentUser = this.getCurrentUser();
    
    // Prevent self deletion
    if (currentUser && currentUser.id === id) {
      throw new Error('Segurança: Você não pode auto-excluir sua própria conta administrativa.');
    }

    const users = this.getUsers();
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete) {
      // Protection for primary admin
      if (userToDelete.email === 'alissonrodrigues31122006@gmail.com') {
        throw new Error('Crítico: A conta do Administrador Primário (Alisson Rodrigues) é protegida pelo sistema e não pode ser deletada.');
      }
      
      const filtered = users.filter(u => u.id !== id);
      localStorage.setItem('poptech_users', JSON.stringify(filtered));
    }
  }

  updateUserRole(id: string, role: 'admin' | 'editor' | 'subscriber') {
    this.checkRole(['admin']);
    
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      // Protection for primary admin
      if (users[index].email === 'alissonrodrigues31122006@gmail.com') {
        throw new Error('Crítico: O nível de acesso do Administrador Primário (Alisson Rodrigues) é protegido e não pode ser rebaixado.');
      }
      
      users[index].role = role;
      localStorage.setItem('poptech_users', JSON.stringify(users));
    }
  }

  // --- ARTICLES ---
  getArticles(includeDrafts = false): Article[] {
    const artStr = localStorage.getItem('poptech_articles');
    const articles: Article[] = artStr ? JSON.parse(artStr) : [];
    
    // Sort chronologically (newest first)
    const sorted = articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (includeDrafts) {
      return sorted;
    }
    return sorted.filter(a => a.published);
  }

  getArticleById(id: string): Article | null {
    const articles = this.getArticles(true);
    return articles.find(a => a.id === id) || null;
  }

  createArticle(articleData: Omit<Article, 'id' | 'views' | 'createdAt'>): Article {
    this.checkRole(['admin', 'editor']);
    const articles = this.getArticles(true);
    
    // Create SEO friendly URL-friendly slug as ID
    const baseId = articleData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    
    const uniqueId = `${baseId}-${Math.floor(Math.random() * 1000)}`;

    const newArticle: Article = {
      ...articleData,
      id: uniqueId,
      views: 0,
      createdAt: new Date().toISOString()
    };

    articles.push(newArticle);
    localStorage.setItem('poptech_articles', JSON.stringify(articles));
    return newArticle;
  }

  updateArticle(id: string, updatedFields: Partial<Article>): Article {
    this.checkRole(['admin', 'editor']);
    const articles = this.getArticles(true);
    const index = articles.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Artigo não encontrado');
    }

    const updated: Article = {
      ...articles[index],
      ...updatedFields
    };

    articles[index] = updated;
    localStorage.setItem('poptech_articles', JSON.stringify(articles));
    return updated;
  }

  deleteArticle(id: string) {
    this.checkRole(['admin', 'editor']);
    const articles = this.getArticles(true);
    const filtered = articles.filter(a => a.id !== id);
    localStorage.setItem('poptech_articles', JSON.stringify(filtered));
  }

  incrementViews(id: string) {
    const articles = this.getArticles(true);
    const index = articles.findIndex(a => a.id === id);
    if (index !== -1) {
      articles[index].views += 1;
      localStorage.setItem('poptech_articles', JSON.stringify(articles));
      
      // Increment global views count
      const totalViews = parseInt(localStorage.getItem('poptech_views_count') || '18320', 10);
      localStorage.setItem('poptech_views_count', (totalViews + 1).toString());
    }
  }

  // --- CATEGORIES ---
  getCategories(): Category[] {
    const catStr = localStorage.getItem('poptech_categories');
    return catStr ? JSON.parse(catStr) : categories;
  }

  createCategory(category: Category): Category {
    this.checkRole(['admin', 'editor']);
    const cats = this.getCategories();
    if (cats.some(c => c.id === category.id)) {
      throw new Error('ID de categoria já existe.');
    }
    cats.push(category);
    localStorage.setItem('poptech_categories', JSON.stringify(cats));
    return category;
  }

  updateCategory(id: CategoryId, name: string, description: string, color: string): Category {
    this.checkRole(['admin', 'editor']);
    const cats = this.getCategories();
    const index = cats.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Categoria não encontrada.');
    }
    cats[index] = { id, name, description, color };
    localStorage.setItem('poptech_categories', JSON.stringify(cats));
    return cats[index];
  }

  deleteCategory(id: CategoryId) {
    this.checkRole(['admin', 'editor']);
    const cats = this.getCategories();
    const filtered = cats.filter(c => c.id !== id);
    localStorage.setItem('poptech_categories', JSON.stringify(filtered));
  }

  // --- TAGS ---
  getTags(): Tag[] {
    const tagsStr = localStorage.getItem('poptech_tags');
    return tagsStr ? JSON.parse(tagsStr) : initialTags;
  }

  createTag(name: string): Tag {
    const tags = this.getTags();
    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9-]/g, '-');
    
    const existing = tags.find(t => t.slug === slug);
    if (existing) return existing;

    const newTag: Tag = {
      id: 'tag_' + Math.random().toString(36).substr(2, 9),
      name,
      slug
    };

    tags.push(newTag);
    localStorage.setItem('poptech_tags', JSON.stringify(tags));
    return newTag;
  }

  // --- COMMENTS ---
  getComments(articleId?: string): PortalComment[] {
    const comStr = localStorage.getItem('poptech_comments');
    const comments: PortalComment[] = comStr ? JSON.parse(comStr) : [];
    
    // Sort by newest first
    const sorted = comments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (articleId) {
      return sorted.filter(c => c.articleId === articleId);
    }
    return sorted;
  }

  createComment(articleId: string, authorName: string, content: string): PortalComment {
    const comments = this.getComments();
    const newComment: PortalComment = {
      id: 'com_' + Math.random().toString(36).substr(2, 9),
      articleId,
      authorName,
      authorAvatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(authorName)}`,
      content,
      createdAt: new Date().toISOString(),
      approved: true // Approved by default for smooth demonstration
    };

    comments.push(newComment);
    localStorage.setItem('poptech_comments', JSON.stringify(comments));
    return newComment;
  }

  deleteComment(id: string) {
    const comments = this.getComments();
    const filtered = comments.filter(c => c.id !== id);
    localStorage.setItem('poptech_comments', JSON.stringify(filtered));
  }

  approveComment(id: string, approved: boolean) {
    const comments = this.getComments();
    const index = comments.findIndex(c => c.id === id);
    if (index !== -1) {
      comments[index].approved = approved;
      localStorage.setItem('poptech_comments', JSON.stringify(comments));
    }
  }

  // --- NEWSLETTER SUBSCRIBERS ---
  getSubscribers(): string[] {
    const subStr = localStorage.getItem('poptech_subscribers');
    return subStr ? JSON.parse(subStr) : [];
  }

  subscribeNewsletter(email: string): boolean {
    const subs = this.getSubscribers();
    const cleaned = email.toLowerCase().trim();
    if (subs.includes(cleaned)) {
      return false; // Already subscribed
    }
    subs.push(cleaned);
    localStorage.setItem('poptech_subscribers', JSON.stringify(subs));
    return true;
  }

  // --- FEEDBACKS ---
  private _getFeedbacks(): PortalFeedback[] {
    const feedStr = localStorage.getItem('poptech_feedbacks');
    const feedbacks: PortalFeedback[] = feedStr ? JSON.parse(feedStr) : [];
    return feedbacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getFeedbacks(): PortalFeedback[] {
    this.checkRole(['admin', 'editor']);
    return this._getFeedbacks();
  }

  createFeedback(
    name: string,
    email: string,
    type: 'sugestao' | 'elogio' | 'critica' | 'bug' | 'outro',
    message: string
  ): PortalFeedback {
    const feedbacks = this._getFeedbacks();
    const newFeedback: PortalFeedback = {
      id: 'feed_' + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      type,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'pendente'
    };

    feedbacks.push(newFeedback);
    localStorage.setItem('poptech_feedbacks', JSON.stringify(feedbacks));
    return newFeedback;
  }

  deleteFeedback(id: string) {
    this.checkRole(['admin']);
    const feedbacks = this._getFeedbacks();
    const filtered = feedbacks.filter(f => f.id !== id);
    localStorage.setItem('poptech_feedbacks', JSON.stringify(filtered));
  }

  updateFeedbackStatus(id: string, status: 'pendente' | 'lido' | 'arquivado') {
    this.checkRole(['admin', 'editor']);
    const feedbacks = this._getFeedbacks();
    const index = feedbacks.findIndex(f => f.id === id);
    if (index !== -1) {
      feedbacks[index].status = status;
      localStorage.setItem('poptech_feedbacks', JSON.stringify(feedbacks));
    }
  }

  // --- STATS ENGINE ---
  getPortalStats(): PortalStats {
    const articles = this.getArticles(true);
    const comments = this.getComments();
    const subs = this.getSubscribers();
    const globalViews = parseInt(localStorage.getItem('poptech_views_count') || '18320', 10);
    
    const cats = this.getCategories();
    const distribution = cats.map(c => {
      const count = articles.filter(a => a.categoryId === c.id).length;
      return {
        name: c.name,
        value: count,
        color: c.color
      };
    }).filter(item => item.value > 0);

    // Dynamic views over time for chart (past 7 days)
    const viewsOverTime = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      // Base seed views + randomized variation
      const baseVal = Math.floor(globalViews / 35) + Math.floor(Math.sin(i) * 120);
      return {
        date: dateStr,
        views: Math.max(100, baseVal)
      };
    });

    return {
      totalViews: globalViews,
      totalArticles: articles.length,
      totalComments: comments.length,
      totalSubscribers: subs.length,
      categoryDistribution: distribution,
      viewsOverTime
    };
  }
}

export const db = new LocalDatabase();
export default db;
