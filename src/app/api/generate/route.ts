import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function generateFallbackArticle(topic: string, tone: string, targetCount: number): string {
  const cleanTopic = topic ? topic.trim() : 'AI & Modern Technology';
  const cleanTone = tone ? tone.trim() : 'Professional';

  // Base sections
  const header = `[${cleanTopic}]`;
  const intro = `{Executive Overview & Introduction}
In today's rapidly evolving digital landscape, understanding ${cleanTopic} has become paramount for professionals and organizations striving for operational excellence. As modern technology ecosystems advance, maintaining a ${cleanTone.toLowerCase()} tone ensures maximum engagement and semantic clarity across all audiences. High performance and seamless integration are the core pillars of this transformation, driving significant value and growth.`;

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
    `** Strict Validation: Enforce strict typescript compilation options and comprehensive integration testing parameters.`,
    `** Resilient Recovery: Standardize instant rollback routines and active failover protocols for database clusters.`,
    `** Performance Profiling: Regularly inspect network payloads and resource allocations to identify bottlenecks early.`
  ];

  const quote = `> "True digital transformation lies not merely in adopting new tools, but in re-architecting workflows for speed, reliability, and measurable impact."`;

  const conclusion = `[Conclusion & Next Steps]
Mastering ${cleanTopic} requires a balanced synthesis of technical precision and strategic foresight. Aligning these core principles with key performance indicators unlocks new benchmarks of excellence for modern enterprise systems. Continuous learning and iterative optimization remain the best pathways to sustainable market leadership.`;

  // Construct dynamic content to match targetCount
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
    content += `\n\n{Supplementary Analysis Part ${repeatCounter}}\nAs we explore the deeper dimensions of ${cleanTopic}, secondary factors like operational overhead and long-term tech debt become highly influential. High-performing organizations establish dedicated technical councils to review design patterns and maintain standard libraries. Keeping dependencies up to date and monitoring deprecated APIs ensures the codebase remains robust and adaptable. Furthermore, documenting edge-case patterns helps onboard junior engineers quickly, maintaining high team velocity.`;
    repeatCounter++;
    currentWords = content.split(/\s+/).filter(Boolean).length;
  }

  content += `\n\n${conclusion}`;
  return content;
}

export async function POST(request: Request) {
  let topic = 'Modern Technology Trends';
  let tone = 'Professional';
  let wordCount: string | undefined = undefined;

  try {
    const body = await request.json() as Record<string, string>;
    if (body) {
      topic = body.topic || topic;
      tone = body.tone || tone;
      wordCount = body.wordCount;
    }
  } catch {
    // Body parse fallback
  }

  // VALIDATION & SANITIZATION RULES:
  // - Minimum word count = 300
  // - Maximum word count = 3000
  // - Default = 500 when no value is supplied.
  let validatedWordCount = 500;
  if (wordCount !== undefined && wordCount !== null && String(wordCount).trim() !== '') {
    const parsed = parseInt(String(wordCount), 10);
    if (!isNaN(parsed)) {
      validatedWordCount = Math.max(300, Math.min(3000, parsed));
    }
  }

  const finalWordCountStr = String(validatedWordCount);

  // Explicit payload sent to n8n workflow
  const n8nPayload = {
    topic,
    tone,
    wordCount: finalWordCountStr,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const n8nResponse = await fetch('https://gauravsinghx2510.app.n8n.cloud/webhook/generate-article', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (n8nResponse.ok) {
      const textData = await n8nResponse.text();
      if (textData && textData.trim()) {
        return new NextResponse(textData, {
          status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    }
  } catch {
    clearTimeout(timeoutId);
  }

  // Fallback mode if n8n webhook is inactive or unreachable
  const fallbackText = generateFallbackArticle(topic, tone, validatedWordCount);
  return new NextResponse(fallbackText, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
