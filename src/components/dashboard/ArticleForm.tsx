'use client';

import React, { useState } from 'react';
import { Sparkles, Sliders, Type, BarChart } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';

interface ArticleFormProps {
  loading: boolean;
  onSubmit: (data: { topic: string; tone: string; wordCount: string }) => void;
}

export default function ArticleForm({ loading, onSubmit }: ArticleFormProps) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Professional');
  const [wordCount, setWordCount] = useState('500');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onSubmit({ topic, tone, wordCount });
  };

  return (
    <GlassCard className="h-full">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-violet/10 text-brand-violet">
          <Sliders className="h-4.5 w-4.5" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-white">Generation Parameters</h2>
          <p className="text-xs text-gray-400">Configure your writing requirements</p>
        </div>
      </div>

      <form role="form" aria-label="Article Generation Form" onSubmit={handleSubmit} className="space-y-5">
        {/* Topic Input */}
        <div className="space-y-1.5">
          <label htmlFor="topic" className="flex items-center gap-1.5 text-xs font-semibold text-gray-300">
            <Type className="h-3.5 w-3.5 text-brand-violet" />
            Article Topic <span className="text-brand-rose" aria-hidden="true">*</span>
          </label>
          <textarea
            id="topic"
            rows={4}
            placeholder="e.g. How WebAssembly is expanding beyond browsers into edge servers..."
            className="glass-input w-full rounded-xl p-3 text-sm placeholder:text-gray-500 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:outline-none"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
            required
            aria-required="true"
            aria-label="Article Topic"
            aria-describedby="topic-hint"
          />
          <p id="topic-hint" className="text-[11px] text-gray-500">Provide the primary subject or prompt for your article.</p>
        </div>

        {/* Tone Selector */}
        <div className="space-y-1.5">
          <label htmlFor="tone" className="text-xs font-semibold text-gray-300">Tone of Voice</label>
          <select
            id="tone"
            className="glass-input w-full rounded-xl px-4 py-3 text-sm [&>option]:bg-bg-darker disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:outline-none cursor-pointer"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={loading}
            aria-label="Select Tone of Voice"
          >
            <option value="Professional">💼 Professional</option>
            <option value="Casual">💬 Casual</option>
            <option value="Academic">🎓 Academic</option>
            <option value="Marketing">📣 Marketing</option>
          </select>
        </div>

        {/* Word Count Selector */}
        <div className="space-y-1.5">
          <label htmlFor="wordCount" className="flex items-center gap-1.5 text-xs font-semibold text-gray-300">
            <BarChart className="h-3.5 w-3.5 text-brand-violet" />
            Word Count
          </label>
          <select
            id="wordCount"
            className="glass-input w-full rounded-xl px-4 py-3 text-sm [&>option]:bg-bg-darker disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:outline-none cursor-pointer"
            value={wordCount}
            onChange={(e) => setWordCount(e.target.value)}
            disabled={loading}
            aria-label="Select Target Word Count"
          >
            <option value="300">⚡ 300 words</option>
            <option value="500">📖 500 words</option>
            <option value="1000">📚 1000 words</option>
            <option value="1500">📚 1500 words</option>
            <option value="2000">📚 2000 words</option>
            <option value="3000">📚 3000 words</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            isLoading={loading}
            disabled={loading || !topic.trim()}
            className="w-full text-base font-bold py-3.5 focus-visible:ring-2 focus-visible:ring-brand-violet focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep focus-visible:outline-none"
            aria-label="Generate Article Button"
            aria-busy={loading}
          >
            <Sparkles className="h-4.5 w-4.5 animate-pulse-slow" />
            Generate Article
          </Button>
        </div>
      </form>
    </GlassCard>
  );
}
