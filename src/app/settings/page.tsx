'use client';

import React, { useState } from 'react';
import { 
  Key, 
  Cpu, 
  SlidersHorizontal, 
  Eye, 
  EyeOff, 
  Save, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const [model, setModel] = useState('gemini-1.5-pro');
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [defaultLanguage, setDefaultLanguage] = useState('english');
  const [customInstructions, setCustomInstructions] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {/* Top Banner Title */}
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
          Configuration Settings
        </h2>
        <p className="mt-1 text-sm text-gray-400">
          Manage API keys, select default AI engine models, and configure global instructions.
        </p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Left Column: API Keys and Model Engine */}
        <div className="space-y-6 lg:col-span-7">
          {/* API Credentials */}
          <GlassCard>
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-violet/10 text-brand-violet">
                <Key className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white">API Credentials</h3>
                <p className="text-xs text-gray-400">Provide keys for AI generations. Saved in local storage.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Gemini API Key */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Gemini Pro API Key</label>
                <div className="relative">
                  <input
                    type={showGeminiKey ? 'text' : 'password'}
                    placeholder="Enter Google Gemini API Key..."
                    className="glass-input w-full rounded-xl pl-4 pr-11 py-3 text-sm placeholder:text-gray-600"
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowGeminiKey(!showGeminiKey)}
                    className="absolute top-3.5 right-4 text-gray-500 hover:text-white"
                  >
                    {showGeminiKey ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* OpenAI API Key */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">OpenAI API Key (Optional)</label>
                <div className="relative">
                  <input
                    type={showOpenaiKey ? 'text' : 'password'}
                    placeholder="Enter OpenAI API Key..."
                    className="glass-input w-full rounded-xl pl-4 pr-11 py-3 text-sm placeholder:text-gray-600"
                    value={openaiKey}
                    onChange={(e) => setOpenaiKey(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                    className="absolute top-3.5 right-4 text-gray-500 hover:text-white"
                  >
                    {showOpenaiKey ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-brand-indigo/15 bg-brand-indigo/5 p-3 text-xs text-gray-400">
              <AlertCircle className="h-4.5 w-4.5 text-brand-indigo shrink-0" />
              <p className="leading-relaxed">
                ScriptAI is a serverless frontend. Your API keys are kept secure and are only sent directly to Google/OpenAI endpoints.
              </p>
            </div>
          </GlassCard>

          {/* Model Engine Selector */}
          <GlassCard>
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-violet/10 text-brand-violet">
                <Cpu className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white">Default Model Engine</h3>
                <p className="text-xs text-gray-400">Select the LLM backend for article generation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Option 1: Gemini Pro */}
              <label 
                className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-all duration-200 ${
                  model === 'gemini-1.5-pro' 
                    ? 'border-brand-violet bg-brand-violet/5' 
                    : 'border-glass bg-white/3 hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="model"
                  value="gemini-1.5-pro"
                  className="sr-only"
                  checked={model === 'gemini-1.5-pro'}
                  onChange={() => setModel('gemini-1.5-pro')}
                />
                <span className="font-semibold text-white">Gemini 1.5 Pro</span>
                <span className="mt-1 text-[11px] text-gray-400">Highly recommended. Superior reasoning, deep vocabulary and factual precision.</span>
              </label>

              {/* Option 2: Gemini Flash */}
              <label 
                className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-all duration-200 ${
                  model === 'gemini-1.5-flash' 
                    ? 'border-brand-violet bg-brand-violet/5' 
                    : 'border-glass bg-white/3 hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="model"
                  value="gemini-1.5-flash"
                  className="sr-only"
                  checked={model === 'gemini-1.5-flash'}
                  onChange={() => setModel('gemini-1.5-flash')}
                />
                <span className="font-semibold text-white">Gemini 1.5 Flash</span>
                <span className="mt-1 text-[11px] text-gray-400">Extremely fast. Excellent for drafting shorter summaries and articles.</span>
              </label>

              {/* Option 3: GPT-4o */}
              <label 
                className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-all duration-200 ${
                  model === 'gpt-4o' 
                    ? 'border-brand-violet bg-brand-violet/5' 
                    : 'border-glass bg-white/3 hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="model"
                  value="gpt-4o"
                  className="sr-only"
                  checked={model === 'gpt-4o'}
                  onChange={() => setModel('gpt-4o')}
                />
                <span className="font-semibold text-white">GPT-4o (OpenAI)</span>
                <span className="mt-1 text-[11px] text-gray-400">Advanced versatility. Generates precise and highly marketing-optimized copies.</span>
              </label>

              {/* Option 4: Claude 3.5 Sonnet */}
              <label 
                className={`flex cursor-pointer flex-col rounded-xl border p-4 transition-all duration-200 ${
                  model === 'claude-3.5-sonnet' 
                    ? 'border-brand-violet bg-brand-violet/5' 
                    : 'border-glass bg-white/3 hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="model"
                  value="claude-3.5-sonnet"
                  className="sr-only"
                  checked={model === 'claude-3.5-sonnet'}
                  onChange={() => setModel('claude-3.5-sonnet')}
                />
                <span className="font-semibold text-white">Claude 3.5 Sonnet</span>
                <span className="mt-1 text-[11px] text-gray-400">Outstanding prose styles. Masterful creative and explanatory structures.</span>
              </label>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Default Parameters and System Directives */}
        <div className="space-y-6 lg:col-span-5">
          {/* Defaults Configuration */}
          <GlassCard>
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-violet/10 text-brand-violet">
                <SlidersHorizontal className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white">Global Defaults</h3>
                <p className="text-xs text-gray-400">Set default pre-configurations</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Default Language</label>
                <select
                  className="glass-input w-full rounded-xl px-4 py-3 text-sm [&>option]:bg-bg-darker"
                  value={defaultLanguage}
                  onChange={(e) => setDefaultLanguage(e.target.value)}
                >
                  <option value="english">🇺🇸 English</option>
                  <option value="spanish">🇪🇸 Spanish</option>
                  <option value="french">🇫🇷 French</option>
                  <option value="german">🇩🇪 German</option>
                </select>
              </div>

              {/* Custom directives */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Custom System Instructions</label>
                <textarea
                  rows={4}
                  placeholder="e.g. Always write in UK English. Use bullet lists instead of dense paragraphs. Keep sentences under 25 words..."
                  className="glass-input w-full rounded-xl p-3 text-sm placeholder:text-gray-600"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                />
              </div>
            </div>
          </GlassCard>

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <Button type="submit" isLoading={saving} className="w-full sm:w-auto font-bold px-6">
              {saved ? (
                <>
                  <Check className="h-4.5 w-4.5 text-brand-emerald" />
                  <span>Changes Saved</span>
                </>
              ) : (
                <>
                  <Save className="h-4.5 w-4.5" />
                  <span>Save Configuration</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
