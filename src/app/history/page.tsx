'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Calendar, 
  Download, 
  Trash2, 
  ExternalLink,
  Sparkles,
  BarChart3,
  Clock,
  X,
  Copy,
  Check,
  FileText
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { getStoredArticles, deleteArticleFromHistory, HistoryArticle } from '@/utils/historyStorage';
import jsPDF from 'jspdf';

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState<HistoryArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<HistoryArticle | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = getStoredArticles();
    if (stored.length > 0) {
      setArticles(stored);
    } else {
      // Default sample fallback
      setArticles([
        {
          id: 'SAI-9582',
          topic: 'The Future of AI in Web Development: How Next.js 15 and Server Actions are Revolutionizing App Architecture',
          tone: 'Professional',
          wordCount: '1000',
          createdAt: new Date().toISOString(),
          content: `The Future of AI in Web Development: How Next.js 15 and Server Actions are Revolutionizing App Architecture\n\nThe integration of Artificial Intelligence (AI) into web engineering is transitioning from experimental auto-completers to foundational application structures. Simultaneously, modern React ecosystems are adopting hybrid paradigms where frontends and server environments blend seamlessly. At the intersection of these two trends is Next.js 15, offering a robust infrastructure for developers seeking to deploy fast, scalable, and dynamic AI services.\n\n1. Re-Thinking Backend Boundaries: Server Actions & React Server Components\nPrior to Server Actions, connecting a client interface to an AI service (like a LLM endpoint) required creating separate API routes, validation pipelines, and state handlers. Under the React Server Components (RSC) architecture in Next.js 15, database queries and backend AI requests become as easy as invoking regular TypeScript functions.\n\n2. SEO Optimization in the Age of Conversational Search\nAs traditional search engines morph into conversational engines, keywords alone are insufficient. Today's web crawlers evaluate semantic consistency, text richness, and user-intent matching. Modern article systems must combine speed, accessibility, and high semantic layout standards.`
        },
        {
          id: 'SAI-8431',
          topic: 'Mastering TypeScript 5.5: Clean Coding Practices for Enterprise Applications',
          tone: 'Academic',
          wordCount: '500',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          content: `Mastering TypeScript 5.5: Clean Coding Practices for Enterprise Applications\n\nTypeScript 5.5 introduces major improvements in type inference, performance, and developer ergonomics. For enterprise teams maintaining large codebases, adopting strict type configurations ensures high reliability and maintainability.\n\nKey areas include inferred type predicates, control flow analysis improvements, and speed optimizations during incremental compilation.`
        }
      ]);
    }
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteArticleFromHistory(id);
    setArticles(updated.length > 0 ? updated : []);
    if (selectedArticle?.id === id) {
      setSelectedArticle(null);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const handleDownloadPdf = (article: HistoryArticle) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const text = article.content;
    const title = article.topic;
    const dateStr = new Date(article.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(30, 27, 75);

    const titleLines = doc.splitTextToSize(title, contentWidth);
    doc.text(titleLines, margin, 24);

    let currentY = 24 + titleLines.length * 7;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Published: ${dateStr}  |  Tone: ${article.tone}`, margin, currentY);

    currentY += 5;
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);

    currentY += 10;

    const paragraphs = text.split('\n\n');
    paragraphs.forEach((p) => {
      const clean = p.replace(/^#+\s*/, '').trim();
      if (!clean) return;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);

      const lines = doc.splitTextToSize(clean, contentWidth);
      lines.forEach((line: string) => {
        if (currentY > pageHeight - 22) {
          doc.addPage();
          currentY = 22;
        }
        doc.text(line, margin, currentY);
        currentY += 5;
      });

      currentY += 3;
    });

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 14, pageWidth - margin, pageHeight - 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('ScriptAI Article Generator Platform', margin, pageHeight - 8);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }

    const safeFilename = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    doc.save(`${safeFilename || 'article'}.pdf`);
  };

  const filteredItems = articles.filter(item => 
    item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWords = articles.reduce((acc, curr) => {
    const count = curr.content ? curr.content.trim().split(/\s+/).filter(Boolean).length : 0;
    return acc + count;
  }, 0);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Top Banner Title */}
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
          Article History
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Review, reopen, download, and manage your previously generated articles saved in Local Storage.
        </p>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard hover={false} className="flex items-center gap-4 py-4 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-violet/10 text-brand-violet">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Drafted</p>
            <p className="text-xl font-bold text-white">{articles.length} Articles</p>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="flex items-center gap-4 py-4 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-indigo/10 text-brand-indigo">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total Words</p>
            <p className="text-xl font-bold text-white">{totalWords.toLocaleString()} Words</p>
          </div>
        </GlassCard>

        <GlassCard hover={false} className="flex items-center gap-4 py-4 px-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-emerald/10 text-brand-emerald">
            <Clock className="h-5 w-5 animate-pulse-slow" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Local Storage</p>
            <p className="text-xl font-bold text-brand-emerald">Active & Synced</p>
          </div>
        </GlassCard>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute top-3.5 left-4 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search generated drafts by topic or keyword..."
            className="glass-input w-full rounded-xl pl-11 pr-4 py-3 text-sm placeholder:text-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const wordCountNum = item.content ? item.content.trim().split(/\s+/).filter(Boolean).length : 0;
            const dateDisplay = new Date(item.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <GlassCard key={item.id} className="relative overflow-hidden cursor-pointer hover:border-brand-violet/40 transition-all" onClick={() => setSelectedArticle(item)}>
                {/* Vertical line indicator */}
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-brand-indigo to-brand-violet" />
                
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  {/* Meta details */}
                  <div className="space-y-1.5 pl-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-semibold text-brand-violet uppercase">
                        {item.id}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3.5 w-3.5 text-gray-500" />
                        <span>{dateDisplay}</span>
                      </div>
                    </div>

                    <h3 className="font-display text-base font-bold text-white hover:text-brand-violet transition-colors line-clamp-1">
                      {item.topic}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                      <p>Tone: <span className="font-medium text-gray-300">{item.tone}</span></p>
                      <p>Word Count: <span className="font-medium text-gray-300">{wordCountNum} words</span></p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button variant="secondary" onClick={() => setSelectedArticle(item)} className="flex items-center gap-1.5 !px-4 !py-2 text-xs">
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Reopen</span>
                    </Button>
                    <Button variant="ghost" onClick={(e) => { e.stopPropagation(); handleDownloadPdf(item); }} className="!p-2 h-9 w-9 border border-glass rounded-lg" title="Download PDF">
                      <Download className="h-3.5 w-3.5 text-gray-400 hover:text-white" />
                    </Button>
                    <Button variant="ghost" onClick={(e) => handleDelete(item.id, e)} className="!p-2 h-9 w-9 border border-brand-rose/20 rounded-lg hover:bg-brand-rose/10" title="Delete Draft">
                      <Trash2 className="h-3.5 w-3.5 text-brand-rose" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-glass p-12 text-center">
            <History className="mx-auto h-8 w-8 text-gray-600 mb-3" />
            <p className="text-sm font-semibold text-gray-400">No matching article history found</p>
            <p className="text-xs text-gray-600 mt-1">Generate a new article on the Home tab or refine your search keyword.</p>
          </div>
        )}
      </div>

      {/* Reopen Article Glass Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-deep/80 backdrop-blur-md">
          <GlassCard className="w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden relative border-brand-violet/40">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-glass pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-violet/10 text-brand-violet">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-brand-violet">{selectedArticle.id}</span>
                  <h3 className="font-display font-bold text-white text-base">Reopened Draft</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => handleCopy(selectedArticle.content)} className="!px-3 !py-1.5 h-8 border border-glass rounded-lg text-xs gap-1.5">
                  {copied ? <Check className="h-3.5 w-3.5 text-brand-emerald" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </Button>
                <Button variant="ghost" onClick={() => handleDownloadPdf(selectedArticle)} className="!px-3 !py-1.5 h-8 border border-glass rounded-lg text-xs gap-1.5">
                  <Download className="h-3.5 w-3.5 text-brand-violet" />
                  <span>PDF</span>
                </Button>
                <button onClick={() => setSelectedArticle(null)} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Article Content Viewer */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-sm leading-relaxed text-gray-200">
              <h2 className="font-display text-xl font-bold text-white">{selectedArticle.topic}</h2>
              <div className="flex items-center gap-3 text-xs text-gray-400 border-b border-glass pb-3">
                <span>Tone: <strong className="text-gray-200">{selectedArticle.tone}</strong></span>
                <span>•</span>
                <span>Target: <strong className="text-gray-200">{selectedArticle.wordCount} words</strong></span>
              </div>
              <div className="whitespace-pre-wrap text-gray-300 pt-2">
                {selectedArticle.content}
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
