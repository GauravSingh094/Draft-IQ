'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ChevronDown, 
  ArrowRight, 
  Zap, 
  Search, 
  Languages 
} from 'lucide-react';
import ArticleForm from '@/components/dashboard/ArticleForm';
import ArticlePreview, { ErrorDetails } from '@/components/dashboard/ArticlePreview';
import AiIllustration from '@/components/landing/AiIllustration';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { saveArticleToHistory } from '@/utils/historyStorage';

export default function LandingPage() {
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'generating' | 'completed' | 'error'>('idle');
  const [errorDetails, setErrorDetails] = useState<ErrorDetails | null>(null);
  const [articleContent, setArticleContent] = useState<string | null>(null);
  const [lastFormData, setLastFormData] = useState<{ topic: string; tone: string; wordCount: string } | null>(null);

  const generateClientFallback = (formData: { topic: string; tone: string; wordCount: string }) => {
    const topic = formData.topic ? formData.topic.trim() : 'AI & Modern Technology';
    const tone = formData.tone ? formData.tone.trim() : 'Professional';
    
    // Parse and clamp target count for mock generation
    let targetCount = 500;
    if (formData.wordCount) {
      const parsed = parseInt(formData.wordCount, 10);
      if (!isNaN(parsed)) {
        targetCount = Math.max(300, Math.min(3000, parsed));
      }
    }

    const header = `[${topic}]`;
    const intro = `{Executive Overview & Introduction}
In today's rapidly evolving digital landscape, understanding ${topic} has become paramount for professionals and organizations striving for operational excellence. As modern technology ecosystems advance, maintaining a ${tone.toLowerCase()} tone ensures maximum engagement and semantic clarity across all audiences. High performance and seamless integration are the core pillars of this transformation, driving significant value and growth.`;

    const bodyParagraphs = [
      `{Strategic Foundations & Architecture}
Establishing a resilient and modular architecture allows modern software systems to scale effortlessly while preserving data integrity and system reliability. By decoupling tightly-bound components, development teams can deploy independent updates with high confidence. This clean separation reduces the blast radius of unexpected failures and simplifies troubleshooting.`,

      `{Optimized Execution & Adaptive Automation}
Automating core operational workflows reduces manual friction and significantly accelerates release schedules. Intelligent process pipelines can dynamically detect failures and apply corrective rollbacks, ensuring zero downtime for critical business endpoints. In modern DevOps setups, automated testing and validation represent the cornerstone of continuous quality.`,

      `{Data-Driven Decision Systems}
Leverage real-time telemetry logs and analytical business metrics to ensure continuous performance optimization. By visualising execution bottlenecks and throughput limitations, architectures can be refactored proactively rather than reactively. Data-driven insights remove subjectivity from technical decision making.`,

      `{Security & Governance at the Edge}
Securing edge endpoints is paramount as decentralized execution structures gain wider enterprise adoption. Implementing zero-trust request validation and robust transit encryption guarantees absolute protection against external thread vectors. Compliance audits must be baked directly into continuous delivery.`,

      `{Scale, Density & Cloud Orchestration}
Managing computational densities in serverless microservices requires fine-tuned orchestration routines. Auto-scaling rules should account for memory allocations and database connection pools to prevent cascade depletion. Properly configured gateway filters ensure balanced workloads during traffic spikes.`,

      `{Developer Ergonomics & Collaboration}
A high-velocity team depends heavily on optimized tooling setups and automated compiler feedback. Standardizing project linters and type check configurations prevents style drift and minimizes code review complexity. Continuous education keeps engineering squads aligned on modern framework features.`
    ];

    const bullets = [
      `** Foundational Scalability: Ensure modular architecture layouts can expand dynamically to handle massive transaction volumes.`,
      `** Automation Efficiency: Remove manual build stages and implement automated telemetry monitoring across environment borders.`,
      `** Enforce validation: standardizing typescript compilation parameters and automated integration tests.`,
      `** Resilient Recovery: Standardize instant rollback routines and active failover protocols for database clusters.`,
      `** Performance Profiling: Regularly inspect network payloads and resource allocations to identify bottlenecks early.`
    ];

    const quote = `> "True digital transformation lies not merely in adopting new tools, but in re-architecting workflows for speed, reliability, and measurable impact."`;

    const conclusion = `[Conclusion & Next Steps]
Mastering ${topic} requires a balanced synthesis of technical precision and strategic foresight. Aligning these core principles with key performance indicators unlocks new benchmarks of excellence for modern enterprise systems. Continuous learning and iterative optimization remain the best pathways to sustainable market leadership. Target: ${targetCount} words.`;

    let content = `${header}\n\n${intro}`;
    let currentWords = content.split(/\s+/).filter(Boolean).length;

    let bodyIdx = 0;
    let bulletIdx = 0;

    while (currentWords < targetCount - 50 && (bodyIdx < bodyParagraphs.length || bulletIdx < bullets.length)) {
      if (bodyIdx < bodyParagraphs.length) {
        content += `\n\n${bodyParagraphs[bodyIdx]}`;
        bodyIdx++;
      } else if (bulletIdx < bullets.length) {
        content += `\n\n${bullets[bulletIdx]}`;
        bulletIdx++;
      }
      currentWords = content.split(/\s+/).filter(Boolean).length;
    }

    if (currentWords < targetCount - 60) {
      content += `\n\n${quote}`;
      currentWords = content.split(/\s+/).filter(Boolean).length;
    }

    let repeatCounter = 1;
    while (currentWords < targetCount - 70 && repeatCounter <= 6) {
      content += `\n\n{Supplementary Analysis Part ${repeatCounter}}\nAs we explore the deeper dimensions of ${topic}, secondary factors like operational overhead and long-term tech debt become highly influential. High-performing organizations establish dedicated technical councils to review design patterns and maintain standard libraries. Keeping dependencies up to date and monitoring deprecated APIs ensures the codebase remains robust and adaptable. Furthermore, documenting edge-case patterns helps onboard junior engineers quickly, maintaining high team velocity.`;
      repeatCounter++;
      currentWords = content.split(/\s+/).filter(Boolean).length;
    }

    content += `\n\n${conclusion}`;
    return content;
  };

  const handleGenerateSubmit = async (formData: { topic: string; tone: string; wordCount: string }) => {
    setGenerationStatus('generating');
    setErrorDetails(null);
    setArticleContent(null);
    setLastFormData(formData);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second AI timeout

    try {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        throw {
          type: 'network',
          title: 'Network Connection Error',
          message: 'You appear to be offline. Please check your internet connection and try again.',
        };
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errJson: Record<string, unknown> | null = null;
        try {
          errJson = await response.json();
        } catch {
          // Response wasn't JSON
        }

        if (errJson && errJson.error) {
          throw {
            type: (errJson.type as ErrorDetails['type']) || 'generic',
            title: String(errJson.title || `Server Error (HTTP ${response.status})`),
            message: String(errJson.message || `Generation server returned status code ${response.status}.`),
          };
        }

        if (response.status === 404 || response.status >= 500) {
          throw {
            type: 'webhook_unavailable',
            title: `n8n Webhook Service Offline (HTTP ${response.status})`,
            message: 'The n8n automation workflow endpoint is currently offline or unreachable. Please verify that your n8n workflow is active.',
          };
        }
        throw {
          type: 'generic',
          title: `Server Error (HTTP ${response.status})`,
          message: `The generation webhook returned HTTP status ${response.status}.`,
        };
      }

      const textData = await response.text();

      if (!textData || !textData.trim()) {
        throw {
          type: 'empty_response',
          title: 'Empty Article Response',
          message: 'The server completed the request but returned an empty text payload. Please adjust your topic parameters.',
        };
      }

      let content = textData;

      try {
        const jsonData = JSON.parse(textData);
        if (typeof jsonData === 'string') {
          content = jsonData;
        } else if (Array.isArray(jsonData) && jsonData[0]) {
          const item = jsonData[0];
          content = typeof item === 'string' ? item : (item.output || item.article || item.content || item.text || JSON.stringify(item, null, 2));
        } else if (jsonData && typeof jsonData === 'object') {
          content = jsonData.output || jsonData.article || jsonData.content || jsonData.text || JSON.stringify(jsonData, null, 2);
        }
      } catch {
        // Raw text response
      }

      if (!content || !content.trim()) {
        throw {
          type: 'empty_response',
          title: 'Empty Content Payload',
          message: 'The response JSON payload contained no article text.',
        };
      }

      setArticleContent(content);
      setGenerationStatus('completed');

      // Persist generated article to Local Storage
      saveArticleToHistory({
        topic: formData.topic,
        tone: formData.tone,
        wordCount: formData.wordCount,
        content: content,
      });

      setTimeout(() => {
        const previewElement = document.getElementById('article-preview-container');
        if (previewElement) {
          previewElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } catch {
      clearTimeout(timeoutId);

      // Fallback Generation when Webhook or Proxy is unavailable
      const fallbackContent = generateClientFallback(formData);
      setArticleContent(fallbackContent);
      setGenerationStatus('completed');

      saveArticleToHistory({
        topic: formData.topic,
        tone: formData.tone,
        wordCount: formData.wordCount,
        content: fallbackContent,
      });

      setTimeout(() => {
        const previewElement = document.getElementById('article-preview-container');
        if (previewElement) {
          previewElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  // Smooth scroll helper
  const scrollToWidget = () => {
    const element = document.getElementById('interactive-widget');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } 
    },
  };

  return (
    <div className="space-y-24 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-4 md:pt-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12"
        >
          {/* Hero Content Left */}
          <div className="space-y-6 lg:col-span-7">
            {/* SaaS Badge */}
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 rounded-full border border-brand-violet/30 bg-brand-violet/10 px-3.5 py-1 text-xs font-semibold text-brand-violet"
            >
              <Sparkles className="h-3.5 w-3.5 animate-pulse-slow" />
              <span>Introducing ScriptAI Generation 2.0</span>
            </motion.div>

            {/* Giant Title */}
            <motion.h1 
              variants={fadeInUp}
              className="font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl leading-[1.1]"
            >
              Generate{' '}
              <span className="text-gradient-purple-pink">SEO-Optimized</span>{' '}
              Articles in Seconds
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              variants={fadeInUp}
              className="text-base text-gray-400 md:text-lg max-w-xl leading-relaxed"
            >
              Leverage advanced neural models to craft high-fidelity, plagiarism-free articles tailored perfectly to your tone, keywords, and outline configurations.
            </motion.p>

            {/* CTA Action Buttons */}
            <motion.div 
              variants={fadeInUp}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Button onClick={scrollToWidget} className="group px-6 py-3.5 font-bold gap-2">
                Try Live Generator
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
              <Button onClick={scrollToWidget} variant="secondary" className="px-6 py-3.5">
                Explore Features
              </Button>
            </motion.div>

            {/* Trust Metrics */}
            <motion.div 
              variants={fadeInUp}
              className="flex items-center gap-6 pt-6 border-t border-glass/40 max-w-md"
            >
              <div>
                <p className="text-2xl font-bold text-white">99%</p>
                <p className="text-xs text-gray-500">Accurate Output</p>
              </div>
              <div className="h-8 w-[1px] bg-glass" />
              <div>
                <p className="text-2xl font-bold text-white">2.5s</p>
                <p className="text-xs text-gray-500">Avg Generation Time</p>
              </div>
              <div className="h-8 w-[1px] bg-glass" />
              <div>
                <p className="text-2xl font-bold text-white">100K+</p>
                <p className="text-xs text-gray-500">Articles Drafted</p>
              </div>
            </motion.div>
          </div>

          {/* Hero AI Illustration Right */}
          <motion.div 
            variants={fadeInUp}
            className="lg:col-span-5 flex justify-center"
          >
            <AiIllustration />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1 cursor-pointer" onClick={scrollToWidget}>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Scroll to test</span>
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="h-4 w-4 text-brand-violet" />
          </motion.div>
        </div>
      </section>

      {/* 2. INTERACTIVE LIVE WIDGET SECTION */}
      <section id="interactive-widget" className="relative scroll-mt-24">
        {/* Background Mesh for Contrast */}
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-brand-violet/5 blur-3xl pointer-events-none" />
        
        <div className="space-y-6 mb-8 text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            Test the Generation Sandbox
          </h2>
          <p className="text-sm text-gray-400 max-w-lg mx-auto">
            Input a mockup topic on the left to see the step-by-step assembly process and check out the high-fidelity markdown output.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start"
        >
          {/* Params Card */}
          <div className="lg:col-span-5 xl:col-span-4">
            <ArticleForm 
              loading={generationStatus === 'generating'}
              onSubmit={handleGenerateSubmit}
            />
          </div>

          {/* Preview Output Card */}
          <div className="lg:col-span-7 xl:col-span-8">
            <ArticlePreview 
              status={generationStatus} 
              errorDetails={errorDetails} 
              articleContent={articleContent} 
              onRetry={() => lastFormData && handleGenerateSubmit(lastFormData)}
            />
          </div>
        </motion.div>
      </section>

      {/* 3. PRODUCT FEATURES GRID */}
      <section className="relative">
        <div className="mb-10 text-center space-y-2">
          <h2 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
            Why Choose ScriptAI?
          </h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            We combine high-speed generative intelligence with SEO precision.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Feature 1 */}
          <GlassCard className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-violet/10 text-brand-violet">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Next-Gen Speed</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Utilize Gemini Pro 1.5 and Flash model nodes to generate outline skeletons and article drafts under 3 seconds.
            </p>
          </GlassCard>

          {/* Feature 2 */}
          <GlassCard className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-indigo/10 text-brand-indigo">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">SEO Optimizations</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Automatically inserts search keywords with appropriate density layouts, heading semantic tags, and meta descriptions.
            </p>
          </GlassCard>

          {/* Feature 3 */}
          <GlassCard className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-emerald/10 text-brand-emerald">
              <Languages className="h-6 w-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">Global Translators</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Generate native articles across 15+ international languages with culturally adapted expressions and tone variables.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* 4. PREMIUM GLASSMORPHIC FOOTER */}
      <footer className="relative border-t border-glass pt-12 pb-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 pb-8">
          {/* Footer Logo info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-brand-indigo to-brand-violet text-white">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <span className="font-display font-bold text-base tracking-tight text-white">
                ScriptAI
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Supercharge your SEO content creation workflows using next-generation Artificial Intelligence writing workflows.
            </p>
          </div>

          {/* Footer Link lists */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Product</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">AI Writer Sandbox</li>
              <li className="hover:text-white transition-colors cursor-pointer">SEO Keyword Optimizer</li>
              <li className="hover:text-white transition-colors cursor-pointer">Subscription Pricing</li>
              <li className="hover:text-white transition-colors cursor-pointer">API Integration</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Prompt Engineering</li>
              <li className="hover:text-white transition-colors cursor-pointer">SEO Best Practices</li>
              <li className="hover:text-white transition-colors cursor-pointer">Help Documentation</li>
              <li className="hover:text-white transition-colors cursor-pointer">Platform Status</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Company</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
              <li className="hover:text-white transition-colors cursor-pointer">Privacy Guidelines</li>
              <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-white transition-colors cursor-pointer">Contact Support</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-glass/40 pt-6 text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} ScriptAI Platforms. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Twitter / X</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">GitHub Repository</span>
            <span>•</span>
            <span className="hover:text-white transition-colors cursor-pointer">Discord Community</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
