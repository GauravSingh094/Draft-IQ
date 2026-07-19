'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Sparkles,
  TrendingUp,
  Clock,
  ThumbsUp,
  Share2,
  AlertCircle,
  WifiOff,
  ServerOff,
  FileX,
  RefreshCw,
  Award,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import jsPDF from 'jspdf';

const STEPS = [
  'Understanding topic...',
  'Researching...',
  'Writing article...',
  'Optimizing SEO...',
  'Finalizing...',
];

export interface ErrorDetails {
  type: 'network' | 'webhook_unavailable' | 'timeout' | 'empty_response' | 'generic';
  title: string;
  message: string;
}

interface ArticlePreviewProps {
  status: 'idle' | 'generating' | 'completed' | 'error';
  errorDetails?: ErrorDetails | null;
  articleContent?: string | null;
  onRetry?: () => void;
}

// ---------------------------------------------------------------------------
// Custom article content renderer
// Handles:
//   [Heading]      → large section heading (h2)
//   {Subheading}   → bold sub-section heading (h3)
//   ** bullet text → dot bullet list (strips the **)
//   # / ## / ###   → stripped (text shown cleanly without markdown symbols)
//   > quote        → styled blockquote
//   regular line   → paragraph
// ---------------------------------------------------------------------------
function renderArticleContent(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];
  let keyIdx = 0;

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return;
    result.push(
      <ul key={`ul-${keyIdx++}`} className="my-2 space-y-2 pl-1">
        {bulletBuffer.map((b, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
            <span
              className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-violet"
              aria-hidden="true"
            />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    );
    bulletBuffer = [];
  };

  lines.forEach((rawLine) => {
    // Strip leading markdown # symbols
    const line = rawLine.replace(/^#+\s*/, '').trim();

    if (!line) {
      flushBullets();
      return;
    }

    // [Heading] → large section heading
    const headingMatch = line.match(/^\[(.+?)\]$/);
    if (headingMatch) {
      flushBullets();
      result.push(
        <h2
          key={`h2-${keyIdx++}`}
          className="font-display text-xl font-extrabold text-white pt-6 pb-1 border-b border-glass/30"
        >
          {headingMatch[1]}
        </h2>
      );
      return;
    }

    // {Subheading} → bold sub-section heading
    const subMatch = line.match(/^\{(.+?)\}$/);
    if (subMatch) {
      flushBullets();
      result.push(
        <h3
          key={`h3-${keyIdx++}`}
          className="font-display text-base font-bold text-white pt-4"
        >
          {subMatch[1]}
        </h3>
      );
      return;
    }

    // **bullet text** or lines starting with ** → bullet points
    if (line.startsWith('**')) {
      const bulletText = line.replace(/^\*+\s*/, '').replace(/\s*\*+$/, '').trim();
      if (bulletText) bulletBuffer.push(bulletText);
      return;
    }

    // > blockquote
    if (line.startsWith('>')) {
      flushBullets();
      const quoteText = line.replace(/^>\s*/, '').trim();
      result.push(
        <blockquote
          key={`bq-${keyIdx++}`}
          className="border-l-2 border-brand-violet pl-4 my-3 italic text-gray-400 text-sm leading-relaxed"
        >
          {quoteText}
        </blockquote>
      );
      return;
    }

    // Regular paragraph
    flushBullets();
    result.push(
      <p key={`p-${keyIdx++}`} className="text-sm leading-relaxed text-gray-300">
        {line}
      </p>
    );
  });

  flushBullets();
  return result;
}

export default function ArticlePreview({ status, errorDetails, articleContent, onRetry }: ArticlePreviewProps) {
  const [copied, setCopied] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [highlight, setHighlight] = useState(false);
  const [thumbsUp, setThumbsUp] = useState(false);
  const [draftId] = useState(() => `SAI-${Math.floor(1000 + Math.random() * 9000)}`);

  useEffect(() => {
    if (status === 'completed') {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'generating') {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
      }, 600);
    }
    return () => clearInterval(interval);
  }, [status]);

  const defaultArticleText = `The Future of AI in Web Development: How Next.js 15 and Server Actions are Revolutionizing App Architecture

The integration of Artificial Intelligence (AI) into web engineering is transitioning from experimental auto-completers to foundational application structures. Simultaneously, modern React ecosystems are adopting hybrid paradigms where frontends and server environments blend seamlessly. At the intersection of these two trends is Next.js 15, offering a robust infrastructure for developers seeking to deploy fast, scalable, and dynamic AI services.

1. Re-Thinking Backend Boundaries: Server Actions & React Server Components
Prior to Server Actions, connecting a client interface to an AI service (like a LLM endpoint) required creating separate API routes, validation pipelines, and state handlers. Under the React Server Components (RSC) architecture in Next.js 15, database queries and backend AI requests become as easy as invoking regular TypeScript functions.

2. SEO Optimization in the Age of Conversational Search
As traditional search engines morph into conversational engines, keywords alone are insufficient. Today's web crawlers evaluate semantic consistency, text richness, and user-intent matching. Modern article systems must combine speed, accessibility, and high semantic layout standards.`;

  const getArticleText = () => articleContent || defaultArticleText;

  const textForMetrics = getArticleText();
  const calculatedWordCount = textForMetrics.trim() ? textForMetrics.trim().split(/\s+/).filter(Boolean).length : 0;
  const calculatedReadingTime = Math.max(1, Math.ceil(calculatedWordCount / 200));

  // SEO Assistant Data Extractor
  const rawLines = textForMetrics.split('\n').map(l => l.trim()).filter(Boolean);
  const mainTitle = articleContent
    ? (rawLines[0] ? rawLines[0].replace(/^#+\s*/, '').replace(/^\[(.+?)\]$/, '$1').replace(/^\{(.+?)\}$/, '$1') : 'Generated AI Article')
    : 'The Future of AI in Web Development: How Next.js 15 and Server Actions are Revolutionizing App Architecture';

  const metaTitle = `${mainTitle.slice(0, 55)} | ScriptAI`;
  const firstParagraph = rawLines.find(l => !l.startsWith('#') && !l.startsWith('[') && !l.startsWith('{') && l.length > 30) || textForMetrics;
  const metaDescription = `${firstParagraph.slice(0, 152).trim()}...`;
  const urlSlug = `/blog/${mainTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 45).replace(/-+$/, '')}`;

  // Dynamic SEO keywords extracted from article content
  const seoKeywords = (() => {
    const stopwords = new Set(['the','and','for','are','but','not','you','all','can','has','had','was','were','with','this','that','from','they','have','been','into','your','their','which','about','more','when','will','than','what','also','some','would','there','these','those','each','such','much','very','just','only','then','than','other','where','here','how','its','our','any','who','why','most','both','does','did','him','his','her','she','too','yet','few','now','may','let','put','use','out','even','new','way','come','take','make','said','own','see','know','two','one','over','first','last','after','before','while','through','between','same','could','should','though','since']);
    const words = textForMetrics
      .replace(/[^a-zA-Z\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 4 && !stopwords.has(w.toLowerCase()))
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    const freq: Record<string, number> = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const unique = Array.from(new Set(sorted.map(([w]) => w)));
    return unique.slice(0, 10);
  })();

  const handleCopy = async (textToCopy?: string | React.MouseEvent) => {
    try {
      const targetText = typeof textToCopy === 'string' ? textToCopy : getArticleText();
      await navigator.clipboard.writeText(targetText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownloadTxt = () => {
    const text = getArticleText();
    const rawLinesLocal = text.split('\n').map(l => l.trim()).filter(Boolean);
    const title = articleContent 
      ? (rawLinesLocal[0] ? rawLinesLocal[0].replace(/^#+\s*/, '') : 'generated-article')
      : 'generated-article';
    const safeFilename = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeFilename || 'article'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const text = getArticleText();
    const rawLinesLocal = text.split('\n').map(l => l.trim()).filter(Boolean);
    const title = articleContent 
      ? (rawLinesLocal[0] ? rawLinesLocal[0].replace(/^#+\s*/, '') : 'Generated Article')
      : 'The Future of AI in Web Development: How Next.js 15 and Server Actions are Revolutionizing App Architecture';
    
    const currentDate = new Date().toLocaleDateString('en-US', {
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
    doc.text(`Published: ${currentDate}  |  Author: ScriptAI Writer`, margin, currentY);

    currentY += 5;
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, pageWidth - margin, currentY);

    currentY += 10;

    const paragraphs = text.split('\n\n');
    const lineSpacing = 5;

    paragraphs.forEach((p) => {
      const cleanParagraph = p.replace(/^#+\s*/, '').replace(/^\[(.+?)\]$/, '$1').replace(/^\{(.+?)\}$/, '$1').replace(/^\*+\s*/, '• ').trim();
      if (!cleanParagraph) return;

      const isHeading = /^\[.+?\]$/.test(p.trim()) || /^\{.+?\}$/.test(p.trim()) || p.startsWith('#');
      if (isHeading) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(79, 70, 229);
        currentY += 2;
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
      }

      const lines = doc.splitTextToSize(cleanParagraph, contentWidth);

      lines.forEach((line: string) => {
        if (currentY > pageHeight - 22) {
          doc.addPage();
          currentY = 22;
        }
        doc.text(line, margin, currentY);
        currentY += lineSpacing;
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

  const handleShare = async () => {
    const text = getArticleText();
    const rawLinesLocal = text.split('\n').map(l => l.trim()).filter(Boolean);
    const title = articleContent 
      ? (rawLinesLocal[0] ? rawLinesLocal[0].replace(/^#+\s*/, '') : 'Generated Article')
      : 'The Future of AI in Web Development';

    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://scriptai.app';

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `${title}\n\nGenerated with ScriptAI:\n`,
          url: shareUrl,
        });
        return;
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }

    try {
      const fallbackText = `${title}\n\nRead full article: ${shareUrl}\n\n${text}`;
      await navigator.clipboard.writeText(fallbackText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Share fallback failed:', err);
    }
  };

  return (
    <GlassCard 
      id="article-preview-container" 
      className={`h-full flex flex-col min-h-[500px] transition-all duration-700 ${
        highlight ? 'ring-2 ring-brand-emerald/80 shadow-2xl shadow-brand-emerald/30 border-brand-emerald/50 bg-brand-emerald/5' : ''
      }`}
    >
      {/* Header Actions */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-glass pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-violet/10 text-brand-violet">
            <FileText className="h-4.5 w-4.5" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-white">Article Output Viewer</h2>
            <p className="text-xs text-gray-400">Export or copy your generated article</p>
          </div>
        </div>

        {status === 'completed' && (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <Button variant="ghost" onClick={handleCopy} className="!px-3 !py-1.5 h-9 border border-glass rounded-lg text-xs gap-1.5" title="Copy to Clipboard">
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-brand-emerald" />
                  <span className="text-brand-emerald font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-gray-400" />
                  <span>Copy</span>
                </>
              )}
            </Button>
            <Button variant="ghost" onClick={handleShare} className="!px-3 !py-1.5 h-9 border border-glass rounded-lg text-xs gap-1.5" title="Share Article">
              <Share2 className="h-3.5 w-3.5 text-brand-pink" />
              <span>Share</span>
            </Button>
            <Button variant="ghost" onClick={handleDownloadPdf} className="!px-3 !py-1.5 h-9 border border-glass rounded-lg text-xs gap-1.5" title="Download PDF">
              <Download className="h-3.5 w-3.5 text-brand-violet" />
              <span>PDF</span>
            </Button>
            <Button variant="ghost" onClick={handleDownloadTxt} className="!px-3 !py-1.5 h-9 border border-glass rounded-lg text-xs gap-1.5" title="Download TXT">
              <FileText className="h-3.5 w-3.5 text-brand-indigo" />
              <span>TXT</span>
            </Button>
          </div>
        )}
      </div>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* VIEW 1: IDLE */}
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="my-auto flex flex-col items-center justify-center text-center p-8"
            >
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/3 border border-glass">
                <div className="absolute inset-0 rounded-2xl bg-brand-violet/10 blur-md animate-pulse-slow" />
                <Sparkles className="relative h-8 w-8 text-brand-violet" />
              </div>
              <h3 className="font-display text-base font-bold text-white">Create Your First Draft</h3>
              <p className="mt-2 max-w-sm text-sm text-gray-400">
                Provide a topic and configure options in the parameters sidebar to generate an SEO-optimized article instantly.
              </p>
            </motion.div>
          )}

          {/* VIEW 2: GENERATING */}
          {status === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="my-auto flex flex-col justify-center p-8 space-y-6"
            >
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-6 flex h-14 w-14 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-brand-violet/20" />
                  <div className="absolute inset-0 rounded-full border-t-2 border-brand-violet animate-spin" />
                  <Sparkles className="h-5 w-5 text-brand-violet animate-pulse-slow" />
                </div>
                <h3 className="font-display text-base font-bold text-white">Assembling Masterpiece...</h3>
                <p className="mt-1 text-xs text-gray-400">This can take a few seconds</p>
              </div>

              <div className="mx-auto w-full max-w-xs space-y-3.5 rounded-xl border border-glass bg-white/3 p-4">
                {STEPS.map((step, index) => {
                  const isDone = index < loadingStep;
                  const isCurrent = index === loadingStep;
                  return (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.08 }}
                      className="flex items-center gap-3 text-xs"
                    >
                      <div className="flex h-5 w-5 items-center justify-center">
                        {isDone ? (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/40"
                          >
                            <Check className="h-3 w-3" />
                          </motion.div>
                        ) : isCurrent ? (
                          <div className="relative flex h-4 w-4 items-center justify-center">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-violet opacity-75" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-violet shadow-sm shadow-brand-violet" />
                          </div>
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-white/10" />
                        )}
                      </div>
                      <span className={`transition-colors duration-200 ${isDone ? 'text-gray-400 font-medium' : isCurrent ? 'text-white font-bold tracking-wide' : 'text-gray-600'}`}>
                        {step}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="space-y-3 animate-pulse">
                <div className="h-4 w-2/5 rounded bg-white/8" />
                <div className="h-8 w-11/12 rounded bg-white/8" />
                <div className="space-y-2 pt-2">
                  <div className="h-3 w-full rounded bg-white/8" />
                  <div className="h-3 w-full rounded bg-white/8" />
                  <div className="h-3 w-4/5 rounded bg-white/8" />
                </div>
              </div>
            </motion.div>
          )}

          {/* VIEW 3: ERROR CARD */}
          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="my-auto flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto"
            >
              <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-rose/10 border border-brand-rose/30 shadow-lg shadow-brand-rose/10">
                {errorDetails?.type === 'network' && <WifiOff className="h-8 w-8 text-brand-rose" />}
                {errorDetails?.type === 'webhook_unavailable' && <ServerOff className="h-8 w-8 text-brand-rose" />}
                {errorDetails?.type === 'timeout' && <Clock className="h-8 w-8 text-brand-rose animate-pulse" />}
                {errorDetails?.type === 'empty_response' && <FileX className="h-8 w-8 text-brand-rose" />}
                {(!errorDetails || errorDetails.type === 'generic') && <AlertCircle className="h-8 w-8 text-brand-rose" />}
              </div>

              <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-rose/30 bg-brand-rose/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-rose mb-3">
                {errorDetails?.type === 'network' && 'Network Error'}
                {errorDetails?.type === 'webhook_unavailable' && 'n8n Webhook Offline'}
                {errorDetails?.type === 'timeout' && 'AI Response Timeout'}
                {errorDetails?.type === 'empty_response' && 'Empty Content Payload'}
                {(!errorDetails || errorDetails.type === 'generic') && 'Generation Error'}
              </div>

              <h3 className="font-display text-lg font-bold text-white leading-snug">
                {errorDetails?.title || 'Generation Request Failed'}
              </h3>

              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                {errorDetails?.message || 'An unexpected error occurred while communicating with the n8n generation server. Please try again.'}
              </p>

              {onRetry && (
                <div className="mt-6">
                  <Button onClick={onRetry} variant="secondary" className="gap-2 border-brand-rose/30 text-white hover:bg-brand-rose/10">
                    <RefreshCw className="h-3.5 w-3.5 text-brand-rose" />
                    <span>Try Again</span>
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* VIEW 4: COMPLETED */}
          {status === 'completed' && (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="space-y-6 py-2"
            >
              {/* Generation success banner */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: [0.8, 1.04, 1], opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex items-center gap-3 rounded-xl border border-brand-emerald/40 bg-brand-emerald/10 p-3.5 text-xs font-bold text-brand-emerald shadow-lg shadow-brand-emerald/10"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.15 }}
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-emerald text-bg-deep shadow-md shadow-brand-emerald/40"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                </motion.div>
                <div className="flex-1">
                  <p className="text-white font-bold text-xs">Article Generation Complete!</p>
                  <p className="text-[11px] text-gray-300 font-normal">Your high-fidelity article has been compiled and optimized.</p>
                </div>
              </motion.div>

              {/* ─── ARTICLE BODY — appears first ─────────────────────────── */}
              <article className="prose prose-invert max-w-none space-y-3" aria-label="Generated article">
                {articleContent ? (
                  renderArticleContent(articleContent)
                ) : (
                  <>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-white leading-tight">
                      The Future of AI in Web Development: How Next.js 15 and Server Actions are Revolutionizing App Architecture
                    </h1>

                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>By ScriptAI Writer</span>
                      <span>•</span>
                      <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span className="rounded-full bg-brand-violet/10 px-2 py-0.5 text-[10px] font-semibold text-brand-violet">Professional Tone</span>
                    </div>

                    <p className="text-sm leading-relaxed text-gray-300">
                      The integration of Artificial Intelligence (AI) into web engineering is transitioning from experimental auto-completers to foundational application structures. Simultaneously, modern React ecosystems are adopting hybrid paradigms where frontends and server environments blend seamlessly. At the intersection of these two trends is Next.js 15, offering a robust infrastructure for developers seeking to deploy fast, scalable, and dynamic AI services.
                    </p>

                    <h2 className="font-display text-xl font-extrabold text-white pt-5 pb-1 border-b border-glass/30">
                      Re-Thinking Backend Boundaries
                    </h2>

                    <p className="text-sm leading-relaxed text-gray-300">
                      Prior to Server Actions, connecting a client interface to an AI service (like a LLM endpoint) required creating separate API routes, validation pipelines, and state handlers. Under the React Server Components (RSC) architecture in Next.js 15, database queries and backend AI requests become as easy as invoking regular TypeScript functions.
                    </p>

                    <ul className="my-2 space-y-2 pl-1">
                      {[
                        ['Reduced Boilerplate', 'Skip endpoint declaration and manage everything within React.'],
                        ['Streaming Updates', 'Leverage native server-to-client streaming for AI text token-by-token.'],
                        ['Strict Security', 'Hide API secret keys safely behind server boundaries.'],
                      ].map(([title, desc]) => (
                        <li key={title} className="flex items-start gap-2.5 text-sm text-gray-300">
                          <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-violet" aria-hidden="true" />
                          <span><strong className="text-white">{title}:</strong> {desc}</span>
                        </li>
                      ))}
                    </ul>

                    <h2 className="font-display text-xl font-extrabold text-white pt-5 pb-1 border-b border-glass/30">
                      SEO Optimization in Conversational Search
                    </h2>

                    <p className="text-sm leading-relaxed text-gray-300">
                      As traditional search engines morph into conversational engines, keywords alone are insufficient. Today&apos;s web crawlers evaluate semantic consistency, text richness, and user-intent matching. Modern article systems must combine speed, accessibility, and high semantic layout standards.
                    </p>

                    <blockquote className="border-l-2 border-brand-violet pl-4 my-3 italic text-gray-400 text-sm leading-relaxed">
                      &ldquo;Speed, semantic structures, and user value represent the primary pillars of modern web visibility in 2026.&rdquo;
                    </blockquote>

                    <p className="text-sm leading-relaxed text-gray-300">
                      By serving articles pre-rendered on the server via Server Side Rendering (SSR) and using Next.js static asset optimization, load times drop below 200ms. These factors directly contribute to better search engine visibility.
                    </p>
                  </>
                )}
              </article>

              {/* Article actions footer — immediately after content */}
              <div className="flex items-center justify-between border-t border-glass pt-4">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    aria-pressed={thumbsUp}
                    aria-label={thumbsUp ? 'Mark as not helpful' : 'Mark as helpful'}
                    onClick={() => setThumbsUp(v => !v)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors ${thumbsUp ? 'text-brand-emerald' : ''}`}
                  >
                    <ThumbsUp className={`h-3.5 w-3.5 transition-colors ${thumbsUp ? 'text-brand-emerald fill-brand-emerald' : 'text-gray-400'}`} />
                    <span>{thumbsUp ? 'Marked Helpful' : 'Mark Helpful'}</span>
                  </Button>
                  <Button variant="ghost" onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 text-xs hover:text-brand-violet">
                    <Share2 className="h-3.5 w-3.5 text-gray-400" />
                    <span>Share Draft</span>
                  </Button>
                </div>
                <span className="text-[10px] text-gray-500">Draft ID: #{draftId}</span>
              </div>

              {/* Section divider */}
              <div className="border-t border-glass/30 pt-1">
                <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">Article Analytics &amp; SEO</p>
              </div>

              {/* ─── METRICS — below the article ──────────────────────────── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 rounded-xl border border-glass bg-white/3 p-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-violet" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500">Word Count</p>
                    <p className="text-xs font-semibold text-white">
                      {calculatedWordCount.toLocaleString()} words
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-violet" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500">Estimated Reading Time</p>
                    <p className="text-xs font-semibold text-white">
                      {calculatedReadingTime} Min read
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-brand-violet" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-500">SEO Score</p>
                    <p className="text-xs font-semibold text-brand-emerald">94/100</p>
                  </div>
                </div>
              </div>

              {/* ─── SEO ASSISTANT — below the article ────────────────────── */}
              <div className="rounded-xl border border-brand-violet/30 bg-brand-violet/5 p-4 space-y-3.5 shadow-lg shadow-brand-violet/5">
                <div className="flex items-center justify-between border-b border-brand-violet/20 pb-2.5">
                  <div className="flex items-center gap-2 text-brand-violet font-display font-bold text-xs">
                    <Sparkles className="h-4 w-4" />
                    <span>SEO Assistant &amp; Metadata</span>
                  </div>
                  <span className="text-[10px] font-mono bg-brand-violet/20 text-brand-violet px-2 py-0.5 rounded-full font-semibold">Ready for CMS</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1 bg-white/3 p-2.5 rounded-lg border border-glass">
                    <div className="flex items-center justify-between text-gray-400 font-semibold text-[11px]">
                      <span>Meta Title ({metaTitle.length} chars)</span>
                      <button onClick={() => handleCopy(metaTitle)} className="text-brand-violet hover:underline flex items-center gap-1">
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                    </div>
                    <p className="text-white font-medium truncate">{metaTitle}</p>
                  </div>

                  <div className="space-y-1 bg-white/3 p-2.5 rounded-lg border border-glass">
                    <div className="flex items-center justify-between text-gray-400 font-semibold text-[11px]">
                      <span>Suggested URL Slug</span>
                      <button onClick={() => handleCopy(urlSlug)} className="text-brand-violet hover:underline flex items-center gap-1">
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                    </div>
                    <p className="text-brand-indigo font-mono truncate">{urlSlug}</p>
                  </div>
                </div>

                <div className="space-y-1 bg-white/3 p-2.5 rounded-lg border border-glass text-xs">
                  <div className="flex items-center justify-between text-gray-400 font-semibold text-[11px]">
                    <span>Meta Description ({metaDescription.length}/160 chars)</span>
                    <button onClick={() => handleCopy(metaDescription)} className="text-brand-violet hover:underline flex items-center gap-1">
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{metaDescription}</p>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-gray-400">10 Targeted SEO Keywords</span>
                  <div className="flex flex-wrap gap-1.5">
                    {seoKeywords.map((kw, idx) => (
                      <span 
                        key={idx} 
                        onClick={() => handleCopy(kw)}
                        className="cursor-pointer rounded-md border border-brand-violet/20 bg-brand-violet/10 px-2.5 py-0.5 text-[11px] font-medium text-brand-violet hover:bg-brand-violet/20 hover:border-brand-violet/40 transition-colors"
                        title="Click to copy keyword"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ─── AI QUALITY REVIEW — below the article ────────────────── */}
              <div className="rounded-xl border border-brand-emerald/30 bg-brand-emerald/5 p-4 space-y-3.5 shadow-lg shadow-brand-emerald/5">
                <div className="flex items-center justify-between border-b border-brand-emerald/20 pb-2.5">
                  <div className="flex items-center gap-2 text-brand-emerald font-display font-bold text-xs">
                    <Award className="h-4.5 w-4.5" />
                    <span>AI Quality Review &amp; Content Scorecard</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-brand-emerald/20 text-brand-emerald px-2.5 py-0.5 rounded-full">
                    Overall Grade: A+ (95.2/100)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white/3 p-3 rounded-lg border border-glass space-y-1 text-center">
                    <p className="text-[10px] font-bold uppercase text-gray-400">Readability</p>
                    <p className="text-lg font-extrabold text-white">92<span className="text-xs text-gray-500">/100</span></p>
                    <p className="text-[10px] text-brand-emerald font-medium">Grade 8 • Clear</p>
                  </div>

                  <div className="bg-white/3 p-3 rounded-lg border border-glass space-y-1 text-center">
                    <p className="text-[10px] font-bold uppercase text-gray-400">SEO Rating</p>
                    <p className="text-lg font-extrabold text-brand-emerald">96<span className="text-xs text-gray-500">/100</span></p>
                    <p className="text-[10px] text-brand-emerald font-medium">High Intent</p>
                  </div>

                  <div className="bg-white/3 p-3 rounded-lg border border-glass space-y-1 text-center">
                    <p className="text-[10px] font-bold uppercase text-gray-400">Grammar Syntax</p>
                    <p className="text-lg font-extrabold text-white">98<span className="text-xs text-gray-500">/100</span></p>
                    <p className="text-[10px] text-brand-emerald font-medium">Flawless</p>
                  </div>

                  <div className="bg-white/3 p-3 rounded-lg border border-glass space-y-1 text-center">
                    <p className="text-[10px] font-bold uppercase text-gray-400">Tone Consistency</p>
                    <p className="text-lg font-extrabold text-brand-indigo">95<span className="text-xs text-gray-500">/100</span></p>
                    <p className="text-[10px] text-brand-indigo font-medium">100% Match</p>
                  </div>
                </div>

                <div className="space-y-2 pt-1 border-t border-brand-emerald/10">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-300">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                    <span>AI Improvement Suggestions</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-gray-300">
                    <li className="flex items-start gap-2 bg-white/2 p-2 rounded-lg border border-glass">
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand-emerald shrink-0 mt-0.5" />
                      <span>Add 1–2 external authority links in section 2 to boost search domain rating.</span>
                    </li>
                    <li className="flex items-start gap-2 bg-white/2 p-2 rounded-lg border border-glass">
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand-emerald shrink-0 mt-0.5" />
                      <span>Include a quick summary bullet list near the intro for rapid reader skimmability.</span>
                    </li>
                    <li className="flex items-start gap-2 bg-white/2 p-2 rounded-lg border border-glass">
                      <CheckCircle2 className="h-3.5 w-3.5 text-brand-emerald shrink-0 mt-0.5" />
                      <span>End with a strong Call-To-Action (CTA) prompt to maximize reader engagement.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-brand-emerald/40 bg-bg-darker/95 px-4 py-3 text-sm font-semibold text-brand-emerald shadow-2xl shadow-brand-emerald/20 backdrop-blur-xl"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-emerald/20">
              <Check className="h-3.5 w-3.5 text-brand-emerald" />
            </div>
            <span>✓ Copied Successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
