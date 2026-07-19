export interface HistoryArticle {
  id: string;
  topic: string;
  tone: string;
  wordCount: string;
  content: string;
  createdAt: string;
}

const STORAGE_KEY = 'scriptai_article_history';

export const getStoredArticles = (): HistoryArticle[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read article history:', err);
    return [];
  }
};

export const saveArticleToHistory = (article: Omit<HistoryArticle, 'id' | 'createdAt'>): HistoryArticle => {
  const articles = getStoredArticles();
  const newItem: HistoryArticle = {
    ...article,
    id: `SAI-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...articles];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save article to history:', err);
  }
  return newItem;
};

export const deleteArticleFromHistory = (id: string): HistoryArticle[] => {
  const articles = getStoredArticles();
  const updated = articles.filter(a => a.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete article from history:', err);
  }
  return updated;
};
