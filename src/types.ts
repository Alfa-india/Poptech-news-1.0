/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategoryId = 'tecnologia' | 'ia' | 'games' | 'filmes' | 'series' | 'animes' | 'mangas' | 'hqs';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface PortalComment {
  id: string;
  articleId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string; // Markdown or Rich Text
  summary: string;
  image: string;
  imageAlt: string;
  categoryId: CategoryId;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  createdAt: string;
  readTime: number; // in minutes
  views: number;
  published: boolean;
  featured?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'subscriber';
  createdAt: string;
  googleConnected?: boolean;
  googleEmail?: string;
}

export interface PortalFeedback {
  id: string;
  name: string;
  email: string;
  type: 'sugestao' | 'elogio' | 'critica' | 'bug' | 'outro';
  message: string;
  createdAt: string;
  status: 'pendente' | 'lido' | 'arquivado';
}

export interface ViewState {
  currentView: 'home' | 'category' | 'article' | 'admin' | 'privacy' | 'terms' | 'feedback';
  activeCategory?: CategoryId;
  activeArticleId?: string;
}

export interface PortalStats {
  totalViews: number;
  totalArticles: number;
  totalComments: number;
  totalSubscribers: number;
  categoryDistribution: { name: string; value: number; color: string }[];
  viewsOverTime: { date: string; views: number }[];
}
